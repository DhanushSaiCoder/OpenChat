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
    // Send the messages as a response
    res.status(200).json(messagesDocs);
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




// Delete a specific message
router.delete('/:messageId', authenticateToken, async (req, res) => {
  try {
    const { messageId } = req.params; // Extract the message ID from the URL parameter
    const { userId } = req.user; // Extract the user ID from the token

    // Find the message by its ID
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Check if the user is the sender of the message
    if (message.senderId.toString() !== userId) {
      return res.status(403).json({ error: "You can only delete your own messages" });
    }

    // Delete the message
    await message.remove();

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update a specific message
router.patch('/:messageId', authenticateToken, async (req, res) => {
  try {
    const { messageId } = req.params; // Extract the message ID from the URL parameter
    const { userId } = req.user; // Extract the user ID from the token
    const { message } = req.body; // Extract the new message content from the request body

    // Validate the new message content
    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message content cannot be empty" });
    }

    // Find the message by its ID
    const existingMessage = await Message.findById(messageId);

    if (!existingMessage) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Check if the user is the sender of the message
    if (existingMessage.senderId.toString() !== userId) {
      return res.status(403).json({ error: "You can only edit your own messages" });
    }

    // Update the message content
    existingMessage.message = message;
    await existingMessage.save();

    res.status(200).json({ message: "Message updated successfully", updatedMessage: existingMessage });
  } catch (error) {
    console.error("Error updating message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;