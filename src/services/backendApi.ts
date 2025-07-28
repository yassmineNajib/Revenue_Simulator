  // Backend API Service - Secure communication with our Node.js backend
  const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
  
  console.log('🔗 Backend API connecting to:', BACKEND_BASE_URL);
  
  export interface BackendApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
  }
  
  export interface AuthResponse {
    token: string;
    user: {
      email: string;
      type?: string;
      createdAt?: string;
    };
  }
  
  export interface StoreinoAuthResponse {
    accessToken: string;
    refreshToken: string;
    expireTime: number;
  }
  
  class BackendApiService {
    private token: string | null = null;
  
    constructor() {
      // Restore token from localStorage
      this.token = localStorage.getItem('auth_token');
    }
  
    private async makeRequest<T>(
      endpoint: string,
      options: RequestInit = {}
    ): Promise<BackendApiResponse<T>> {
      const url = `${BACKEND_BASE_URL}${endpoint}`;
      console.log('🌐 Making backend request to:', url);
      
      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          ...options.headers as Record<string, string>,
        };
  
        // Add auth token if available
        if (this.token) {
          headers['Authorization'] = `Bearer ${this.token}`;
        }
  
        console.log('📋 Request headers:', headers);
  
        const response = await fetch(url, {
          ...options,
          headers,
        });
  
        console.log('📡 Response status:', response.status, response.statusText);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Response error:', errorText);
          return {
            success: false,
            error: `HTTP ${response.status}: ${errorText}`
          };
        }
  
        const data = await response.json();
        console.log('📊 Response data:', data);
  
        return {
          success: true,
          data: data.data || data
        };
      } catch (error) {
        console.error('❌ Backend API Error:', error);
        
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
          return {
            success: false,
            error: `Cannot connect to backend server at ${BACKEND_BASE_URL}. Make sure the backend server is running on port 3001.`
          };
        }
        
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Network error'
        };
      }
    }
  
    // Test backend connection
    async testConnection(): Promise<BackendApiResponse<any>> {
      return this.makeRequest<any>('/');
    }
  
    // Authentication methods
    async loginWithStoreino(clientId: string, clientSecret: string): Promise<BackendApiResponse<AuthResponse>> {
      console.log('🔐 Attempting Storeino login...');
      
      const response = await this.makeRequest<AuthResponse>('/api/auth/storeino-login', {
        method: 'POST',
        body: JSON.stringify({ clientId, clientSecret })
      });
  
      if (response.success && response.data) {
        this.token = response.data.token;
        localStorage.setItem('auth_token', this.token);
        console.log('✅ Login successful, token saved');
      } else {
        console.error('❌ Login failed:', response.error);
      }
  
      return response;
    }
  
    async register(email: string, password: string, storeinoClientId: string, storeinoClientSecret: string): Promise<BackendApiResponse<AuthResponse>> {
      const response = await this.makeRequest<AuthResponse>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, storeinoClientId, storeinoClientSecret })
      });
  
      if (response.success && response.data) {
        this.token = response.data.token;
        localStorage.setItem('auth_token', this.token);
      }
  
      return response;
    }
  
    async login(email: string, password: string): Promise<BackendApiResponse<AuthResponse>> {
      const response = await this.makeRequest<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
  
      if (response.success && response.data) {
        this.token = response.data.token;
        localStorage.setItem('auth_token', this.token);
      }
  
      return response;
    }
  
    async verifyToken(): Promise<BackendApiResponse<{ user: any }>> {
      if (!this.token) {
        return { success: false, error: 'No token available' };
      }
  
      const response = await this.makeRequest<{ user: any }>('/api/auth/verify');
      
      if (!response.success) {
        // Token is invalid, clear it
        this.logout();
      }
  
      return response;
    }
  
    logout(): void {
      this.token = null;
      localStorage.removeItem('auth_token');
    }
  
    isAuthenticated(): boolean {
      return !!this.token;
    }
  
    // Storeino API proxy methods
    async authenticateWithStoreino(clientId?: string, clientSecret?: string): Promise<BackendApiResponse<StoreinoAuthResponse>> {
      const body: any = {};
      if (clientId && clientSecret) {
        body.clientId = clientId;
        body.clientSecret = clientSecret;
      }
  
      return this.makeRequest<StoreinoAuthResponse>('/api/storeino/authenticate', {
        method: 'POST',
        body: JSON.stringify(body)
      });
    }
  
    async refreshStoreinoToken(refreshToken: string, clientId?: string, clientSecret?: string): Promise<BackendApiResponse<StoreinoAuthResponse>> {
      const body: any = { refreshToken };
      if (clientId && clientSecret) {
        body.clientId = clientId;
        body.clientSecret = clientSecret;
      }
  
      return this.makeRequest<StoreinoAuthResponse>('/api/storeino/refresh-token', {
        method: 'POST',
        body: JSON.stringify(body)
      });
    }
  
    async getStores(accessToken: string): Promise<BackendApiResponse<any[]>> {
      return this.makeRequest<any[]>(`/api/storeino/stores?accessToken=${encodeURIComponent(accessToken)}`);
    }
  
    async getStoreDetails(storeId: string, accessToken: string): Promise<BackendApiResponse<any>> {
      return this.makeRequest<any>(`/api/storeino/stores/${storeId}?accessToken=${encodeURIComponent(accessToken)}`);
    }
  
    async getStoreMetrics(storeId: string, accessToken: string, period: string = 'month'): Promise<BackendApiResponse<any>> {
      return this.makeRequest<any>(`/api/storeino/stores/${storeId}/analytics?accessToken=${encodeURIComponent(accessToken)}&period=${period}`);
    }
  
    async getStoreProducts(storeId: string, accessToken: string, limit: number = 100): Promise<BackendApiResponse<any[]>> {
      return this.makeRequest<any[]>(`/api/storeino/stores/${storeId}/products?accessToken=${encodeURIComponent(accessToken)}&limit=${limit}`);
    }
  
    async getStoreOrders(storeId: string, accessToken: string, limit: number = 100): Promise<BackendApiResponse<any[]>> {
      return this.makeRequest<any[]>(`/api/storeino/stores/${storeId}/orders?accessToken=${encodeURIComponent(accessToken)}&limit=${limit}`);
    }
  
    async getStoreCustomers(storeId: string, accessToken: string, limit: number = 100): Promise<BackendApiResponse<any[]>> {
      return this.makeRequest<any[]>(`/api/storeino/stores/${storeId}/customers?accessToken=${encodeURIComponent(accessToken)}&limit=${limit}`);
    }
  }
  
  export const backendApi = new BackendApiService();