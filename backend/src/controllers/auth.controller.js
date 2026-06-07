const { z } = require('zod');
const { login, getCurrentUser } = require('../services/auth.service');

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('El email debe tener un formato válido'),
    password: z.string().min(1, 'La contraseña es obligatoria'),
  }),
});

async function loginController(req, res, next) {
  try {
    const { email, password } = req.validated.body;
    const result = await login({ email, password });

    return res.json(result);
  } catch (error) {
    return next(error);
  }
}

async function meController(req, res, next) {
  try {
    const usuario = await getCurrentUser(req.usuario.id);
    return res.json({ usuario });
  } catch (error) {
    return next(error);
  }
}

module.exports = { loginController, meController, loginSchema };
