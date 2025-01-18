const express = require('express');
const router = express.Router();
const User = require('../models/User');
const mongoose = require('mongoose');
const Joi = require('joi');
const authenticateToken = require('../middleware/authenticateToken');

const { Conversation, validateConversation } = require('../models/Conversation')

// Get all conversations for the logged-in user
router.get('/', authenticateToken, async (req, res) => {
    try {
      // Get the user ID from the authenticated token
      const userId = req.user.userId;
  
      // Find all conversations where the user is a participant
      const conversations = await Conversation.find({
        participants: { $in: [userId] }
      }).populate('participants', '_id name email'); // Optional: Populate participant details like name or email
  
      if (conversations.length === 0) {
        return res.status(404).json({
          message: 'No conversations found for this user',
          short: 'noConversations'
        });
      }
  
      // Send the conversations as a response
      res.status(200).json(conversations);
    } catch (err) {
      console.error(err); // Log the error for debugging purposes
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

router.get('/:otherUser', authenticateToken, async (req, res) => {
    try {
        // Get both user IDs
        const userId = req.user.userId;
        const otherUserId = req.params.otherUser;

        // Validate the otherUserId (assuming MongoDB ObjectId format)
        if (!mongoose.Types.ObjectId.isValid(otherUserId)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        // Find the conversation between the users
        const conversation = await Conversation.findOne({
            participants: { $all: [userId, otherUserId] }
        });

        if (!conversation) {
            return res.status(404).json({ 
                message: 'No conversation found between these users' ,
                short: 'noConvFound'
            });
        }

        // Send the response
        res.status(200).json(conversation);
    } catch (err) {
        console.error(err); // Log the error for debugging purposes
        res.status(500).json({ error: 'Internal server error' });
    }
});

//converations logic goes here
router.post('/:otherUser', authenticateToken, async (req, res) => {
    const { userId } = req.user;
    const otherUserId = req.params.otherUser;
    const { lastMessage } = req.body;


    const conv = await Conversation.findOne({
        participants: { $all: [userId, otherUserId] }
    });

    if (conv) return res.status(400).send('Conversation already exists.');

    const newConversation = new Conversation({
        participants: [userId, otherUserId],
        lastMessage: lastMessage || {},
    });

    try {
        const result = await newConversation.save();
        res.status(201).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating conversation.');
    }
});

router.delete('/:otherUser', authenticateToken, async (req, res) => {
    try {
        // Get both user IDs
        const userId = req.user.userId;
        const otherUserId = req.params.otherUser;

        // Validate the otherUserId (assuming MongoDB ObjectId format)
        if (!mongoose.Types.ObjectId.isValid(otherUserId)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        // Find and delete the conversation between the users
        const result = await Conversation.findOneAndDelete({
            participants: { $all: [userId, otherUserId] }
        });

        if (!result) {
            return res.status(404).json({ message: 'No conversation found between these users' });
        }

        // Send success response
        res.status(200).json({ message: 'Conversation successfully deleted', conversation: result });
    } catch (err) {
        console.error('Error deleting conversation:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router