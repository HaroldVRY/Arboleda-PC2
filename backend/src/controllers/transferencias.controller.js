const { z } = require('zod');
const { createTransferenceOperation } = require('../services/transferencias.service');

const transferenciaSchema = z.object({
  body: z.object({
    cuenta_origen_id: z.string(),
    cuenta_destino_id: z.string(),
    monto: z.union([z.string(), z.number()]),
    clave_online: z.string(),
  }),
});

async function postTransferenceController(req, res, next) {
  try {
    const result = await createTransferenceOperation(req.usuario.id, req.validated.body);
    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
}

module.exports = { postTransferenceController, transferenciaSchema };
