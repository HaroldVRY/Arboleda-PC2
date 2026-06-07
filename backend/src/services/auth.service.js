const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { env } = require('../config/env');
const { AppError } = require('../utils/AppError');
const { findUserByEmail, findUserById } = require('../repositories/auth.repository');

async function login({ email, password }) {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new AppError('Credenciales inválidas', 'UNAUTHORIZED', 401);
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);

  if (!passwordMatches) {
    throw new AppError('Credenciales inválidas', 'UNAUTHORIZED', 401);
  }

  const token = jwt.sign(
    {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
    },
    env.jwtSecret,
    { expiresIn: '1h' }
  );

  return {
    token,
    usuario: {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
    },
  };
}

async function getCurrentUser(userId) {
  const user = await findUserById(userId);

  if (!user) {
    throw new AppError('Usuario no encontrado', 'NOT_FOUND', 404);
  }

  return user;
}

module.exports = { login, getCurrentUser };
