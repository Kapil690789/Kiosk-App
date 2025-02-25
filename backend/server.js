const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { 
  cors: { origin: process.env.FRONTEND_URL, methods: ['GET', 'POST'] } 
});

// Middleware
app.use(cors());
app.use(express.json());

// Make io available in request handlers
app.set('io', io);

// Import routes
const authRoutes = require('./routes/auth');
const kioskRoutes = require('./routes/kiosk');
const qrRoutes = require('./routes/kioskRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/kiosk', kioskRoutes);
app.use(qrRoutes); // Handles /api/qrcode and /api/payment/success

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Import the new ConnectionLog model for logging events
const ConnectionLog = require('./models/ConnectionLog');

// Socket.IO connection handling with logging
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  // Store connection event in the database
  ConnectionLog.create({ clientId: socket.id, event: 'connected' }).catch(console.error);

  socket.on('join-session', (sessionId) => {
    socket.join(sessionId);
    console.log(`Socket ${socket.id} joined session ${sessionId}`);
    // Log the join-session event
    ConnectionLog.create({ clientId: socket.id, event: 'joined session', sessionId })
      .catch(console.error);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    // Log the disconnect event
    ConnectionLog.create({ clientId: socket.id, event: 'disconnected' }).catch(console.error);
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
