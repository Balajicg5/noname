
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');
const jwt = require('jsonwebtoken');
const { errorResponse } = require('./utils/responseUtils');

// Connect to database
connectDB();

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.use((socket, next) => {
  if (socket.handshake.query && socket.handshake.query.token) {
    jwt.verify(socket.handshake.query.token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return next(errorResponse(null, 'Authentication error', 401));
      socket.user = decoded.user;
      next();
    });
  } else {
    next(new Error('Authentication error'));
  }
});

const PORT = process.env.PORT || 5000;

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes(io));

app.get('/', (req, res) => {
  res.send('Server is running');
});

io.on('connection', (socket) => {
  console.log('a user connected', socket.user.id);
  socket.join(socket.user.id); // Join a room specific to the user

  socket.on('disconnect', () => {
    console.log('user disconnected', socket.user.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
