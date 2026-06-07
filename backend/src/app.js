const express = require('express');
const cors = require('cors');
const { apiRouter } = require('./routes');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

function createApp() {
  const app = express();

  app.use(cors({ origin: 'http://localhost:5173' }));
  app.use(express.json());

  app.use('/api', apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
