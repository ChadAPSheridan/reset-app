const User = require('../models/User');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

const getUserProfile = async (req, res) => {
  console.log('getUserProfile called with userId:', req.userId);
  const user = await User.findByPk(req.userId);
  res.json(user);
};

const updateUserProfile = async (req, res) => {
  console.log('updateUserProfile called with userId:', req.userId, 'and body:', req.body);
  const user = await User.findByPk(req.userId);
  if (!user) {
    console.log('User not found for userId:', req.userId);
    return res.status(404).json({ message: 'User not found' });
  }
  await user.update(req.body);
  res.json(user);
};

const getUsers = async (req, res) => {
  console.log('getUsers called');
  const users = await User.findAll();
  res.json(users);
};

const createUser = async (req, res) => {
  console.log('createUser called with body:', req.body);
  const user = await User.create(req.body);
  res.status(201).json(user);
};

const updateUser = async (req, res) => {
  console.log('updateUser called with userId:', req.params.userId, 'and body:', req.body);
  const user = await User.findOne({ where: { id: req.params.userId } });
  if (!user) {
    console.log('User not found for userId:', req.params.userId);
    return res.status(404).json({ message: 'User not found' });
  }
  await user.update(req.body);
  res.json(user);
};

const deleteUser = async (req, res) => {
  console.log('deleteUser called with userId:', req.params.userId);
  const user = await User.findOne({ where: { id: req.params.userId } });
  if (!user) {
    console.log('User not found for userId:', req.params.userId);
    return res.status(404).json({ message: 'User not found' });
  }
  await user.destroy();
  res.status(204).end();
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};