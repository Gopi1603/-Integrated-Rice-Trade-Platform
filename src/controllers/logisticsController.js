const pool = require('../config/db');

// GET /logistics/nearby?lat=&lng=
async function getNearbyPartners(req, res) {
  const { lat, lng } = req.query;
  if (!lat || !lng) return res.status(400).json({ error: 'Missing lat or lng' });
  try {
    const result = await pool.query(
      `SELECT
         id AS partnerId,
         name,
         (point(lng, lat) <-> point($2, $1)) AS distance
       FROM logistic_partners
       ORDER BY distance
       LIMIT 20`,
      [lat, lng]
    );
    res.json(result.rows.map(r => ({
      partnerId: r.partnerid,
      name: r.name,
      distance: parseFloat(r.distance)
    })));
  } catch (err) {
    console.error('getNearbyPartners error:', err);
    res.status(500).json({ error: 'Failed to fetch partners' });
  }
}

// POST /logistics/:id/assign
const assignLogistics = async (req, res) => {
  const partnerId = req.params.id;  // logistics partner ID from the URL
  const { orderId } = req.body;     // order ID from the request body

  if (!orderId) {
    return res.status(400).json({ error: 'Missing orderId' });
  }

  try {
    // Check if the order exists
    const orderRes = await pool.query('SELECT id, status FROM orders WHERE id = $1', [orderId]);
    if (!orderRes.rows.length) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderRes.rows[0];
    if (order.status !== 'pending') {
      return res.status(400).json({ error: 'Order is not in pending status' });
    }

    // Check if the logistics partner exists
    const partnerRes = await pool.query('SELECT id FROM logistic_partners WHERE id = $1', [partnerId]);
    if (!partnerRes.rows.length) {
      return res.status(404).json({ error: 'Logistics partner not found' });
    }

    // Create the logistics assignment
    const result = await pool.query(
      'INSERT INTO assignments (order_id, logistics_user_id, status) VALUES ($1, $2, $3) RETURNING id, status',
      [orderId, partnerId, 'notified']
    );
    
    res.status(201).json({ assignmentId: result.rows[0].id, status: result.rows[0].status });
  } catch (err) {
    console.error('Error in assignLogistics:', err);
    res.status(500).json({ error: 'Assignment failed' });
  }
};















// POST /logistics/assignments/:aid/accept
async function acceptAssignment(req, res) {
  const aid = req.params.aid;
  try {
    await pool.query(
      `UPDATE assignments SET status='accepted', updated_at=NOW() WHERE id=$1`,
      [aid]
    );
    res.json({ status: 'accepted' });
  } catch (err) {
    console.error('acceptAssignment error:', err);
    res.status(500).json({ error: 'Accept failed' });
  }
}

// PATCH /logistics/assignments/:aid
async function updateAssignment(req, res) {
  const aid = req.params.aid;
  const { lorryNumber, lat, lng, otp } = req.body;
  const fields = [];
  const values = [];
  let idx = 1;
  if (lorryNumber) {
    fields.push(`lorry_number=$${idx}`);
    values.push(lorryNumber);
    idx++;
  }
  if (lat !== undefined && lng !== undefined) {
    fields.push(`lat=$${idx}`, `lng=$${idx+1}`);
    values.push(lat, lng);
    idx += 2;
  }
  if (otp) {
    fields.push(`otp=$${idx}`);
    values.push(otp);
    idx++;
  }
  if (!fields.length) {
    return res.status(400).json({ error: 'No fields to update' });
  }
  const setClause = fields.join(', ') + `, updated_at=NOW()`;
  values.push(aid);
  const query = `UPDATE assignments SET ${setClause} WHERE id=$${idx}`;
  try {
    await pool.query(query, values);
    res.json({ status: 'in_transit' });
  } catch (err) {
    console.error('updateAssignment error:', err);
    res.status(500).json({ error: 'Update failed' });
  }
}

// POST /logistics/:orderId/confirm
async function confirmDelivery(req, res) {
  const orderId = req.params.orderId;
  const { otpConfirmation } = req.body;
  if (!otpConfirmation) {
    return res.status(400).json({ error: 'Missing OTP' });
  }
  try {
    const asnRes = await pool.query(
      'SELECT id, otp FROM assignments WHERE order_id=$1',
      [orderId]
    );
    if (!asnRes.rows.length) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    const { id, otp } = asnRes.rows[0];
    if (otp !== otpConfirmation) {
      return res.status(403).json({ error: 'OTP mismatch' });
    }
    await pool.query(
      `UPDATE assignments SET status='delivered', updated_at=NOW() WHERE id=$1`,
      [id]
    );
    res.json({ delivered: true });
  } catch (err) {
    console.error('confirmDelivery error:', err);
    res.status(500).json({ error: 'Confirmation failed' });
  }
}

module.exports = {
  getNearbyPartners,
  assignLogistics,
  acceptAssignment,
  updateAssignment,
  confirmDelivery
};

