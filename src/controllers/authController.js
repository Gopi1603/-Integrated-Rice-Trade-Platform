// src/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const pool   = require('../config/db');
require('dotenv').config();

const register = async (req, res) => {
  const { name, phone, password, role } = req.body;
  if (!name || !phone || !password || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    // Check if phone already exists
    const existing = await pool.query(
      'SELECT id FROM users WHERE phone = $1',
      [phone]
    );
    if (existing.rows.length) {
      return res.status(409).json({ error: 'Phone already registered' });
    }
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (role, name, phone, password_hash) VALUES ($1, $2, $3, $4) RETURNING id',
      [role, name, phone, hash]
    );
    const userId = result.rows[0].id;
    const token = jwt.sign({ userId, role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h'
    });
    res.status(201).json({ token, userId, role });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

const login = async (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) {
    return res.status(400).json({ error: 'Missing phone or password' });
  }
  try {
    const result = await pool.query(
      'SELECT id, password_hash, role, name FROM users WHERE phone = $1',
      [phone]
    );
    if (!result.rows.length) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h'
    });
    res.json({ token, userId: user.id, name: user.name, role: user.role });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};

const me = (req, res) => {
  // req.user populated by auth middleware
  const { userId, role } = req.user;
  res.json({ userId, role });
};

module.exports = { register, login, me};