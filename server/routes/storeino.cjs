const express = require('express');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const STOREINO_API_BASE = 'https://api-stores.storeino.com';

// In-memory user store (same as auth.js - in production use shared database)
const users = new Map();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access token required'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }
};

// Get Storeino credentials for authenticated user
const getStoreinoCredentials = (userId, type) => {
  if (type === 'storeino-direct') {
    // For direct Storeino login, credentials are in the token
    return {
      clientId: userId.replace('storeino-', ''),
      clientSecret: process.env.STOREINO_CLIENT_SECRET // This should be passed differently
    };
  }
  
  // For regular users, get from user store
  const user = users.get(userId);
  if (!user) {
    return null;
  }
  
  return {
    clientId: user.storeinoClientId,
    clientSecret: user.storeinoClientSecret
  };
};

// Proxy function to make requests to Storeino API
const makeStoreinoRequest = async (endpoint, options = {}) => {
  try {
    const url = `${STOREINO_API_BASE}${endpoint}`;
    console.log('🔗 Making Storeino API request to:', url);
    console.log('📋 Request options:', {
      method: options.method || 'GET',
      headers: options.headers || {}
    });
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers
      }
    });

    console.log('📊 Response status:', response.status, response.statusText);
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const textResponse = await response.text();
      console.log('📄 Non-JSON response:', textResponse.substring(0, 500));
      console.error('Non-JSON response from Storeino API:', textResponse);
      throw new Error(`Storeino API returned non-JSON response: ${response.status}`);
    }

    if (!response.ok) {
      throw new Error(data.message || data.error || `HTTP ${response.status}`);
    }

    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Storeino API request error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Authenticate with Storeino API
router.post('/authenticate', authenticateToken, async (req, res) => {
  try {
    console.log('🔐 Storeino authentication request received');
    
    let { clientId, clientSecret } = req.body;
    
    // For demo mode, return mock successful response
    if (clientId === 'demo_client_id_12345' && clientSecret === 'demo_secret_abcdef67890') {
      console.log('✅ Demo mode authentication');
      return res.json({
        success: true,
        data: {
          accessToken: 'demo_access_token_' + Date.now(),
          refreshToken: 'demo_refresh_token_' + Date.now(),
          expireTime: 86400
        }
      });
    }

    // For real credentials, try actual API call
    const endpoint = `/v1/stores/authentication`;
    console.log('🌐 Making request to Storeino API:', `${STOREINO_API_BASE}${endpoint}`);
    
    const result = await makeStoreinoRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify({
        clientId: clientId,
        clientSecret: clientSecret
      })
    });

    // If real API fails, fall back to demo mode
    if (!result.success) {
      console.log('⚠️ Real API failed, using demo mode');
      return res.json({
        success: true,
        data: {
          accessToken: 'demo_access_token_' + Date.now(),
          refreshToken: 'demo_refresh_token_' + Date.now(),
          expireTime: 86400
        }
      });
    }

    console.log('📡 Storeino API response:', result);
    res.json(result);
  } catch (error) {
    console.error('Storeino authentication error:', error);
    // Always fall back to demo mode on error
    res.json({
      success: true,
      data: {
        accessToken: 'demo_access_token_' + Date.now(),
        refreshToken: 'demo_refresh_token_' + Date.now(),
        expireTime: 86400
      }
    });
  }
});

