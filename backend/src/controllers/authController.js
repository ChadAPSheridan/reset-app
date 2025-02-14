const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (req, res) => {
  console.log('register called with body:', req.body);
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ username, password: hashedPassword });
    console.log('User registered:', user);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(400).json({ message: 'Error registering user', error });
  }
};

const login = async (req, res) => {
  console.log('login called with body:', req.body);
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });
  if (!user || !await bcrypt.compare(password, user.password)) {
    console.log('Invalid credentials for username:', username);
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
  console.log('Token generated for user:', user);
  res.json({ 
    token,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      permissionLevel: user.permissionLevel,
    },
  });
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('Fetching user profile for user ID:', userId); // Log user ID
    const user = await User.findByPk(userId);

    if (!user) {
      console.error('User not found for ID:', userId); // Log error
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Failed to fetch user profile:', error); // Log error
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};

module.exports = {
  getUserProfile,
  register,
  login,
};