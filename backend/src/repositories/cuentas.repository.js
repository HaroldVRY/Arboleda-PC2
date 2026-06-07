const { supabase } = require('../config/supabase');

async function findAccountsByUserId(userId) {
  const { data, error } = await supabase
    .from('cuentas')
    .select('id, usuario_id, numero_cuenta, alias, saldo, moneda, created_at')
    .eq('usuario_id', userId)
    .order('created_at', { ascending: true });

  if (error) {
    throw error;
  }

  return data || [];
}

async function findAccountById(accountId) {
  const { data, error } = await supabase
    .from('cuentas')
    .select('id, usuario_id, numero_cuenta, alias, saldo, moneda, created_at')
    .eq('id', accountId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

async function updateAccountBalance(accountId, usuarioId, saldo) {
  const { data, error } = await supabase
    .from('cuentas')
    .update({ saldo })
    .eq('id', accountId)
    .eq('usuario_id', usuarioId)
    .select('id, usuario_id, numero_cuenta, alias, saldo, moneda, created_at')
    .single();

  if (error) {
    throw error;
  }

  return data;
}

module.exports = { findAccountsByUserId, findAccountById, updateAccountBalance };
