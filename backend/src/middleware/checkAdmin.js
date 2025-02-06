const User = require('../models/User');

const checkAdmin = async (req, res, next) => {
  const userId = req.user.id;
  const user = await User.findByPk(userId);

  if (user.permissionLevel === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied' });
  }
};

module.exports = checkAdmin;