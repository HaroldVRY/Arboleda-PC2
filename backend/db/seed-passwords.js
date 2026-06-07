#!/usr/bin/env node
/*
  Genera los hashes bcrypt para las credenciales demo del Caso Banco Arboleda.
  Credenciales:
  - password: Arboleda123
  - clave online: 123456

  Requiere bcryptjs instalado en el backend:
  npm install bcryptjs
*/

const bcrypt = require('bcryptjs');

const PASSWORD = 'Arboleda123';
const CLAVE_ONLINE = '123456';
const ROUNDS = 10;

async function main() {
  const [passwordHash, claveOnlineHash] = await Promise.all([
    bcrypt.hash(PASSWORD, ROUNDS),
    bcrypt.hash(CLAVE_ONLINE, ROUNDS),
  ]);

  console.log('-- Hashes demo para Supabase');
  console.log(`-- password: ${PASSWORD}`);
  console.log(`-- clave online: ${CLAVE_ONLINE}`);
  console.log('');
  console.log('password_hash= ' + passwordHash);
  console.log('clave_online_hash= ' + claveOnlineHash);
  console.log('');
  console.log('-- SQL listo para pegar en seed.sql');
  console.log('update usuarios');
  console.log(`set password_hash = '${passwordHash}',`);
  console.log(`    clave_online_hash = '${claveOnlineHash}'`);
  console.log(`where email = 'cliente@arboleda.com';`);
}

main().catch((error) => {
  console.error('No fue posible generar los hashes bcrypt.');
  console.error(error);
  process.exit(1);
});
