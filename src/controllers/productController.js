// File: src/controllers/productController.js
const pool = require('../config/db');

// Search products by type & quantity, sorted by proximity
const searchProducts = async (req, res) => {
  const { type, qty, lat, lng } = req.query;
  if (!type || !qty || !lat || !lng) {
    return res.status(400).json({ error: 'Missing query parameters' });
  }
  try {
    const result = await pool.query(
      `SELECT
         p.id AS productId,
         p.type,
         p.quantity,
         p.price,
         s.city,
         ROW_NUMBER() OVER (PARTITION BY s.city ORDER BY p.price) AS millNumber,
         (point(s.lng, s.lat) <-> point($4, $3)) AS distance
       FROM products p
       JOIN sellers s ON p.seller_id = s.id
       WHERE p.type = $1
         AND p.quantity >= $2
         AND p.available = TRUE
       ORDER BY distance
       LIMIT 20`,
      [type, qty, lat, lng]
    );

    const products = result.rows.map(row => ({
      productId: row.productid,
      type: row.type,
      quantity: row.quantity,
      priceWithCommission: parseFloat((row.price * 1.05).toFixed(2)),
      transportCost: null,    // placeholder
      sellerAnonName: `${row.city} Rice Mill #${row.millnumber}`
    }));
    res.json(products);
  } catch (err) {
    console.error('searchProducts error:', err);
    res.status(500).json({ error: 'Search failed' });
  }
};

module.exports = { searchProducts };