const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const authenticateToken = require('../middleware/authenticateToken')
const User = require('../models/User')

// Get all users 
router.get('/:otherUser', authenticateToken, async (req, res) => {
  try {
    const users = await User.find()
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Could not retrieve messages.' });
  }
});
module.exports = router;
