const express = require('express');
const jwt = require('jsonwebtoken');
const { register, login, getUserProfile } = require('../controllers/authController');
const User = require('../models/User');

const router = express.Router();

// Middleware to protect routes
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// Define the route to get the authenticated user's profile
router.get('/me', authenticate, getUserProfile);
router.post('/register', register);
router.post('/login', login);

module.exports = { router, authenticate };