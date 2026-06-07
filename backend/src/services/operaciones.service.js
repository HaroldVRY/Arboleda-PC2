const bcrypt = require('bcrypt');
const { AppError } = require('../utils/AppError');
const { findActiveOperators, findOperatorById } = require('../repositories/operadores.repository');
const { findAccountsByUserId, findAccountById, updateAccountBalance } = require('../repositories/cuentas.repository');
const { createRecharge } = require('../repositories/recargas.repository');
const { findUserById, findUserAuthById } = require('../repositories/auth.repository');

async function listActiveOperators() {
  return findActiveOperators();
}

async function listUserAccounts(userId) {
  return findAccountsByUserId(userId);
}

function validateRechargeInput(payload) {
  const { numero_celular, operador_id, monto, clave_online, cuenta_id } = payload;

  if (!/^\d{9}$/.test(String(numero_celular || ''))) {
    throw new AppError('El número de celular debe tener 9 dígitos', 'VALIDATION_ERROR', 400);
  }

  const amount = Number(monto);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new AppError('El monto debe ser mayor a 0', 'VALIDATION_ERROR', 400);
  }

  if (!operador_id) {
    throw new AppError('El operador es obligatorio', 'VALIDATION_ERROR', 400);
  }

  if (!cuenta_id) {
    throw new AppError('La cuenta es obligatoria', 'VALIDATION_ERROR', 400);
  }

  if (!clave_online || String(clave_online).trim().length === 0) {
    throw new AppError('La clave online es obligatoria', 'VALIDATION_ERROR', 400);
  }

  return {
    numero_celular: String(numero_celular),
    operador_id: Number(operador_id),
    monto: amount,
    clave_online: String(clave_online),
    cuenta_id: String(cuenta_id),
  };
}

async function createRechargeOperation(userId, payload) {
  const input = validateRechargeInput(payload);

  const [user, operator, account] = await Promise.all([
    findUserAuthById(userId),
    findOperatorById(input.operador_id),
    findAccountById(input.cuenta_id),
  ]);

  if (!user) {
    throw new AppError('Usuario no encontrado', 'NOT_FOUND', 404);
  }

  if (!operator || !operator.activo) {
    throw new AppError('Operador inválido o inactivo', 'VALIDATION_ERROR', 400);
  }

  if (!account || account.usuario_id !== userId) {
    throw new AppError('La cuenta no pertenece al usuario autenticado', 'FORBIDDEN', 403);
  }

  const claveOk = await bcrypt.compare(input.clave_online, user.clave_online_hash);
  if (!claveOk) {
    throw new AppError('Clave online incorrecta', 'UNAUTHORIZED', 401);
  }

  const saldoActual = Number(account.saldo);
  if (saldoActual < input.monto) {
    throw new AppError('Saldo insuficiente en la cuenta seleccionada', 'UNPROCESSABLE_ENTITY', 422);
  }

  const saldoActualizado = Number((saldoActual - input.monto).toFixed(2));
  const cuentaActualizada = await updateAccountBalance(account.id, userId, saldoActualizado);

  try {
    const recarga = await createRecharge({
      usuario_id: userId,
      cuenta_id: account.id,
      numero_celular: input.numero_celular,
      operador_id: operator.id,
      monto: input.monto,
    });

    return {
      mensaje: 'Recarga realizada con éxito.',
      recarga: {
        ...recarga,
        cuenta: {
          id: cuentaActualizada.id,
          numero_cuenta: cuentaActualizada.numero_cuenta,
          alias: cuentaActualizada.alias,
          saldo: cuentaActualizada.saldo,
          moneda: cuentaActualizada.moneda,
        },
        operador: {
          id: operator.id,
          nombre: operator.nombre,
        },
      },
    };
  } catch (error) {
    try {
      await updateAccountBalance(account.id, userId, saldoActual);
    } catch (rollbackError) {
      throw rollbackError;
    }

    throw error;
  }
}

module.exports = { listActiveOperators, listUserAccounts, createRechargeOperation };
