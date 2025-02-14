const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticate } = require('./authRoutes'); // Correctly import authenticate middleware
const {
  getUserProfile,
  updateUserProfile,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  console.log('Register route called with body:', req.body);
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ username, password: hashedPassword });
    console.log('User created:', user);
    res.status(201).json(user);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(400).json({ error: error.message });
  }
});

// Login a user
router.post('/login', async (req, res) => {
  console.log('Login route called with body:', req.body);
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      console.log('User not found for username:', username);
      return res.status(404).json({ error: 'User not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Invalid credentials for username:', username);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Token generated for user:', user);
    res.json({ token });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get user profile
router.get('/me', authenticate, getUserProfile);

router.get('/profile', authenticate, getUserProfile);
router.put('/profile', authenticate, updateUserProfile);
router.get('/', authenticate, getUsers);
router.post('/', authenticate, createUser);
router.put('/:userId', authenticate, updateUser);
router.delete('/:userId', authenticate, deleteUser);

module.exports = router;