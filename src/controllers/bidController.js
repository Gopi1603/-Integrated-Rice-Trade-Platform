const pool = require('../config/db');

// Place a bid and auto-accept if meets seller price
const placeBid = async (req, res) => {
  const buyerId = req.user.userId;
  const { productId, bidPrice } = req.body;
  if (!productId || bidPrice == null) {
    return res.status(400).json({ error: 'Missing productId or bidPrice' });
  }
  try {
    // Insert bid
    const bidRes = await pool.query(
      'INSERT INTO bids (buyer_id, product_id, bid_price) VALUES ($1,$2,$3) RETURNING id, status',
      [buyerId, productId, bidPrice]
    );
    const bid = bidRes.rows[0];

    // Fetch product details
    const prodRes = await pool.query(
      'SELECT price, seller_id FROM products WHERE id = $1',
      [productId]
    );
    const { price: minPrice, seller_id: sellerId } = prodRes.rows[0];

    if (bidPrice >= minPrice) {
      // Auto-accept
      await pool.query('UPDATE bids SET status = $1 WHERE id = $2', ['accepted', bid.id]);
      const orderRes = await pool.query(
        'INSERT INTO orders (buyer_id, seller_id, product_id, final_price) VALUES ($1,$2,$3,$4) RETURNING id',
        [buyerId, sellerId, productId, bidPrice]
      );
      return res.json({ bidId: bid.id, status: 'accepted', orderId: orderRes.rows[0].id });
    }

    // Otherwise pending
    res.json({ bidId: bid.id, status: bid.status });
  } catch (err) {
    console.error('placeBid error:', err);
    res.status(500).json({ error: 'Bid failed' });
  }
};

// Accept a bid
const acceptBid = async (req, res) => {
  const { bidId } = req.params;
  try {
    // Fetch the bid details to check if it's pending
    const bidRes = await pool.query('SELECT * FROM bids WHERE id = $1 AND status = $2', [bidId, 'pending']);
    
    if (!bidRes.rows.length) {
      return res.status(404).json({ error: 'Bid not found or already accepted' });
    }

    const bid = bidRes.rows[0];
    const productRes = await pool.query('SELECT price, seller_id FROM products WHERE id = $1', [bid.product_id]);
    const { price: minPrice, seller_id: sellerId } = productRes.rows[0];

    if (bid.bid_price >= minPrice) {
      // Auto-accept bid
      await pool.query('UPDATE bids SET status = $1 WHERE id = $2', ['accepted', bidId]);

      const orderRes = await pool.query(
        'INSERT INTO orders (buyer_id, seller_id, product_id, final_price) VALUES ($1, $2, $3, $4) RETURNING id',
        [bid.buyer_id, sellerId, bid.product_id, bid.bid_price]
      );

      return res.json({ bidId, status: 'accepted', orderId: orderRes.rows[0].id });
    }

    res.status(400).json({ error: 'Bid price does not meet seller\'s minimum price' });
  } catch (err) {
    console.error('acceptBid error:', err);
    res.status(500).json({ error: 'Failed to accept bid' });
  }
};

module.exports = { placeBid, acceptBid };
