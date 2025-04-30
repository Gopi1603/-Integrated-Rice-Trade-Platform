
// File: src/controllers/orderController.js
const pool = require('../config/db');

// Get all orders for a buyer
const getBuyerOrders = async (req, res) => {
  const buyerId = req.params.id;
  try {
    const result = await pool.query(
      `SELECT
         o.id AS orderId,
         o.final_price,
         o.payment_status,
         s.city,
         p.type,
         o.created_at
       FROM orders o
       JOIN sellers s ON o.seller_id = s.id
       JOIN products p ON o.product_id = p.id
       WHERE o.buyer_id = $1
       ORDER BY o.created_at DESC`,
      [buyerId]
    );
    const orders = result.rows.map(o => ({
      orderId: o.orderid,
      sellerAnonName: `${o.city} Rice Mill #?`, // can fetch millNumber separately if needed
      productType: o.type,
      finalPrice: o.final_price,
      paymentStatus: o.payment_status,
      createdAt: o.created_at
    }));
    res.json(orders);
  } catch (err) {
    console.error('getBuyerOrders error:', err);
    res.status(500).json({ error: 'Fetch orders failed' });
  }
};

// Mock payment
const payOrder = async (req, res) => {
  const orderId = req.params.orderId;
  try {
    await pool.query(
      'UPDATE orders SET payment_status = $1 WHERE id = $2',
      ['paid', orderId]
    );
    res.json({ paymentStatus: 'paid', orderId });
  } catch (err) {
    console.error('payOrder error:', err);
    res.status(500).json({ error: 'Payment failed' });
  }
};

module.exports = { getBuyerOrders, payOrder };

