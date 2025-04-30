// File: src/controllers/sellersController.js
const pool = require('../config/db');

// Get seller profile for current user
async function getMyProfile(req, res) {
  const userId = req.user.userId;
  try {
    const result = await pool.query(
      'SELECT id AS sellerId, mill_name AS millName, city, lat, lng FROM sellers WHERE user_id = $1',
      [userId]
    );
    if (!result.rows.length) {
      return res.status(404).json({ error: 'No profile found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('getMyProfile error:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
}

// Create new seller profile
async function createProfile(req, res) {
  const { millName, city, lat, lng } = req.body;
  const userId = req.user.userId;
  if (!millName || !city || lat == null || lng == null) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO sellers (user_id, mill_name, city, lat, lng) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [userId, millName, city, lat, lng]
    );
    res.status(201).json({ sellerId: result.rows[0].id });
  } catch (err) {
    console.error('createProfile error:', err);
    res.status(500).json({ error: 'Failed to create seller profile' });
  }
}

// Fetch all products for a seller
async function getProducts(req, res) {
  const sellerId = req.params.id;
  try {
    const result = await pool.query(
      'SELECT id, type, quantity, price, available, updated_at FROM products WHERE seller_id = $1',
      [sellerId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('getProducts error:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}

// Add new product
async function addProduct(req, res) {
  const sellerId = req.params.id;
  const { type, quantity, price } = req.body;
  if (!type || quantity == null || price == null) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO products (seller_id, type, quantity, price) VALUES ($1, $2, $3, $4) RETURNING id',
      [sellerId, type, quantity, price]
    );
    res.status(201).json({ productId: result.rows[0].id });
  } catch (err) {
    console.error('addProduct error:', err);
    res.status(500).json({ error: 'Failed to add product' });
  }
}

// Update existing product fields
async function updateProduct(req, res) {
  const sellerId = req.params.id;
  const prodId = req.params.prodId;
  const { quantity, price, available } = req.body;

  if (available === undefined && quantity === undefined && price === undefined) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  const updates = [];
  const values = [];
  let idx = 1;

  if (available !== undefined) {
    updates.push(`available = $${idx}`);
    values.push(available);
    idx++;
  }
  if (quantity !== undefined) {
    updates.push(`quantity = $${idx}`);
    values.push(quantity);
    idx++;
  }
  if (price !== undefined) {
    updates.push(`price = $${idx}`);
    values.push(price);
    idx++;
  }

  updates.push(`updated_at = NOW()`);

  // Append identifiers for WHERE clause
  values.push(sellerId, prodId);
  const query = `UPDATE products SET ${updates.join(', ')} WHERE seller_id = $${idx} AND id = $${idx + 1}`;

  console.log('updateProduct query:', query, 'values:', values);
  try {
    const result = await pool.query(query, values);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Product or seller not found' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error('updateProduct error:', err);
    res.status(500).json({ error: 'Failed to update product' });
  }
}

module.exports = { getMyProfile, createProfile, getProducts, addProduct, updateProduct };