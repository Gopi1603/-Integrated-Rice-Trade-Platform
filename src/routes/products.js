
// File: src/routes/products.js
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authmiddleware');
const { searchProducts } = require('../controllers/productController');

router.get('/search', authenticateToken, searchProducts);
module.exports = router;

