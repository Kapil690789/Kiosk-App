const express = require('express');
const router = express.Router();
const { initiateTransaction, confirmPayment } = require('../controllers/kioskController');
const { protect } = require('../middleware/authMiddleware');

router.post('/initiate', protect, initiateTransaction);
router.post('/confirm', protect, confirmPayment);

module.exports = router;
