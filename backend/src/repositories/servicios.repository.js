const { supabase } = require('../config/supabase');

async function findActiveServices() {
  const { data, error } = await supabase
    .from('servicios')
    .select('id, nombre, categoria')
    .eq('activo', true)
    .order('nombre', { ascending: true });

  if (error) {
    throw error;
  }

  return data || [];
}

async function findServiceById(serviceId) {
  const { data, error } = await supabase
    .from('servicios')
    .select('id, nombre, categoria, activo')
    .eq('id', serviceId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

module.exports = { findActiveServices, findServiceById };
