const { AppError } = require('../utils/AppError');

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const code = err.code || (statusCode === 500 ? 'INTERNAL_ERROR' : 'REQUEST_ERROR');
  const message = err.message || 'Unexpected error';

  if (res.headersSent) {
    return next(err);
  }

  return res.status(statusCode).json({
    error: {
      message,
      code,
    },
  });
}

function notFoundHandler(req, res, next) {
  next(new AppError('Route not found', 'NOT_FOUND', 404));
}

module.exports = { errorHandler, notFoundHandler };
