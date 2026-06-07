const bcrypt = require('bcrypt');
const { AppError } = require('./AppError');

async function validateOnlinePassword(claveOnlineInput, userClaveOnlineHash) {
  const isValid = await bcrypt.compare(String(claveOnlineInput || ''), userClaveOnlineHash);
  if (!isValid) {
    throw new AppError('Clave online incorrecta', 'UNAUTHORIZED', 401);
  }
}

module.exports = { validateOnlinePassword };
