const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
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

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// Socket.IO event handling
const activeIntervals = new Map(); // Track intervals for each conversationId

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle "newMsg" event
    socket.on('newMsg', ({ message, conversationId }) => {
        console.log('New message:', message, 'Conversation ID:', conversationId);
        
        // Emit event immediately
        io.emit('checkMsgs', conversationId);

        // Clear any existing interval for the same conversationId
        if (activeIntervals.has(conversationId)) {
            clearInterval(activeIntervals.get(conversationId));
        }

        // Set up a new interval for emitting `checkMsgs`
        const intervalId = setInterval(() => {
            io.emit('checkMsgs', conversationId);
        }, 4000);

        // Store the intervalId
        activeIntervals.set(conversationId, intervalId);
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        // Optional: Clear intervals related to the user if needed
    });

   
});


// Sample Route
app.get('/', (req, res) => res.send('API is running...'));

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
