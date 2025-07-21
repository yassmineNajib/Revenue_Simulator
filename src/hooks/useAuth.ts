import { useState, useEffect } from 'react';
import { MerchantData, AuthState } from '../types';
import { storeinoApi } from '../services/storeinoApi';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    merchant: null,
    loading: false,
    error: null
  });

  // Check for existing session on mount
  useEffect(() => {
    const savedMerchant = localStorage.getItem('storeino_merchant');
    if (savedMerchant) {
      try {
        const merchant = JSON.parse(savedMerchant);
        setAuthState({
          isAuthenticated: true,
          merchant,
          loading: false,
          error: null
        });
      } catch (error) {
        localStorage.removeItem('storeino_merchant');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // For demo purposes, use mock data
      // Replace with actual API call: storeinoApi.authenticateMerchant({ email, password })
      const response = await storeinoApi.getMockMerchantData(email);

      if (response.success) {
        const merchant = response.data as MerchantData;
        
        // Save to localStorage for persistence
        localStorage.setItem('storeino_merchant', JSON.stringify(merchant));
        
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
          error: response.error || 'Login failed'
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

  const logout = () => {
    localStorage.removeItem('storeino_merchant');
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
      const response = await storeinoApi.getMockMerchantData(authState.merchant.email);
      
      if (response.success) {
        const updatedMerchant = response.data as MerchantData;
        localStorage.setItem('storeino_merchant', JSON.stringify(updatedMerchant));
        
        setAuthState(prev => ({
          ...prev,
          merchant: updatedMerchant,
          loading: false
        }));
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