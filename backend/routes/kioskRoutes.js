const express = require('express');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Generate QR Code for Kiosk
router.get('/api/qrcode', async (req, res) => {
const sessionId = uuidv4();
    const qrData = `${process.env.FRONTEND_URL}/login?session=${sessionId}`;

  try {
    const qrCode = await QRCode.toDataURL(qrData);
    res.json({ qrCode, sessionId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

// Handle Payment Success
router.post('/api/payment/success', (req, res) => {
  const { sessionId, transactionId } = req.body;
  // Emit event to the room identified by sessionId to unlock the kiosk
  req.app.get('io').to(sessionId).emit('unlock-kiosk', { transactionId });
  res.json({ success: true });
});

module.exports = router;
