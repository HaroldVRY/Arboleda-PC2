const { AppError } = require('../utils/AppError');
const { validateOnlinePassword } = require('../utils/authHelpers');
const { deductSaldo, addSaldo } = require('../utils/saldoHelpers');
const { findAccountById } = require('../repositories/cuentas.repository');
const { createTransference } = require('../repositories/transferencias.repository');
const { findUserAuthById } = require('../repositories/auth.repository');

function validateTransferenceInput(payload) {
  const { cuenta_origen_id, cuenta_destino_id, monto, clave_online } = payload;

  if (!cuenta_origen_id) {
    throw new AppError('La cuenta de origen es obligatoria', 'VALIDATION_ERROR', 400);
  }

  if (!cuenta_destino_id) {
    throw new AppError('La cuenta de destino es obligatoria', 'VALIDATION_ERROR', 400);
  }

  if (cuenta_origen_id === cuenta_destino_id) {
    throw new AppError('Las cuentas de origen y destino deben ser distintas', 'VALIDATION_ERROR', 400);
  }

  const amount = Number(monto);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new AppError('El monto debe ser mayor a 0', 'VALIDATION_ERROR', 400);
  }

  if (!clave_online || String(clave_online).trim().length === 0) {
    throw new AppError('La clave online es obligatoria', 'VALIDATION_ERROR', 400);
  }

  return {
    cuenta_origen_id: String(cuenta_origen_id),
    cuenta_destino_id: String(cuenta_destino_id),
    monto: amount,
    clave_online: String(clave_online),
  };
}

async function createTransferenceOperation(userId, payload) {
  const input = validateTransferenceInput(payload);

  const [user, cuentaOrigen, cuentaDestino] = await Promise.all([
    findUserAuthById(userId),
    findAccountById(input.cuenta_origen_id),
    findAccountById(input.cuenta_destino_id),
  ]);

  if (!user) {
    throw new AppError('Usuario no encontrado', 'NOT_FOUND', 404);
  }

  if (!cuentaOrigen || cuentaOrigen.usuario_id !== userId) {
    throw new AppError('La cuenta de origen no pertenece al usuario autenticado', 'FORBIDDEN', 403);
  }

  if (!cuentaDestino) {
    throw new AppError('La cuenta de destino no existe', 'NOT_FOUND', 404);
  }

  await validateOnlinePassword(input.clave_online, user.clave_online_hash);

  const saldoOrigenActual = Number(cuentaOrigen.saldo);
  if (saldoOrigenActual < input.monto) {
    throw new AppError('Saldo insuficiente en la cuenta de origen', 'UNPROCESSABLE_ENTITY', 422);
  }

  const cuentaOrigenActualizada = await deductSaldo(cuentaOrigen.id, userId, input.monto);

  try {
    const cuentaDestinoActualizada = await addSaldo(cuentaDestino.id, cuentaDestino.usuario_id, input.monto);

    const transferencia = await createTransference({
      usuario_id: userId,
      cuenta_origen_id: cuentaOrigen.id,
      cuenta_destino_id: cuentaDestino.id,
      monto: input.monto,
    });

    return {
      mensaje: 'Transferencia realizada con éxito.',
      transferencia: {
        ...transferencia,
        cuenta_origen: {
          id: cuentaOrigenActualizada.id,
          numero_cuenta: cuentaOrigenActualizada.numero_cuenta,
          alias: cuentaOrigenActualizada.alias,
          saldo: cuentaOrigenActualizada.saldo,
          moneda: cuentaOrigenActualizada.moneda,
        },
        cuenta_destino: {
          id: cuentaDestinoActualizada.id,
          numero_cuenta: cuentaDestinoActualizada.numero_cuenta,
          alias: cuentaDestinoActualizada.alias,
          saldo: cuentaDestinoActualizada.saldo,
          moneda: cuentaDestinoActualizada.moneda,
        },
      },
    };
  } catch (error) {
    try {
      const { updateAccountSaldo } = require('../utils/saldoHelpers');
      await updateAccountSaldo(cuentaOrigen.id, userId, saldoOrigenActual);
    } catch (rollbackError) {
      console.error('Rollback failed:', rollbackError);
    }

    throw error;
  }
}

module.exports = { createTransferenceOperation };
