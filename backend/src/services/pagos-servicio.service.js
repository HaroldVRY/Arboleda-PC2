const { AppError } = require('../utils/AppError');
const { validateOnlinePassword } = require('../utils/authHelpers');
const { deductSaldo } = require('../utils/saldoHelpers');
const { findActiveServices, findServiceById } = require('../repositories/servicios.repository');
const { findAccountById } = require('../repositories/cuentas.repository');
const { createPaymentService } = require('../repositories/pagos-servicio.repository');
const { findUserAuthById } = require('../repositories/auth.repository');

async function listActiveServices() {
  return findActiveServices();
}

function validatePaymentInput(payload) {
  const { servicio_id, codigo_referencia, monto, clave_online, cuenta_id } = payload;

  if (!servicio_id) {
    throw new AppError('El servicio es obligatorio', 'VALIDATION_ERROR', 400);
  }

  if (!codigo_referencia || String(codigo_referencia).trim().length === 0) {
    throw new AppError('El código de referencia es obligatorio', 'VALIDATION_ERROR', 400);
  }

  const amount = Number(monto);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new AppError('El monto debe ser mayor a 0', 'VALIDATION_ERROR', 400);
  }

  if (!clave_online || String(clave_online).trim().length === 0) {
    throw new AppError('La clave online es obligatoria', 'VALIDATION_ERROR', 400);
  }

  if (!cuenta_id) {
    throw new AppError('La cuenta es obligatoria', 'VALIDATION_ERROR', 400);
  }

  return {
    servicio_id: Number(servicio_id),
    codigo_referencia: String(codigo_referencia),
    monto: amount,
    clave_online: String(clave_online),
    cuenta_id: String(cuenta_id),
  };
}

async function createPaymentOperation(userId, payload) {
  const input = validatePaymentInput(payload);

  const [user, service, account] = await Promise.all([
    findUserAuthById(userId),
    findServiceById(input.servicio_id),
    findAccountById(input.cuenta_id),
  ]);

  if (!user) {
    throw new AppError('Usuario no encontrado', 'NOT_FOUND', 404);
  }

  if (!service || !service.activo) {
    throw new AppError('Servicio inválido o inactivo', 'VALIDATION_ERROR', 400);
  }

  if (!account || account.usuario_id !== userId) {
    throw new AppError('La cuenta no pertenece al usuario autenticado', 'FORBIDDEN', 403);
  }

  await validateOnlinePassword(input.clave_online, user.clave_online_hash);

  const cuentaActualizada = await deductSaldo(account.id, userId, input.monto);

  try {
    const pago = await createPaymentService({
      usuario_id: userId,
      cuenta_id: account.id,
      servicio_id: service.id,
      codigo_referencia: input.codigo_referencia,
      monto: input.monto,
    });

    return {
      mensaje: 'Pago realizado con éxito.',
      pago: {
        ...pago,
        cuenta: {
          id: cuentaActualizada.id,
          numero_cuenta: cuentaActualizada.numero_cuenta,
          alias: cuentaActualizada.alias,
          saldo: cuentaActualizada.saldo,
          moneda: cuentaActualizada.moneda,
        },
        servicio: {
          id: service.id,
          nombre: service.nombre,
          categoria: service.categoria,
        },
      },
    };
  } catch (error) {
    try {
      const saldoOriginal = Number(account.saldo);
      const { deductSaldo: _ } = require('../utils/saldoHelpers');
      await require('../utils/saldoHelpers').updateAccountSaldo(account.id, userId, saldoOriginal);
    } catch (rollbackError) {
      console.error('Rollback failed:', rollbackError);
    }

    throw error;
  }
}

module.exports = { listActiveServices, createPaymentOperation };
