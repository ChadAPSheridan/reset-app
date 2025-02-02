const User = require('../models/User');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

const getUserProfile = async (req, res) => {
  const user = await User.findByPk(req.userId);
  res.json(user);
};

const updateUserProfile = async (req, res) => {
  const user = await User.findByPk(req.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  await user.update(req.body);
  res.json(user);
};

const getUsers = async (req, res) => {
  const users = await User.findAll();
  res.json(users);
};

const createUser = async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json(user);
};

const updateUser = async (req, res) => {
  const user = await User.findOne({ where: { id: req.params.userId } });
  if (!user) return res.status(404).json({ message: 'User not found' });
  await user.update(req.body);
  res.json(user);
};

const deleteUser = async (req, res) => {
  const user = await User.findOne({ where: { id: req.params.userId } });
  if (!user) return res.status(404).json({ message: 'User not found' });
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