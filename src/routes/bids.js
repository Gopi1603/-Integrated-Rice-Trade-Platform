// File: src/routes/bids.js
const express = require('express');
const router = express.Router();
const { placeBid, acceptBid } = require('../controllers/bidController');
const { authenticateToken } = require('../middleware/authmiddleware');

// Place bid
router.post('/', authenticateToken, placeBid);

// Accept bid
router.post('/:bidId/accept', authenticateToken, acceptBid);

module.exports = router;
