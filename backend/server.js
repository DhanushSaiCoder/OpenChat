const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); // Import path module
dotenv.config();

const app = express();
const http = require('http');
const socketIo = require('socket.io');

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIo(server, {
    cors: {
        origin: '*', // Allow all origins (adjust this for production security)
        methods: ['GET', 'POST'],
    },
});

// Middleware
app.use(express.json());
app.use(cors());
app.use('/auth', require('./routes/auth'));
app.use('/conversation', require('./routes/conversations'));
app.use('/message', require('./routes/messages'));
app.use('/users', require('./routes/users'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// Socket.IO event handling
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle user joining a conversation
    socket.on('joinConversation', (conversationId) => {
        socket.join(conversationId);
        console.log(`User joined conversation: ${conversationId}`);
    });

    // Handle "newMsg" event
    socket.on('newMsg', ({ message, conversationId, senderId }) => {
        console.log('New message:', message, 'Conversation ID:', conversationId);
        io.to(conversationId).emit('checkMsgs', { message, conversationId, senderId });
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/chat-app/build')));

// Catch-all route to handle React routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/chat-app/build', 'index.html'));
});

// Sample Route
app.get('/api', (req, res) => res.send('API is running...'));

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
