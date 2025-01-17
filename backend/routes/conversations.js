const express = require('express');
const router = express.Router();
const User = require('../models/User');
const mongoose = require('mongoose');
const Joi = require('joi');
const authenticateToken = require('../middleware/authenticateToken');

const { Conversation, validateConversation } = require('../models/Conversation')


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


module.exports = router