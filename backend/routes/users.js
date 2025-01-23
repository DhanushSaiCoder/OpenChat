const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const authenticateToken = require('../middleware/authenticateToken')
const User = require('../models/User')

// Get all users 
router.get('', authenticateToken, async (req, res) => {
  try {
    const users = await User.find(); // Get all users
    const userId = req.user.userId; // Current user's ID
    const user = await User.findById(userId); // Current user document

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Filter users: exclude self and friends
    const filteredUsers = users.filter(
      (u) => u._id.toString() !== userId && !user.friends.includes(u._id.toString())
    );
  
    res.status(200).json(filteredUsers);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Could not retrieve messages.' });
  }
});

module.exports = router;
