
// File: src/routes/logistics.js
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authmiddleware');
const logisticsController = require('../controllers/logisticsController');

router.get('/nearby', authenticateToken, logisticsController.getNearbyPartners);
router.post('/:id/assign', authenticateToken, logisticsController.assignLogistics);
router.post('/assignments/:aid/accept', authenticateToken, logisticsController.acceptAssignment);
router.patch('/assignments/:aid', authenticateToken, logisticsController.updateAssignment);
router.post('/:orderId/confirm', authenticateToken, logisticsController.confirmDelivery);

module.exports = router;
