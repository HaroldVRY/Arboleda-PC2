const jwt = require('jsonwebtoken');
const { env } = require('../config/env');
const { AppError } = require('../utils/AppError');

function authMiddleware(req, res, next) {
  const authorization = req.headers.authorization || '';
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : null;

  if (!token) {
    return next(new AppError('Missing authorization token', 'UNAUTHORIZED', 401));
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.usuario = payload;
    return next();
  } catch (error) {
    return next(new AppError('Invalid or expired token', 'UNAUTHORIZED', 401));
  }
}

module.exports = { authMiddleware };
