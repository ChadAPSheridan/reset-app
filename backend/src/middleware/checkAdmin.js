const User = require('../models/User');

const checkAdmin = (req, res, next) => {
  if (req.user && req.user.permissionLevel === 'admin') {
    next();
  } else {
    res.status(403).send({ error: 'Access denied.' });
  }
};
module.exports = checkAdmin;