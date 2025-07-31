const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DB_PATH = path.join(__dirname, 'storeino.db');

class Database {
  constructor() {
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
          console.error('❌ Error opening database:', err);
          reject(err);
        } else {
          console.log('✅ Connected to SQLite database');
          this.createTables().then(resolve).catch(reject);
        }
      });
    });
  }

  async createTables() {
    return new Promise((resolve, reject) => {
      const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          storeino_client_id TEXT,
          storeino_client_secret TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;

      const createStoresTable = `
        CREATE TABLE IF NOT EXISTS stores (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          name TEXT NOT NULL,
          domain TEXT,
          status TEXT DEFAULT 'active',
          plan TEXT DEFAULT 'free',
          storeino_store_id TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `;

      const createMetricsTable = `
        CREATE TABLE IF NOT EXISTS store_metrics (
          id TEXT PRIMARY KEY,
          store_id TEXT NOT NULL,
          monthly_visitors INTEGER DEFAULT 0,
          conversion_rate REAL DEFAULT 0,
          average_cart_value REAL DEFAULT 0,
          total_orders INTEGER DEFAULT 0,
          total_revenue REAL DEFAULT 0,
          customer_count INTEGER DEFAULT 0,
          average_order_frequency REAL DEFAULT 0,
          customer_lifespan INTEGER DEFAULT 0,
          recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (store_id) REFERENCES stores (id)
        )
      `;

      this.db.serialize(() => {
        this.db.run(createUsersTable, (err) => {
          if (err) {
            console.error('❌ Error creating users table:', err);
            reject(err);
            return;
          }
          console.log('✅ Users table ready');
        });

        this.db.run(createStoresTable, (err) => {
          if (err) {
            console.error('❌ Error creating stores table:', err);
            reject(err);
            return;
          }
          console.log('✅ Stores table ready');
        });

        this.db.run(createMetricsTable, (err) => {
          if (err) {
            console.error('❌ Error creating metrics table:', err);
            reject(err);
            return;
          }
          console.log('✅ Metrics table ready');
          resolve();
        });
      });
    });
  }

  // User operations
  async createUser(email, hashedPassword, storeinoClientId, storeinoClientSecret) {
    return new Promise((resolve, reject) => {
      const id = uuidv4();
      const sql = `
        INSERT INTO users (id, email, password, storeino_client_id, storeino_client_secret)
        VALUES (?, ?, ?, ?, ?)
      `;
      
      this.db.run(sql, [id, email, hashedPassword, storeinoClientId, storeinoClientSecret], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id, email, createdAt: new Date().toISOString() });
        }
      });
    });
  }

  async getUserByEmail(email) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE email = ?';
      this.db.get(sql, [email], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  async getUserById(id) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE id = ?';
      this.db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Store operations
  async createStore(userId, name, domain, storeinoStoreId, plan = 'free') {
    return new Promise((resolve, reject) => {
      const id = uuidv4();
      const sql = `
        INSERT INTO stores (id, user_id, name, domain, storeino_store_id, plan)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      
      this.db.run(sql, [id, userId, name, domain, storeinoStoreId, plan], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id, userId, name, domain, storeinoStoreId, plan });
        }
      });
    });
  }

  async getStoresByUserId(userId) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM stores WHERE user_id = ?';
      this.db.all(sql, [userId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Metrics operations
  async saveStoreMetrics(storeId, metrics) {
    return new Promise((resolve, reject) => {
      const id = uuidv4();
      const sql = `
        INSERT INTO store_metrics (
          id, store_id, monthly_visitors, conversion_rate, average_cart_value,
          total_orders, total_revenue, customer_count, average_order_frequency, customer_lifespan
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const values = [
        id, storeId, metrics.monthly_visitors || 0, metrics.conversion_rate || 0,
        metrics.average_cart_value || 0, metrics.total_orders || 0, metrics.total_revenue || 0,
        metrics.customer_count || 0, metrics.average_order_frequency || 0, metrics.customer_lifespan || 0
      ];
      
      this.db.run(sql, values, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id, storeId, ...metrics });
        }
      });
    });
  }

  async getLatestMetrics(storeId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT * FROM store_metrics 
        WHERE store_id = ? 
        ORDER BY recorded_at DESC 
        LIMIT 1
      `;
      this.db.get(sql, [storeId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  close() {
    if (this.db) {
      this.db.close((err) => {
        if (err) {
          console.error('❌ Error closing database:', err);
        } else {
          console.log('✅ Database connection closed');
        }
      });
    }
  }
}

module.exports = Database;