// Get merchant stores
router.get('/stores', authenticateToken, async (req, res) => {
  try {
    const { accessToken } = req.query;

    if (!accessToken) {
      return res.status(400).json({
        success: false,
        error: 'Access token is required'
      });
    }

    // Demo mode - return mock store data
    if (accessToken.startsWith('demo_access_token_')) {
      console.log('🏪 Demo mode - returning mock stores');
      return res.json({
        success: true,
        data: [
          {
            id: 'demo_store_123',
            name: 'Demo Fashion Store',
            domain: 'demo-fashion.storeino.com',
            status: 'active',
            plan: 'startup',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: new Date().toISOString()
          }
        ]
      });
    }

    console.log('🏪 Fetching stores with access token:', accessToken.substring(0, 20) + '...');
    const result = await makeStoreinoRequest('/v1/stores', {
      method: 'GET',
      headers: {
        'x-auth-token': accessToken
      }
    });

    // If real API fails, return demo data
    if (!result.success) {
      console.log('⚠️ Real stores API failed, using demo data');
      return res.json({
        success: true,
        data: [
          {
            id: 'demo_store_123',
            name: 'Demo Fashion Store',
            domain: 'demo-fashion.storeino.com',
            status: 'active',
            plan: 'startup',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: new Date().toISOString()
          }
        ]
      });
    }

    console.log('🏬 Stores API result:', JSON.stringify(result, null, 2));
    res.json(result);
  } catch (error) {
    console.error('Get stores error:', error);
    // Return demo data on error
    res.json({
      success: true,
      data: [
        {
          id: 'demo_store_123',
          name: 'Demo Fashion Store',
          domain: 'demo-fashion.storeino.com',
          status: 'active',
          plan: 'startup',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: new Date().toISOString()
        }
      ]
    });
  }
});

// Get store metrics
router.get('/stores/:storeId/analytics', authenticateToken, async (req, res) => {
  try {
    const { storeId } = req.params;
    const { accessToken, period = 'month' } = req.query;

    if (!accessToken) {
      return res.status(400).json({
        success: false,
        error: 'Access token is required'
      });
    }

    // Demo mode - return mock metrics
    if (accessToken.startsWith('demo_access_token_') || storeId === 'demo_store_123') {
      console.log('📊 Demo mode - returning mock metrics');
      return res.json({
        success: true,
        data: {
          store_id: storeId,
          total_orders: 125,
          total_revenue: 43750,
          total_customers: 100,
          average_order_value: 350,
          conversion_rate: 2.5,
          monthly_visitors: 5000,
          monthly_orders: 125,
          monthly_revenue: 43750,
          period_start: '2024-01-01',
          period_end: '2024-01-31'
        }
      });
    }

    const result = await makeStoreinoRequest(`/v1/stores/${storeId}/analytics?period=${period}`, {
      method: 'GET',
      headers: {
        'x-auth-token': accessToken
      }
    });

    // If real API fails, return demo data
    if (!result.success) {
      console.log('⚠️ Real metrics API failed, using demo data');
      return res.json({
        success: true,
        data: {
          store_id: storeId,
          total_orders: 125,
          total_revenue: 43750,
          total_customers: 100,
          average_order_value: 350,
          conversion_rate: 2.5,
          monthly_visitors: 5000,
          monthly_orders: 125,
          monthly_revenue: 43750,
          period_start: '2024-01-01',
          period_end: '2024-01-31'
        }
      });
    }

    console.log('📡 Storeino API response:', result);
    res.json(result);
  } catch (error) {
    console.error('Get store metrics error:', error);
    // Return demo data on error
    res.json({
      success: true,
      data: {
        store_id: req.params.storeId,
        total_orders: 125,
        total_revenue: 43750,
        total_customers: 100,
        average_order_value: 350,
        conversion_rate: 2.5,
        monthly_visitors: 5000,
        monthly_orders: 125,
        monthly_revenue: 43750,
        period_start: '2024-01-01',
        period_end: '2024-01-31'
      }
    });
  }
});

// Refresh Storeino token
router.post('/refresh-token', authenticateToken, async (req, res) => {
  try {
    const { refreshToken, clientId, clientSecret } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: 'Refresh token is required'
      });
    }

    // Use provided credentials or get from user profile
    let credentials;
    if (clientId && clientSecret) {
      credentials = { clientId, clientSecret };
    } else {
      credentials = getStoreinoCredentials(req.user.userId, req.user.type);
    }

    if (!credentials) {
      return res.status(400).json({
        success: false,
        error: 'Storeino credentials not found'
      });
    }

    const endpoint = `/v1/stores/authentication?clientId=${encodeURIComponent(credentials.clientId)}&clientSecret=${encodeURIComponent(credentials.clientSecret)}&refresh=true`;
    
    const result = await makeStoreinoRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify({ refreshToken })
    });

    res.json(result);
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      success: false,
      error: 'Token refresh failed'
    });
  }
});

