import { useState, useEffect } from 'react';
import { MerchantData, AuthState } from '../types';
import { storeinoApi, StoreinoStoreData, StoreinoStoreMetrics, StoreinoClientAuth } from '../services/storeinoApi';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    merchant: null,
    loading: false,
    error: null
  });

  // Check for existing session on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      if (storeinoApi.isAuthenticated()) {
        setAuthState(prev => ({ ...prev, loading: true }));
        
        try {
          // Try to fetch merchant stores to validate token
          const storesResponse = await storeinoApi.getMerchantStores();
          
          if (storesResponse.success && storesResponse.data && storesResponse.data.length > 0) {
            // Get the first store's data and metrics
            const firstStore = storesResponse.data[0];
            const metricsResponse = await storeinoApi.getStoreMetrics(firstStore.id);
            
            if (metricsResponse.success && metricsResponse.data) {
              const merchant: MerchantData = {
                id: firstStore.id,
                name: firstStore.name,
                email: '', // Will be filled from auth response
                storeUrl: firstStore.domain,
                plan: firstStore.plan,
                metrics: {
                  monthlyVisitors: metricsResponse.data.monthly_visitors || 0,
                  conversionRate: metricsResponse.data.conversion_rate || 0,
                  averageCartValue: metricsResponse.data.average_order_value || 0,
                  totalOrders: metricsResponse.data.total_orders || 0,
                  totalRevenue: metricsResponse.data.total_revenue || 0,
                  customerCount: metricsResponse.data.total_customers || 0,
                  averageOrderFrequency: 2.5, // Default value
                  customerLifespan: 18 // Default value
                },
                lastUpdated: new Date().toISOString()
              };
              
              setAuthState({
                isAuthenticated: true,
                merchant,
                loading: false,
                error: null
              });
            } else {
              throw new Error('Failed to fetch store metrics');
            }
          } else {
            throw new Error('No stores found or invalid token');
          }
        } catch (error) {
          // Token is invalid or expired
          await storeinoApi.logout();
          setAuthState({
            isAuthenticated: false,
            merchant: null,
            loading: false,
            error: null
          });
        }
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (clientId: string, clientSecret: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Authenticate with Storeino API
      const authResponse = await storeinoApi.authenticateClient({ clientId, clientSecret });

      if (authResponse.success && authResponse.data) {
        // Get stores after authentication
        const storesResponse = await storeinoApi.getMerchantStores();
        
        if (storesResponse.success && storesResponse.data && storesResponse.data.length > 0) {
          // Get metrics for the first store
          const firstStore = storesResponse.data[0];
          const metricsResponse = await storeinoApi.getStoreMetrics(firstStore.id);
          
          const merchant: MerchantData = {
            id: firstStore.id,
            name: firstStore.name,
            email: '', // Not available from client credentials flow
            storeUrl: firstStore.domain,
            plan: firstStore.plan,
            metrics: {
              monthlyVisitors: metricsResponse.data?.monthly_visitors || 0,
              conversionRate: metricsResponse.data?.conversion_rate || 0,
              averageCartValue: metricsResponse.data?.average_order_value || 0,
              totalOrders: metricsResponse.data?.total_orders || 0,
              totalRevenue: metricsResponse.data?.total_revenue || 0,
              customerCount: metricsResponse.data?.total_customers || 0,
              averageOrderFrequency: 2.5, // Default - could be calculated from orders
              customerLifespan: 18 // Default - could be calculated from customer data
            },
            lastUpdated: new Date().toISOString()
          };
          
          setAuthState({
            isAuthenticated: true,
            merchant,
            loading: false,
            error: null
          });
        } else {
          setAuthState(prev => ({
            ...prev,
            loading: false,
            error: 'No stores found for this merchant'
          }));
        }
      } else {
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: authResponse.error || 'Login failed'
        }));
      }
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Login failed'
      }));
    }
  };

  const logout = async () => {
    setAuthState(prev => ({ ...prev, loading: true }));
    
    try {
      await storeinoApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    setAuthState({
      isAuthenticated: false,
      merchant: null,
      loading: false,
      error: null
    });
  };

  const refreshMerchantData = async () => {
    if (!authState.merchant) return;

    setAuthState(prev => ({ ...prev, loading: true }));

    try {
      // Refresh token if needed
      const tokenValid = await storeinoApi.refreshTokenIfNeeded();
      
      if (!tokenValid) {
        throw new Error('Authentication expired');
      }

      // Fetch updated store metrics
      const metricsResponse = await storeinoApi.getStoreMetrics(authState.merchant.id);
      
      if (metricsResponse.success && metricsResponse.data) {
        const updatedMerchant: MerchantData = {
          ...authState.merchant,
          metrics: {
            monthlyVisitors: metricsResponse.data.monthly_visitors || 0,
            conversionRate: metricsResponse.data.conversion_rate || 0,
            averageCartValue: metricsResponse.data.average_order_value || 0,
            totalOrders: metricsResponse.data.total_orders || 0,
            totalRevenue: metricsResponse.data.total_revenue || 0,
            customerCount: metricsResponse.data.total_customers || 0,
            averageOrderFrequency: authState.merchant.metrics.averageOrderFrequency,
            customerLifespan: authState.merchant.metrics.customerLifespan
          },
          lastUpdated: new Date().toISOString()
        };
        
        setAuthState(prev => ({
          ...prev,
          merchant: updatedMerchant,
          loading: false
        }));
      } else {
        throw new Error('Failed to refresh merchant data');
      }
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to refresh data'
      }));
    }
  };

  return {
    ...authState,
    login,
    logout,
    refreshMerchantData
  };
};