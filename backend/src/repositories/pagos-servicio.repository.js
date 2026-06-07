const { supabase } = require('../config/supabase');

async function createPaymentService(payload) {
  const { data, error } = await supabase
    .from('pagos_servicio')
    .insert({
      usuario_id: payload.usuario_id,
      cuenta_id: payload.cuenta_id,
      servicio_id: payload.servicio_id,
      codigo_referencia: payload.codigo_referencia,
      monto: payload.monto,
      estado: 'EXITOSA',
    })
    .select('id, usuario_id, cuenta_id, servicio_id, codigo_referencia, monto, estado, created_at')
    .single();

  if (error) {
    throw error;
  }

  return data;
}

module.exports = { createPaymentService };
