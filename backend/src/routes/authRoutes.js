const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { register, getUserProfile } = require('../controllers/authController');
const User = require('../models/User');

const router = express.Router();

// Middleware to protect routes
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    console.log('No token found');
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded:', decoded);
    const user = await User.findByPk(decoded.id);
    if (!user) {
      console.log('User not found for token:', decoded);
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log('Token verification failed:', error);
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// Define the route to get the authenticated user's profile
router.get('/me', authenticate, getUserProfile);
router.post('/register', register);
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = { router, authenticate };