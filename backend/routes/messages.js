const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const authenticateToken = require('../middleware/authenticateToken')

const {Conversation} = require('../models/Conversation')
const { Message, validateMessage } = require('../models/Message')

//get all messages with id of senderid and reciver id 
router.get('/:otherUser', authenticateToken, async (req,res) => {
    const userId = req.user.userId
    const otherUserId = req.params.otherUser


})

// POST a message
router.post('/:otherUser', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user; // Extract userId from the token
        const otherUserId = req.params.otherUser;
        const { message } = req.body; // Assuming the message text is passed in the request body

        // Step 1: Check if a conversation already exists between the two users
        let conversation = await Conversation.findOne({
            participants: { $all: [userId, otherUserId] }
        });

        // Step 2: If no conversation exists, create a new one
        if (!conversation) {
            conversation = new Conversation({
                participants: [userId, otherUserId],
                
            });
            await conversation.save();
        }

        // Step 3: Create a new message
        const newMessage = new Message({
            conversationId: conversation._id,
            senderId: userId,
            reciverId: otherUserId,
            message: message,
            
        });
        await newMessage.save();

        // Step 4: Return the new message as a response
        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error posting message:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});




//delete a message

module.exports = router;