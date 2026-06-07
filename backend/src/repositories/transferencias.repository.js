const { supabase } = require('../config/supabase');

async function createTransference(payload) {
  const { data, error } = await supabase
    .from('transferencias')
    .insert({
      usuario_id: payload.usuario_id,
      cuenta_origen_id: payload.cuenta_origen_id,
      cuenta_destino_id: payload.cuenta_destino_id,
      monto: payload.monto,
      estado: 'EXITOSA',
    })
    .select('id, usuario_id, cuenta_origen_id, cuenta_destino_id, monto, estado, created_at')
    .single();

  if (error) {
    throw error;
  }

  return data;
}

module.exports = { createTransference };
