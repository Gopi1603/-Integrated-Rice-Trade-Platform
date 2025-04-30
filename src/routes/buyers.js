
// File: src/routes/buyers.js
const express = require('express');
const router = express.Router();
const { getBuyerOrders } = require('../controllers/orderController');
const { authenticateToken } = require('../middleware/authmiddleware');

router.get('/:id/orders', authenticateToken, getBuyerOrders);
module.exports = router;
