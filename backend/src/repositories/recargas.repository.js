const { supabase } = require('../config/supabase');

async function createRecharge(payload) {
  const { data, error } = await supabase
    .from('recargas')
    .insert({
      usuario_id: payload.usuario_id,
      cuenta_id: payload.cuenta_id,
      numero_celular: payload.numero_celular,
      operador_id: payload.operador_id,
      monto: payload.monto,
      estado: 'EXITOSA',
    })
    .select('id, usuario_id, cuenta_id, numero_celular, operador_id, monto, estado, created_at')
    .single();

  if (error) {
    throw error;
  }

  return data;
}

module.exports = { createRecharge };
