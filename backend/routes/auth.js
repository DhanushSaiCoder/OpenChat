const express = require("express");
const bcrypt = require("bcrypt"); // Import bcrypt for hashing and comparing passwords
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken')
//get user doc
router.get('/userFullDoc', authenticateToken, async (req, res) => {
  if (!req.user) {
    return res.status(401).send('Unauthorized: No valid token provided');
  }

  try {
    const user = await User.findOne({ _id: req.user.userId });
    if (!user) {
      return res.status(404).send('User not found'); // Send 404 status for user not found
    }
    res.status(200).send(user); // Send 200 status for successful retrieval
  } catch (error) {
    res.status(500).send('Internal Server Error'); // Handle any other errors
  }
});


router.get('/userDoc', authenticateToken, async (req, res) => {
  if (!req.user) {
    return res.status(401).send('Unauthorized: No valid token provided');
  }
  res.send(req.user)
})

//get user id
router.get('', authenticateToken, async (req, res) => {
  if (!req.user) {
    return res.status(401).send('Unauthorized: No valid token provided');
  }

  res.send({ userId: req.user.userId });
});


// Serve the signup page
router.get('/signup', (req, res) => {
  res.send('signup page');
  console.log('signup page');
});

// Serve the login page
router.get('/login', (req, res) => {
  res.send('login page');

});

// Signup Route - Hash the password before saving
router.post("/signup", async (req, res) => {
  const { email, password, username, friends } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with friends list if provided
    const newUser = new User({
      email,
      password: hashedPassword,
      username,
      friends: friends || []  // Set friends to the provided array or an empty array
    });

    await newUser.save();

    // Generate JWT token for the new user
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: "User created successfully", token });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Login Route - Compare the entered password with the hashed password
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User Not Found" }); // Unified error message
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;