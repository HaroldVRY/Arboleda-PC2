const { supabase } = require('../config/supabase');

async function findActiveOperators() {
  const { data, error } = await supabase
    .from('operadores')
    .select('id, nombre')
    .eq('activo', true)
    .order('nombre', { ascending: true });

  if (error) {
    throw error;
  }

  return data || [];
}

async function findOperatorById(operatorId) {
  const { data, error } = await supabase
    .from('operadores')
    .select('id, nombre, activo')
    .eq('id', operatorId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

module.exports = { findActiveOperators, findOperatorById };
