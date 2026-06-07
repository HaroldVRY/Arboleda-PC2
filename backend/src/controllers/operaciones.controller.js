const { z } = require('zod');
const { listActiveOperators, listUserAccounts, createRechargeOperation } = require('../services/operaciones.service');

const rechargeSchema = z.object({
  body: z.object({
    numero_celular: z.string(),
    operador_id: z.union([z.string(), z.number()]),
    monto: z.union([z.string(), z.number()]),
    clave_online: z.string(),
    cuenta_id: z.string(),
  }),
});

async function getOperatorsController(req, res, next) {
  try {
    const operadores = await listActiveOperators();
    return res.json({ operadores });
  } catch (error) {
    return next(error);
  }
}

async function getAccountsController(req, res, next) {
  try {
    const cuentas = await listUserAccounts(req.usuario.id);
    return res.json({ cuentas });
  } catch (error) {
    return next(error);
  }
}

async function postRechargeController(req, res, next) {
  try {
    const result = await createRechargeOperation(req.usuario.id, req.validated.body);
    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getOperatorsController,
  getAccountsController,
  postRechargeController,
  rechargeSchema,
};
