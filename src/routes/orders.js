
// File: src/routes/orders.js
const express = require('express');
const router = express.Router();
const { payOrder } = require('../controllers/orderController');
const { authenticateToken } = require('../middleware/authmiddleware');

router.post('/:orderId/pay', authenticateToken, payOrder);
module.exports = router;
