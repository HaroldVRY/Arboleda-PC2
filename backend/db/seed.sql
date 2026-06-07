-- Caso Banco Arboleda
-- Datos de prueba para cargar una sola vez en Supabase.
-- Credenciales demo:
--   email: cliente@arboleda.com
--   password: Arboleda123
--   clave online: 123456
--
-- Los hashes de password y clave online se generaron con backend/db/seed-passwords.js.
-- Si necesitas regenerarlos, vuelve a ejecutar ese script y reemplaza estos valores.

insert into usuarios (id, nombre, email, password_hash, clave_online_hash)
values (
  '11111111-1111-1111-1111-111111111111',
  'Cliente Demo',
  'cliente@arboleda.com',
  '$2b$10$0qRqBxiXO1IAysiXcuaRduBHS/.8.AAifDJxSssUFXZNdeduYJGCK',
  '$2b$10$jv7Kl2awG1lYj0r7gPcB0uslfRzg9gqeGlphEfJj/dQlZhzGmTYBK'
)
on conflict (email) do update set
  nombre = excluded.nombre,
  password_hash = excluded.password_hash,
  clave_online_hash = excluded.clave_online_hash;

insert into cuentas (id, usuario_id, numero_cuenta, alias, saldo, moneda)
values
  (
    '22222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    '001-00012345-01',
    'Ahorros Demo',
    1500.00,
    'PEN'
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111',
    '001-00012345-02',
    'Corriente Demo',
    3200.00,
    'PEN'
  )
on conflict (numero_cuenta) do update set
  alias = excluded.alias,
  saldo = excluded.saldo,
  moneda = excluded.moneda;

insert into operadores (id, nombre, activo)
values
  (1, 'Claro', true),
  (2, 'Movistar', true),
  (3, 'Entel', true),
  (4, 'Bitel', true)
on conflict (nombre) do update set
  activo = excluded.activo;

insert into servicios (id, nombre, categoria, activo)
values
  (1, 'Luz del Sur', 'Energía', true),
  (2, 'Sedapal', 'Agua', true),
  (3, 'Movistar Hogar', 'Internet', true),
  (4, 'Universidad UNI', 'Educación', true)
on conflict (nombre) do update set
  categoria = excluded.categoria,
  activo = excluded.activo;
