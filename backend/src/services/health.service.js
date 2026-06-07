const { getHealthStatus } = require('../repositories/health.repository');

function fetchHealthStatus() {
  return getHealthStatus();
}

module.exports = { fetchHealthStatus };
