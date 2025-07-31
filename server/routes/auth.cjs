const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Register endpoint (for demo purposes)
router.post('/register', async (req, res) => {
  try {
    const { email, password, storeinoClientId, storeinoClientSecret } = req.body;

    if (!email || !password || !storeinoClientId || !storeinoClientSecret) {
      return res.status(400).json({
        success: false,
        error: 'Email, password, and Storeino credentials are required'
      });
    }

    // Check if user already exists
    const existingUser = await req.db.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Store user in database
    const user = await req.db.createUser(email, hashedPassword, storeinoClientId, storeinoClientSecret);

    // Generate JWT token
    const token = jwt.sign(
      { email, userId: user.id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      data: {
        token,
        user: {
          email,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed'
    });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Find user
    const user = await req.db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { email, userId: user.id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      data: {
        token,
        user: {
          email,
          createdAt: user.created_at
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
});

// Direct Storeino credentials login (for existing flow)
router.post('/storeino-login', async (req, res) => {
  try {
    const { clientId, clientSecret } = req.body;

    if (!clientId || !clientSecret) {
      return res.status(400).json({
        success: false,
        error: 'Client ID and Client Secret are required'
      });
    }

    // Generate a temporary JWT token for this session
    const token = jwt.sign(
      { 
        clientId, 
        type: 'storeino-direct',
        userId: `storeino-${clientId}` 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      data: {
        token,
        user: {
          email: `storeino-user-${clientId.substring(0, 8)}`,
          type: 'storeino-direct'
        }
      }
    });
  } catch (error) {
    console.error('Storeino login error:', error);
    res.status(500).json({
      success: false,
      error: 'Storeino login failed'
    });
  }
});

// Verify token endpoint
router.get('/verify', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    res.json({
      success: true,
      data: {
        user: {
          email: decoded.email,
          userId: decoded.userId,
          type: decoded.type || 'regular'
        }
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
});

module.exports = router;