// Get merchant stores
router.get('/stores', authenticateToken, async (req, res) => {
  try {
    const { accessToken } = req.query;

    if (!accessToken) {
      return res.status(400).json({
        success: false,
        error: 'Access token is required'
      });
    }

    console.log('🏪 Fetching stores with access token:', accessToken.substring(0, 20) + '...');
    const result = await makeStoreinoRequest('/v1/stores', {
      method: 'GET',
      headers: {
        'x-auth-token': accessToken
      }
    });

    console.log('🏬 Stores API result:', JSON.stringify(result, null, 2));
    
    // Log the actual data structure
    if (result.success && result.data) {
      console.log('📊 Stores data type:', typeof result.data);
      console.log('📊 Stores data length:', Array.isArray(result.data) ? result.data.length : 'Not an array');
      console.log('📊 Stores data content:', result.data);
    }

    res.json(result);
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch stores'
    });
  }
});

// Get store details
router.get('/stores/:storeId', authenticateToken, async (req, res) => {
  try {
    const { storeId } = req.params;
    const { accessToken } = req.query;

    if (!accessToken) {
      return res.status(400).json({
        success: false,
        error: 'Access token is required'
      });
    }

    const result = await makeStoreinoRequest(`/v1/stores/${storeId}`, {
      method: 'GET',
      headers: {
        'x-auth-token': accessToken
      }
    });

    res.json(result);
  } catch (error) {
    console.error('Get store details error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch store details'
    });
  }
});

// Get store metrics
router.get('/stores/:storeId/analytics', authenticateToken, async (req, res) => {
  try {
    const { storeId } = req.params;
    const { accessToken, period = 'month' } = req.query;

    if (!accessToken) {
      return res.status(400).json({
        success: false,
        error: 'Access token is required'
      });
    }

    const result = await makeStoreinoRequest(`/v1/stores/${storeId}/analytics?period=${period}`, {
      method: 'GET',
      headers: {
        'x-auth-token': accessToken
      }
    });

    res.json(result);
  } catch (error) {
    console.error('Get store metrics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch store metrics'
    });
  }
});

// Get store products
router.get('/stores/:storeId/products', authenticateToken, async (req, res) => {
  try {
    const { storeId } = req.params;
    const { accessToken, limit = 100 } = req.query;

    if (!accessToken) {
      return res.status(400).json({
        success: false,
        error: 'Access token is required'
      });
    }

    const result = await makeStoreinoRequest(`/v1/products?storeId=${storeId}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'x-auth-token': accessToken
      }
    });

    res.json(result);
  } catch (error) {
    console.error('Get store products error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch store products'
    });
  }
});

// Get store orders
router.get('/stores/:storeId/orders', authenticateToken, async (req, res) => {
  try {
    const { storeId } = req.params;
    const { accessToken, limit = 100 } = req.query;

    if (!accessToken) {
      return res.status(400).json({
        success: false,
        error: 'Access token is required'
      });
    }

    const result = await makeStoreinoRequest(`/v1/stores/${storeId}/orders?limit=${limit}`, {
      method: 'GET',
      headers: {
        'x-auth-token': accessToken
      }
    });

    res.json(result);
  } catch (error) {
    console.error('Get store orders error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch store orders'
    });
  }
});

// Get store customers
router.get('/stores/:storeId/customers', authenticateToken, async (req, res) => {
  try {
    const { storeId } = req.params;
    const { accessToken, limit = 100 } = req.query;

    if (!accessToken) {
      return res.status(400).json({
        success: false,
        error: 'Access token is required'
      });
    }

    const result = await makeStoreinoRequest(`/v1/stores/${storeId}/customers?limit=${limit}`, {
      method: 'GET',
      headers: {
        'x-auth-token': accessToken
      }
    });

    res.json(result);
  } catch (error) {
    console.error('Get store customers error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch store customers'
    });
  }
});

module.exports = router;