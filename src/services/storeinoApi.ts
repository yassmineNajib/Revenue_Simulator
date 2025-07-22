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
  expireTime: number;
}

class StoreinoApiService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiry: number | null = null;
  private clientId: string | null = null;
  private clientSecret: string | null = null;

  constructor() {
    // Try to restore tokens from localStorage
    const savedAccessToken = localStorage.getItem('storeino_access_token');
    const savedRefreshToken = localStorage.getItem('storeino_refresh_token');
    const savedExpiry = localStorage.getItem('storeino_token_expiry');
    const savedClientId = localStorage.getItem('storeino_client_id');
    const savedClientSecret = localStorage.getItem('storeino_client_secret');
    
    if (savedAccessToken && savedExpiry && Date.now() < parseInt(savedExpiry)) {
      this.accessToken = savedAccessToken;
      this.refreshToken = savedRefreshToken;
      this.tokenExpiry = parseInt(savedExpiry);
      this.clientId = savedClientId;
      this.clientSecret = savedClientSecret;
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

  private saveTokens(accessToken: string, refreshToken: string, expireTime: number, clientId: string, clientSecret: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.tokenExpiry = Date.now() + (expireTime * 1000);
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    
    localStorage.setItem('storeino_access_token', accessToken);
    localStorage.setItem('storeino_refresh_token', refreshToken);
    localStorage.setItem('storeino_token_expiry', this.tokenExpiry.toString());
    localStorage.setItem('storeino_client_id', clientId);
    localStorage.setItem('storeino_client_secret', clientSecret);
  }

  private clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiry = null;
    this.clientId = null;
    this.clientSecret = null;
    localStorage.removeItem('storeino_access_token');
    localStorage.removeItem('storeino_refresh_token');
    localStorage.removeItem('storeino_token_expiry');
    localStorage.removeItem('storeino_client_id');
    localStorage.removeItem('storeino_client_secret');
  }

  // Step 1: Get Access Token using GET request
  async authenticateClient(credentials: StoreinoClientAuth): Promise<StoreinoApiResponse<StoreinoAuthResponse>> {
    const endpoint = `/v1/stores/authentication?clientId=${encodeURIComponent(credentials.clientId)}&clientSecret=${encodeURIComponent(credentials.clientSecret)}`;
    console.log('Attempting authentication to:', `${STOREINO_API_BASE}${endpoint}`);
    
    const response = await this.makeRequest<StoreinoAuthResponse>(endpoint, {
      method: 'GET'
    });

    console.log('Authentication response:', response);
    
    if (response.success && response.data) {
      // Save the tokens with credentials for refresh
      this.saveTokens(
        response.data.accessToken, 
        response.data.refreshToken, 
        response.data.expireTime,
        credentials.clientId,
        credentials.clientSecret
      );
    }

    return response;
  }

  // Step 3: Refresh Access Token using POST request
  async refreshAccessToken(): Promise<StoreinoApiResponse<StoreinoAuthResponse>> {
    if (!this.refreshToken || !this.clientId || !this.clientSecret) {
      return {
        success: false,
        data: null as StoreinoAuthResponse,
        error: 'No refresh token or credentials available'
      };
    }

    const endpoint = `/v1/stores/authentication?clientId=${encodeURIComponent(this.clientId)}&clientSecret=${encodeURIComponent(this.clientSecret)}&refresh=true`;
    
    const response = await this.makeRequest<StoreinoAuthResponse>(endpoint, {
      method: 'POST',
      body: JSON.stringify({
        refreshToken: this.refreshToken
      })
    });

    if (response.success && response.data) {
      // Update tokens
      this.saveTokens(
        response.data.accessToken,
        response.data.refreshToken,
        response.data.expireTime,
        this.clientId,
        this.clientSecret
      );
    }

    return response;
  }

  // Auto-refresh token if needed before making requests
  async refreshTokenIfNeeded(): Promise<boolean> {
    // If token is expired or will expire in next 5 minutes
    const fiveMinutes = 5 * 60 * 1000;
    if (!this.isTokenValid() || (this.tokenExpiry && (this.tokenExpiry - Date.now()) < fiveMinutes)) {
      console.log('Token expired or expiring soon, attempting refresh...');
      
      const refreshResponse = await this.refreshAccessToken();
      if (!refreshResponse.success) {
        console.error('Token refresh failed:', refreshResponse.error);
        this.clearTokens();
        return false;
      }
      
      console.log('Token refreshed successfully');
    }
    
    return true;
  }

  // Get merchant stores (Step 2: Use token in authenticated requests)
  async getMerchantStores(): Promise<StoreinoApiResponse<StoreinoStoreData[]>> {
    // Ensure token is valid before making request
    const tokenValid = await this.refreshTokenIfNeeded();
    if (!tokenValid) {
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
    const tokenValid = await this.refreshTokenIfNeeded();
    if (!tokenValid) {
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
    const tokenValid = await this.refreshTokenIfNeeded();
    if (!tokenValid) {
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

  // Get store products (example of authenticated request)
  async getStoreProducts(storeId: string, limit: number = 100): Promise<StoreinoApiResponse<any[]>> {
    const tokenValid = await this.refreshTokenIfNeeded();
    if (!tokenValid) {
      return {
        success: false,
        data: null as any[],
        error: 'Authentication required'
      };
    }

    return this.makeRequest<any[]>(`/v1/products?storeId=${storeId}&limit=${limit}`, {
      method: 'GET'
    });
  }

  // Get store orders
  async getStoreOrders(storeId: string, limit: number = 100): Promise<StoreinoApiResponse<any[]>> {
    const tokenValid = await this.refreshTokenIfNeeded();
    if (!tokenValid) {
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
    const tokenValid = await this.refreshTokenIfNeeded();
    if (!tokenValid) {
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
}

export const storeinoApi = new StoreinoApiService();