const { fetchHealthStatus } = require('../services/health.service');

function getHealth(req, res, next) {
  try {
    return res.json(fetchHealthStatus());
  } catch (error) {
    return next(error);
  }
}

module.exports = { getHealth };
