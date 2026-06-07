const express = require('express');
const { authMiddleware } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const { loginController, meController, loginSchema } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/login', validate(loginSchema), loginController);
router.get('/me', authMiddleware, meController);

module.exports = { authRouter: router };
