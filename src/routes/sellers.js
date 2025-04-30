
// File: src/routes/Sellers.js
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authmiddleware');
const sellersController = require('../controllers/sellersController');

// Seller profile endpoints
router.get('/profile', authenticateToken, sellersController.getMyProfile);
router.post('/profile', authenticateToken, sellersController.createProfile);

// Products CRUD
router.get('/:id/products', authenticateToken, sellersController.getProducts);
router.post('/:id/products', authenticateToken, sellersController.addProduct);
router.patch('/:id/products/:prodId', authenticateToken, sellersController.updateProduct);

module.exports = router;
