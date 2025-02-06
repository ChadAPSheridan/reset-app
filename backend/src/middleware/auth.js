const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Project = require('../models/Project');

const checkProjectAccess = async (req, res, next) => {
  const userId = req.user.id;
  const projectId = req.params.id;

  const project = await Project.findByPk(projectId, {
    include: [User],
  });

  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const user = await User.findByPk(userId);

  if (user.permissionLevel === 'admin' || project.Users.some(u => u.id === userId)) {
    next();
  } else {
    res.status(403).json({ error: 'Access denied' });
  }
};
const authenticate = async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate.' });
  }
};
module.exports = checkProjectAccess, authenticate;