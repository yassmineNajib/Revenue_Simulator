import { useState, useEffect } from 'react';
import { MerchantData, AuthState } from '../types';
import { backendApi } from '../services/backendApi';

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
      if (backendApi.isAuthenticated()) {
        setAuthState(prev => ({ ...prev, loading: true }));
        
        try {
          // Verify token with backend
          const verifyResponse = await backendApi.verifyToken();
          
          if (verifyResponse.success && verifyResponse.data) {
            // Authenticate with Storeino through backend
            const storeinoAuthResponse = await backendApi.authenticateWithStoreino();
            
            if (storeinoAuthResponse.success && storeinoAuthResponse.data) {
              // Get stores using the access token
              const storesResponse = await backendApi.getStores(storeinoAuthResponse.data.accessToken);
              
              if (storesResponse.success && storesResponse.data && storesResponse.data.length > 0) {
                const firstStore = storesResponse.data[0];
                const metricsResponse = await backendApi.getStoreMetrics(firstStore.id, storeinoAuthResponse.data.accessToken);
                
                const merchant: MerchantData = {
                  id: firstStore.id,
                  name: firstStore.name,
                  email: verifyResponse.data.user.email,
                  storeUrl: firstStore.domain,
                  plan: firstStore.plan,
                  metrics: {
                    monthlyVisitors: metricsResponse.data?.monthly_visitors || 0,
                    conversionRate: metricsResponse.data?.conversion_rate || 0,
                    averageCartValue: metricsResponse.data?.average_order_value || 0,
                    totalOrders: metricsResponse.data?.total_orders || 0,
                    totalRevenue: metricsResponse.data?.total_revenue || 0,
                    customerCount: metricsResponse.data?.total_customers || 0,
                    averageOrderFrequency: 2.5,
                    customerLifespan: 18
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
                throw new Error('No stores found');
              }
            } else {
              throw new Error('Failed to authenticate with Storeino');
            }
          } else {
            throw new Error('Token verification failed');
          }
        } catch (error) {
          console.error('Auth check error:', error);
          backendApi.logout();
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

    console.log('🔐 Starting login process...');
    console.log('Backend API authenticated:', backendApi.isAuthenticated());

    try {
      // Login with backend using Storeino credentials
      console.log('📡 Authenticating with backend...');
      const authResponse = await backendApi.loginWithStoreino(clientId, clientSecret);
      console.log('🔑 Backend auth response:', authResponse);

      if (authResponse.success && authResponse.data) {
        // Authenticate with Storeino through backend
        console.log('🌐 Authenticating with Storeino through backend...');
        const storeinoAuthResponse = await backendApi.authenticateWithStoreino(clientId, clientSecret);
        console.log('🏪 Storeino auth response:', storeinoAuthResponse);
        
        if (storeinoAuthResponse.success && storeinoAuthResponse.data) {
          // Get stores using the access token
          console.log('🏬 Fetching stores...');
          const storesResponse = await backendApi.getStores(storeinoAuthResponse.data.accessToken);
          console.log('🏪 Stores response:', storesResponse);
          
          if (storesResponse.success && storesResponse.data && storesResponse.data.length > 0) {
            const firstStore = storesResponse.data[0];
            console.log('📊 Fetching store metrics...');
            const metricsResponse = await backendApi.getStoreMetrics(firstStore.id, storeinoAuthResponse.data.accessToken);
            console.log('📈 Metrics response:', metricsResponse);
            
            const merchant: MerchantData = {
              id: firstStore.id,
              name: firstStore.name,
              email: authResponse.data.user.email,
              storeUrl: firstStore.domain,
              plan: firstStore.plan,
              metrics: {
                monthlyVisitors: metricsResponse.data?.monthly_visitors || 0,
                conversionRate: metricsResponse.data?.conversion_rate || 0,
                averageCartValue: metricsResponse.data?.average_order_value || 0,
                totalOrders: metricsResponse.data?.total_orders || 0,
                totalRevenue: metricsResponse.data?.total_revenue || 0,
                customerCount: metricsResponse.data?.total_customers || 0,
                averageOrderFrequency: 2.5,
                customerLifespan: 18
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
            error: storeinoAuthResponse.error || 'Failed to authenticate with Storeino'
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

  const loginWithEmailPassword = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const authResponse = await backendApi.login(email, password);

      if (authResponse.success && authResponse.data) {
        // Try to authenticate with Storeino (user should have stored credentials)
        const storeinoAuthResponse = await backendApi.authenticateWithStoreino();
        
        if (storeinoAuthResponse.success && storeinoAuthResponse.data) {
          const storesResponse = await backendApi.getStores(storeinoAuthResponse.data.accessToken);
          
          if (storesResponse.success && storesResponse.data && storesResponse.data.length > 0) {
            const firstStore = storesResponse.data[0];
            const metricsResponse = await backendApi.getStoreMetrics(firstStore.id, storeinoAuthResponse.data.accessToken);
            
            const merchant: MerchantData = {
              id: firstStore.id,
              name: firstStore.name,
              email: authResponse.data.user.email,
              storeUrl: firstStore.domain,
              plan: firstStore.plan,
              metrics: {
                monthlyVisitors: metricsResponse.data?.monthly_visitors || 0,
                conversionRate: metricsResponse.data?.conversion_rate || 0,
                averageCartValue: metricsResponse.data?.average_order_value || 0,
                totalOrders: metricsResponse.data?.total_orders || 0,
                totalRevenue: metricsResponse.data?.total_revenue || 0,
                customerCount: metricsResponse.data?.total_customers || 0,
                averageOrderFrequency: 2.5,
                customerLifespan: 18
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
            // User is authenticated but no Storeino data available
            setAuthState({
              isAuthenticated: true,
              merchant: null,
              loading: false,
              error: null
            });
          }
        } else {
          // User is authenticated but Storeino auth failed
          setAuthState(prev => ({
            ...prev,
            loading: false,
            error: 'Storeino authentication failed'
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
    
    backendApi.logout();
    
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
      // Verify backend token first
      const verifyResponse = await backendApi.verifyToken();
      
      if (!verifyResponse.success) {
        throw new Error('Authentication expired');
      }

      // Get fresh Storeino auth
      const storeinoAuthResponse = await backendApi.authenticateWithStoreino();
      
      if (storeinoAuthResponse.success && storeinoAuthResponse.data) {
        // Fetch updated store metrics
        const metricsResponse = await backendApi.getStoreMetrics(authState.merchant.id, storeinoAuthResponse.data.accessToken);
        
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
      } else {
        throw new Error('Failed to authenticate with Storeino');
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
    loginWithEmailPassword,
    logout,
    refreshMerchantData
  };
};