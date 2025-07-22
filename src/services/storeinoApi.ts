// Storeino API Integration Service
// Real API implementation for https://api-stores.storeino.com

const STOREINO_API_BASE = 'https://api-stores.storeino.com';

export interface StoreinoApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}

export interface StoreinoClientAuth {
  clientId: string;
  clientSecret: string;
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
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  user?: {
    id: string;
    email: string;
    name: string;
    stores: StoreinoStoreData[];
  };
}

class StoreinoApiService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiry: number | null = null;

  constructor() {
    // Try to restore tokens from localStorage
    const savedAccessToken = localStorage.getItem('storeino_access_token');
    const savedRefreshToken = localStorage.getItem('storeino_refresh_token');
    const savedExpiry = localStorage.getItem('storeino_token_expiry');
    
    if (savedAccessToken && savedExpiry && Date.now() < parseInt(savedExpiry)) {
      this.accessToken = savedAccessToken;
      this.refreshToken = savedRefreshToken;
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

      // Add x-auth-token header if we have an access token
      if (this.accessToken && this.isTokenValid()) {
        headers['x-auth-token'] = this.accessToken;
      }

      console.log('Making API request to:', `${STOREINO_API_BASE}${endpoint}`);
      console.log('Headers:', headers);

      const response = await fetch(`${STOREINO_API_BASE}${endpoint}`, {
        ...options,
        headers,
        mode: 'cors',
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
        console.log('Response data:', data);
      } else {
        // If not JSON, get text to see what we're actually receiving
        const textResponse = await response.text();
        console.error('Non-JSON response received:', textResponse);
        
        return {
          success: false,
          data: null as T,
          error: `API returned non-JSON response. Status: ${response.status}. Content: ${textResponse.substring(0, 200)}...`
        };
      }
      
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

  private saveTokens(accessToken: string, refreshToken: string, expiresIn: number) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.tokenExpiry = Date.now() + (expiresIn * 1000);
    
    localStorage.setItem('storeino_access_token', accessToken);
    localStorage.setItem('storeino_refresh_token', refreshToken);
    localStorage.setItem('storeino_token_expiry', this.tokenExpiry.toString());
  }

  private clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiry = null;
    localStorage.removeItem('storeino_access_token');
    localStorage.removeItem('storeino_refresh_token');
    localStorage.removeItem('storeino_token_expiry');
  }

  // Authenticate with clientId and clientSecret
  async authenticateClient(credentials: StoreinoClientAuth): Promise<StoreinoApiResponse<StoreinoAuthResponse>> {
    const endpoint = `/v1/stores/authentication`;
    console.log('Attempting authentication to:', `${STOREINO_API_BASE}${endpoint}`);
    
    const response = await this.makeRequest<StoreinoAuthResponse>(endpoint, {
      method: 'POST',
      body: JSON.stringify({
        clientId: credentials.clientId,
        clientSecret: credentials.clientSecret
      })
    });

    console.log('Authentication response:', response);
    
    if (response.success && response.data) {
      // Save the tokens
      this.saveTokens(
        response.data.accessToken, 
        response.data.refreshToken, 
        response.data.expiresIn
      );
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

    return this.makeRequest<StoreinoStoreData[]>('/v1/stores', {
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

    return this.makeRequest<StoreinoStoreData>(`/v1/stores/${storeId}`, {
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

    return this.makeRequest<StoreinoStoreMetrics>(`/v1/stores/${storeId}/analytics?period=${period}`, {
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

    return this.makeRequest<any[]>(`/v1/stores/${storeId}/orders?limit=${limit}`, {
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

    return this.makeRequest<any[]>(`/v1/stores/${storeId}/customers?limit=${limit}`, {
      method: 'GET'
    });
  }

  // Logout and clear tokens
  async logout(): Promise<void> {
    this.clearTokens();
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
      this.clearTokens();
      return false;
    }
    
    // If token expires in less than 5 minutes, we might want to refresh
    const fiveMinutes = 5 * 60 * 1000;
    if (this.tokenExpiry && (this.tokenExpiry - Date.now()) < fiveMinutes) {
      // TODO: Implement token refresh logic if Storeino API supports it
      // For now, we'll just return true if token is still valid
    }
    
    return true;
  }
}

export const storeinoApi = new StoreinoApiService();