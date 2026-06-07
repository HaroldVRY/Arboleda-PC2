const express = require('express');
const { authMiddleware } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const {
  getOperatorsController,
  getAccountsController,
  postRechargeController,
  rechargeSchema,
} = require('../controllers/operaciones.controller');
const { getServicesController, postPaymentController, paymentSchema } = require('../controllers/pagos-servicio.controller');
const { postTransferenceController, transferenciaSchema } = require('../controllers/transferencias.controller');

const router = express.Router();

router.use(authMiddleware);
router.get('/operadores', getOperatorsController);
router.get('/cuentas', getAccountsController);
router.post('/recargas', validate(rechargeSchema), postRechargeController);
router.get('/servicios', getServicesController);
router.post('/pagos-servicio', validate(paymentSchema), postPaymentController);
router.post('/transferencias', validate(transferenciaSchema), postTransferenceController);

module.exports = { operacionesRouter: router };
