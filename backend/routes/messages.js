const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const authenticateToken = require('../middleware/authenticateToken')

const {Conversation} = require('../models/Conversation')
const { Message, validateMessage } = require('../models/Message')

// Get all messages between the current user and the other user
router.get('/:otherUser', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId; // Extract the logged-in user's ID
    const otherUserId = req.params.otherUser; // Extract the other user's ID from the URL parameter

    // Find all messages between the two users
    const messagesDocs = await Message.find({
      $or: [
        { senderId: userId, reciverId: otherUserId },
        { senderId: otherUserId, reciverId: userId }
      ]
    }).sort({ createdAt: 1 }); // Sort messages by creation time in ascending order

    const messages=[]
    for(i in messagesDocs){
      messages.push(messagesDocs[i].message)
    }
    // Send the messages as a response
    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Could not retrieve messages.' });
  }
});


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