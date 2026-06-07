const { supabase } = require('../config/supabase');

async function findUserByEmail(email) {
  const { data, error } = await supabase
    .from('usuarios')
    .select('id, nombre, email, password_hash, clave_online_hash')
    .eq('email', email)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

async function findUserById(id) {
  const { data, error } = await supabase
    .from('usuarios')
    .select('id, nombre, email')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

async function findUserAuthById(id) {
  const { data, error } = await supabase
    .from('usuarios')
    .select('id, nombre, email, clave_online_hash')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

module.exports = { findUserByEmail, findUserById, findUserAuthById };
