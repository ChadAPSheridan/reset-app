const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Project = require('../models/Project');

console.log('Auth middleware loaded');

const checkProjectAccess = async (req, res, next) => {
  console.log('Checking project access');
  const userId = req.user.id;
  const projectId = req.params.id;

  const project = await Project.findByPk(projectId, {
    include: [User],
  });
  console.log('Project:', project);

  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const user = await User.findByPk(userId);
  console.log('User:', user);
  if (user.permissionLevel === 'admin' || project.Users.some(u => u.id === userId)) {
    console.log('Access granted');
    next();
  } else {
    res.status(403).json({ error: 'Access denied' });
  }
};

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    console.log('No token found');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
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

module.exports = { checkProjectAccess, authenticate };