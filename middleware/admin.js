const { User } = require('../models/user');

module.exports = function (req, res, next) {
  if (!req.user.isAdmin) return res.status(403).send('Access Denied.');

  next();
};
