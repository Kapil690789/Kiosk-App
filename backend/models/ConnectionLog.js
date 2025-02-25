const mongoose = require('mongoose');

const connectionLogSchema = new mongoose.Schema({
  clientId: { type: String, required: true },
  event: { type: String, required: true }, // e.g., "connected", "joined session", "disconnected"
  sessionId: { type: String, default: null },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ConnectionLog', connectionLogSchema);
