const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
const app = express();

const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(express.json());
app.use(cors());
app.use('/auth', require('./routes/auth'))
app.use('/conversation', require('./routes/conversations'))
app.use('/message', require('./routes/messages'))


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
   .then(() => console.log('MongoDB connected'))
   .catch(err => console.log(err));

//socket.io
io.on('connection', (socket) => {
   console.log('A user connected:', socket.id);

   // Listen for a user to join a specific room
   socket.on('joinRoom', ({ username, conversationId }) => {
      socket.join(conversationId); // Join the specified room
      console.log(`${username} joined room: ${conversationId}`);

      // Notify other users in the room
      socket.to(conversationId).emit('userJoined', { username, conversationId });
   });

   // Listen for messages from clients in a specific room
   socket.on('sendMessage', ({ username, messageData, conversationId }) => {
      console.log(`Message from ${username} in room ${conversationId}:`, messageData);

      // Broadcast the message to the specific room (excluding the sender)
      socket.to(conversationId).emit('receiveMessage', { username, messageData });
   });

   // Notify other users in the room when a user disconnects
   socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
   });
});


// Sample Route
app.get('/', (req, res) => res.send('API is running...'));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
