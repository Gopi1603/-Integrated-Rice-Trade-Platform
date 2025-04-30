// File: src/app.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Database pool
const pool = require('./config/db');

// Route handlers
const authRoutes    = require('./routes/auth');
const sellerRoutes  = require('./routes/sellers');
const productRoutes = require('./routes/products');
const bidRoutes     = require('./routes/bids');
const buyerRoutes   = require('./routes/buyers');
const orderRoutes   = require('./routes/orders');
const logisticsRoutes = require('./routes/logistics');


const app = express();

app.use(cors());
app.use(express.json());

// Health-check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// DB-check endpoint
app.get('/test-db', async (req, res) => {
  try {
    const nowResult   = await pool.query('SELECT NOW()');
    const countResult = await pool.query('SELECT COUNT(*) FROM users');
    res.json({
      database_time: nowResult.rows[0].now,
      users_count: parseInt(countResult.rows[0].count, 10)
    });
  } catch (err) {
    console.error('DB test failed:', err);
    res.status(500).json({ error: 'Database connection error' });
  }
});

// Mount routes
app.use('/auth', authRoutes);
app.use('/sellers', sellerRoutes);
app.use('/products', productRoutes);
app.use('/bids', bidRoutes);
app.use('/buyers', buyerRoutes);
app.use('/orders', orderRoutes);
app.use('/logistics', logisticsRoutes);
module.exports = app;