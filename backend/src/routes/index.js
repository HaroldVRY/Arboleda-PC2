const express = require('express');
const { healthRouter } = require('./health.routes');
const { authRouter } = require('./auth.routes');
const { operacionesRouter } = require('./operaciones.routes');

const router = express.Router();

router.use('/', healthRouter);
router.use('/auth', authRouter);
router.use('/', operacionesRouter);

module.exports = { apiRouter: router };
