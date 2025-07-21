// Storeino API Integration Service
// Real API implementation for https://api-stores.storeino.com

const STOREINO_API_BASE = 'https://api-stores.storeino.com';

export interface StoreinoApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}

export interface StoreinoMerchantAuth {
  email: string;
  password: string;
}

export interface StoreinoStoreData {
  id: string;
  name: string;
  domain: string;
  status: string;
  plan: string;
  created_at: string;
  updated_at: string;
}

export interface StoreinoStoreMetrics {
  store_id: string;
  total_orders: number;
  total_revenue: number;
  total_customers: number;
  average_order_value: number;
  conversion_rate: number;
  monthly_visitors: number;
  monthly_orders: number;
  monthly_revenue: number;
  period_start: string;
  period_end: string;
}

export interface StoreinoAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: string;
    email: string;
    name: string;
    stores: StoreinoStoreData[];
  };
}

class StoreinoApiService {
  private accessToken: string | null = null;
  private tokenExpiry: number | null = null;

  constructor() {
    // Try to restore token from localStorage
    const savedToken = localStorage.getItem('storeino_access_token');
    const savedExpiry = localStorage.getItem('storeino_token_expiry');
    
    if (savedToken && savedExpiry && Date.now() < parseInt(savedExpiry)) {
      this.accessToken = savedToken;
      this.tokenExpiry = parseInt(savedExpiry);
    }
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<StoreinoApiResponse<T>> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers as Record<string, string>,
      };

      // Add authorization header if we have a token
      if (this.accessToken && this.isTokenValid()) {
        headers['Authorization'] = `Bearer ${this.accessToken}`;
      }

      const response = await fetch(`${STOREINO_API_BASE}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          data: null as T,
          error: data.message || data.error || `HTTP ${response.status}`,
          message: data.message
        };
      }

      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('API Request Error:', error);
      return {
        success: false,
        data: null as T,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  }

  private isTokenValid(): boolean {
    return this.tokenExpiry !== null && Date.now() < this.tokenExpiry;
  }

  private saveToken(token: string, expiresIn: number) {
    this.accessToken = token;
    this.tokenExpiry = Date.now() + (expiresIn * 1000);
    
    localStorage.setItem('storeino_access_token', token);
    localStorage.setItem('storeino_token_expiry', this.tokenExpiry.toString());
  }

  private clearToken() {
    this.accessToken = null;
    this.tokenExpiry = null;
    localStorage.removeItem('storeino_access_token');
    localStorage.removeItem('storeino_token_expiry');
  }

  // Authenticate merchant with Storeino
  async authenticateMerchant(credentials: StoreinoMerchantAuth): Promise<StoreinoApiResponse<StoreinoAuthResponse>> {
    const response = await this.makeRequest<StoreinoAuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });

    if (response.success && response.data) {
      // Save the access token
      this.saveToken(response.data.access_token, response.data.expires_in);
    }

    return response;
  }

  // Get merchant stores
  async getMerchantStores(): Promise<StoreinoApiResponse<StoreinoStoreData[]>> {
    if (!this.isTokenValid()) {
      return {
        success: false,
        data: null as StoreinoStoreData[],
        error: 'Authentication required'
      };
    }

    return this.makeRequest<StoreinoStoreData[]>('/stores', {
      method: 'GET'
    });
  }

  // Get specific store details
  async getStoreDetails(storeId: string): Promise<StoreinoApiResponse<StoreinoStoreData>> {
    if (!this.isTokenValid()) {
      return {
        success: false,
        data: null as StoreinoStoreData,
        error: 'Authentication required'
      };
    }

    return this.makeRequest<StoreinoStoreData>(`/stores/${storeId}`, {
      method: 'GET'
    });
  }

  // Get store analytics/metrics
  async getStoreMetrics(storeId: string, period: string = 'month'): Promise<StoreinoApiResponse<StoreinoStoreMetrics>> {
    if (!this.isTokenValid()) {
      return {
        success: false,
        data: null as StoreinoStoreMetrics,
        error: 'Authentication required'
      };
    }

    return this.makeRequest<StoreinoStoreMetrics>(`/stores/${storeId}/analytics?period=${period}`, {
      method: 'GET'
    });
  }

  // Get store orders
  async getStoreOrders(storeId: string, limit: number = 100): Promise<StoreinoApiResponse<any[]>> {
    if (!this.isTokenValid()) {
      return {
        success: false,
        data: null as any[],
        error: 'Authentication required'
      };
    }

    return this.makeRequest<any[]>(`/stores/${storeId}/orders?limit=${limit}`, {
      method: 'GET'
    });
  }

  // Get store customers
  async getStoreCustomers(storeId: string, limit: number = 100): Promise<StoreinoApiResponse<any[]>> {
    if (!this.isTokenValid()) {
      return {
        success: false,
        data: null as any[],
        error: 'Authentication required'
      };
    }

    return this.makeRequest<any[]>(`/stores/${storeId}/customers?limit=${limit}`, {
      method: 'GET'
    });
  }

  // Logout and clear token
  async logout(): Promise<void> {
    if (this.isTokenValid()) {
      try {
        await this.makeRequest('/auth/logout', {
          method: 'POST'
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    
    this.clearToken();
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.isTokenValid();
  }

  // Get current access token
  getAccessToken(): string | null {
    return this.isTokenValid() ? this.accessToken : null;
  }

  // Refresh token if needed
  async refreshTokenIfNeeded(): Promise<boolean> {
    if (!this.isTokenValid()) {
      this.clearToken();
      return false;
    }
    
    // If token expires in less than 5 minutes, we might want to refresh
    const fiveMinutes = 5 * 60 * 1000;
    if (this.tokenExpiry && (this.tokenExpiry - Date.now()) < fiveMinutes) {
      // Implement token refresh logic here if Storeino API supports it
      // For now, we'll just return true if token is still valid
    }
    
    return true;
  }
}

export const storeinoApi = new StoreinoApiService();