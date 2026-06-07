const { z } = require('zod');
const { listActiveServices, createPaymentOperation } = require('../services/pagos-servicio.service');

const paymentSchema = z.object({
  body: z.object({
    servicio_id: z.union([z.string(), z.number()]),
    codigo_referencia: z.string(),
    monto: z.union([z.string(), z.number()]),
    clave_online: z.string(),
    cuenta_id: z.string(),
  }),
});

async function getServicesController(req, res, next) {
  try {
    const servicios = await listActiveServices();
    return res.json({ servicios });
  } catch (error) {
    return next(error);
  }
}

async function postPaymentController(req, res, next) {
  try {
    const result = await createPaymentOperation(req.usuario.id, req.validated.body);
    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
}

module.exports = { getServicesController, postPaymentController, paymentSchema };
