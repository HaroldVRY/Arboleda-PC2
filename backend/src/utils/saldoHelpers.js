const { supabase } = require('../config/supabase');
const { AppError } = require('./AppError');

async function updateAccountSaldo(accountId, usuarioId, nuevoSaldo) {
  const { data, error } = await supabase
    .from('cuentas')
    .update({ saldo: nuevoSaldo })
    .eq('id', accountId)
    .eq('usuario_id', usuarioId)
    .select('id, usuario_id, numero_cuenta, alias, saldo, moneda, created_at')
    .single();

  if (error) {
    throw error;
  }

  return data;
}

async function deductSaldo(accountId, usuarioId, amount) {
  const { data: cuenta, error: selectError } = await supabase
    .from('cuentas')
    .select('saldo')
    .eq('id', accountId)
    .eq('usuario_id', usuarioId)
    .maybeSingle();

  if (selectError) {
    throw selectError;
  }

  if (!cuenta) {
    throw new AppError('La cuenta no existe o no pertenece al usuario', 'NOT_FOUND', 404);
  }

  const saldoActual = Number(cuenta.saldo);
  if (saldoActual < amount) {
    throw new AppError('Saldo insuficiente', 'UNPROCESSABLE_ENTITY', 422);
  }

  const nuevoSaldo = Number((saldoActual - amount).toFixed(2));
  return updateAccountSaldo(accountId, usuarioId, nuevoSaldo);
}

async function addSaldo(accountId, usuarioId, amount) {
  const { data: cuenta, error: selectError } = await supabase
    .from('cuentas')
    .select('saldo')
    .eq('id', accountId)
    .eq('usuario_id', usuarioId)
    .maybeSingle();

  if (selectError) {
    throw selectError;
  }

  if (!cuenta) {
    throw new AppError('La cuenta no existe o no pertenece al usuario', 'NOT_FOUND', 404);
  }

  const saldoActual = Number(cuenta.saldo);
  const nuevoSaldo = Number((saldoActual + amount).toFixed(2));
  return updateAccountSaldo(accountId, usuarioId, nuevoSaldo);
}

module.exports = { updateAccountSaldo, deductSaldo, addSaldo };
