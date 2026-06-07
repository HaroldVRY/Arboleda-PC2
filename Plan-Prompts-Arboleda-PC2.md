# Plan de prompts para Claude Code — Banco Arboleda (PC2)

> Documento guía. Cada **PROMPT** está listo para copiar y pegar en Claude Code, en orden.
> Después de cada fase: **prueba que la app corre** y **haz un commit** antes de seguir.

---

## 1. Qué pide el profesor (rúbrica, 20 pts)

| Entregable | Puntos |
|---|---|
| Historias de Usuario | 2 |
| Diseño de interfaz (prototipo) | 2 |
| Implementación Backend | 6 |
| Implementación Frontend | 6 |
| Implementar/configurar correcto, sin errores y con **menor costo de cambio** | 4 |

**Caso:** tras el login se muestra la pantalla "principal" con 3 opciones: *Recarga celular*, *Pago de Servicio*, *Transferencia entre mis cuentas*. El único flujo detallado es **Recarga celular** (5 pasos: número → operador → monto → clave online → "Recarga realizada con éxito").

**Restricción crítica de entrega:** el profesor quiere los **comandos exactos** para correr backend y frontend. Cualquier paso adicional resta puntos. Por eso todo el `.env` va configurado en el repo y la única acción del profesor será `npm install` y `npm run dev`.

---

## 2. Decisiones ya tomadas

- **Stack:** Backend Node.js + Express · Frontend React + Vite · BD Supabase (nube, plan free).
- **Arquitectura:** Frontend → API Backend → Supabase. El frontend **nunca** habla con Supabase directo (las llaves de Supabase viven solo en el backend). Esto protege las credenciales y reduce el costo de cambio.
- **Alcance:** las 3 opciones funcionales (Recarga es la más completa por ser la detallada).
- **Supabase en la nube + `.env` commiteado** → el profesor solo corre dos comandos.

### Comandos finales objetivo (lo que irá en el README)

```bash
# Terminal 1 — Backend
cd backend
npm install
npm run dev          # API en http://localhost:4000

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev          # App en http://localhost:5173
```

> Nota de seguridad: commitear el `.env` con la *service key* de Supabase es aceptable para una práctica con un proyecto Supabase desechable y gratuito. **Después de la calificación, borra o rota el proyecto Supabase** para no dejar llaves expuestas.

---

## 3. Cómo sacarle el máximo a Claude Code

1. **Trabaja por fases.** Pega un prompt, revisa lo que generó (lee los diffs), prueba, y recién avanza.
2. **Haz commit entre fases** (`git add . && git commit -m "..."`). Si algo se rompe, vuelves atrás fácil.
3. **Corre la app después de cada fase** y dile a Claude Code los errores reales que veas (copia el error tal cual).
4. El **PROMPT 0** crea un archivo `CLAUDE.md` con todas las reglas del proyecto. Claude Code lo lee automáticamente en cada sesión, así no tienes que repetir el contexto.
5. Si una respuesta se desvía, no la aceptes: corrige con un mensaje corto ("no uses X, hazlo con Y porque...").

---

# FASE 0 — Estructura y contexto

### PROMPT 0 — Inicializar proyecto y memoria del proyecto

```
Estoy en la carpeta "Arboleda-PC2". Vamos a desarrollar un proyecto de práctica universitaria por fases; en este primer paso solo arma la estructura y la documentación base, NO escribas código de la app todavía.

Contexto del proyecto (Caso Banco Arboleda):
- App web bancaria. Tras login se muestra una pantalla "principal" con 3 opciones: "Recarga celular", "Pago de Servicio" y "Transferencia entre mis cuentas".
- Flujo detallado de "Recarga celular": (1) digitar número de celular, (2) seleccionar operador, (3) seleccionar/digitar monto, (4) ingresar clave online para confirmar, (5) mensaje "Recarga realizada con éxito.".

Stack y reglas (esto es lo que califican, respétalo en todo el proyecto):
- Backend: Node.js + Express en carpeta "backend".
- Frontend: React + Vite en carpeta "frontend".
- Base de datos: Supabase (Postgres en la nube).
- Arquitectura obligatoria: el Frontend habla SOLO con la API del Backend; el Backend es el único que habla con Supabase. Las llaves de Supabase NUNCA van en el frontend.
- Arquitectura del backend en capas para bajo costo de cambio: routes → controllers → services → repositories (acceso a datos). Validación de entrada y middleware de manejo de errores centralizado.
- El profesor exige comandos exactos y mínimos para correr: backend = "npm install" + "npm run dev"; frontend = "npm install" + "npm run dev". Ningún paso manual adicional. El .env irá commiteado.

Tareas de este paso:
1. Crea las carpetas "backend" y "frontend" dentro de Arboleda-PC2 (vacías por ahora, solo con un .gitkeep si hace falta).
2. Crea una carpeta "docs".
3. Inicializa git en la raíz si no existe.
4. Crea un archivo CLAUDE.md en la raíz que resuma TODO este contexto (caso, stack, arquitectura, reglas de los comandos, rúbrica de calificación) para que lo uses como memoria en cada fase.
5. Crea un .gitignore en la raíz (node_modules, dist, build, etc.) PERO deja claro en un comentario que los archivos .env de backend y frontend SÍ se versionan a propósito para esta entrega.
6. Crea un README.md raíz inicial con título del proyecto y una sección "Cómo ejecutar" provisional (la completaremos al final).

Muéstrame el árbol de carpetas resultante al terminar.
```

**Verifica:** existen `backend/`, `frontend/`, `docs/`, `CLAUDE.md`, `.gitignore`, `README.md`. Luego: `git add . && git commit -m "fase 0: estructura base"`.

---

# FASE 1 — Historias de Usuario y diseño (2 + 2 pts)

### PROMPT 1 — Historias de Usuario

```
Crea el archivo docs/historias-de-usuario.md con las Historias de Usuario del Caso Banco Arboleda.

Requisitos:
- Formato estándar: "Como [rol], quiero [acción], para [beneficio]".
- Incluye Criterios de Aceptación por cada historia (formato Dado/Cuando/Entonces).
- Cubre: inicio de sesión, ver pantalla principal con las 3 opciones, y las 3 funcionalidades (Recarga celular detallada en sus 5 pasos, Pago de Servicio, Transferencia entre mis cuentas).
- La historia de "Recarga celular" debe reflejar los 5 pasos del enunciado y validar la clave online.
- Agrega una tabla resumen al inicio (ID, Historia, Prioridad).
- Redacción clara y profesional, en español.
```

**Verifica:** que aparezcan las historias de login + principal + las 3 features, con criterios de aceptación. Commit.

### PROMPT 2 — Diseño de interfaz (prototipo)

```
Crea prototipos (wireframes) de baja/media fidelidad de las pantallas, como archivos HTML estáticos autocontenidos dentro de docs/prototipos/ (un .html por pantalla, con CSS embebido, sin frameworks). Son solo para mostrar el diseño, no la app real.

Pantallas:
1. login.html — inicio de sesión (usuario/email + contraseña).
2. principal.html — pantalla "principal" con las 3 opciones como tarjetas: Recarga celular, Pago de Servicio, Transferencia entre mis cuentas.
3. recarga.html — flujo de recarga mostrando los 5 pasos (número de celular, selección de operador, monto, clave online, y el mensaje de éxito).
4. pago-servicio.html y transferencia.html — pantallas equivalentes para las otras dos opciones.

Usa una estética sobria de banca (colores corporativos, encabezado con el nombre "Banco Arboleda"). Al final, crea docs/diseno-interfaz.md explicando brevemente cada pantalla y enlazando a su archivo .html.
```

**Verifica:** abre los `.html` en el navegador; deben verse las 5 pantallas. Commit.

---

# FASE 2 — Base de datos (Supabase)

> Antes de este prompt: crea tu proyecto en https://supabase.com (gratis), y ten a mano la **Project URL** y la **service_role key** (Settings → API).

### PROMPT 3 — Esquema y datos semilla

```
Crea el modelo de base de datos para Supabase (Postgres). Genera dos archivos en backend/db/:
- schema.sql: creación de tablas.
- seed.sql: datos de prueba.

Tablas (usa snake_case, claves foráneas, timestamps con default now()):
- usuarios(id uuid pk default, nombre, email único, password_hash, clave_online_hash, created_at)
- cuentas(id uuid pk, usuario_id fk, numero_cuenta único, alias, saldo numeric(12,2) default 0, moneda default 'PEN', created_at)
- operadores(id pk, nombre único, activo bool default true)
- servicios(id pk, nombre, categoria, activo bool default true)
- recargas(id uuid pk, usuario_id fk, cuenta_id fk, numero_celular, operador_id fk, monto numeric(10,2), estado default 'EXITOSA', created_at)
- pagos_servicio(id uuid pk, usuario_id fk, cuenta_id fk, servicio_id fk, codigo_referencia, monto numeric(10,2), estado default 'EXITOSA', created_at)
- transferencias(id uuid pk, usuario_id fk, cuenta_origen_id fk, cuenta_destino_id fk, monto numeric(10,2), estado default 'EXITOSA', created_at)

seed.sql:
- 1 usuario demo: nombre "Cliente Demo", email "cliente@arboleda.com". Para password y clave_online, NO pongas el hash a mano: en su lugar crea un script backend/db/seed-passwords.js (Node) que use bcrypt para generar los hashes de password "Arboleda123" y clave online "123456", e imprima/inserte los valores. Documenta estas credenciales demo en un comentario.
- 2 cuentas para ese usuario (una de ahorros y una corriente) con saldos de ejemplo (p.ej. 1500.00 y 3200.00).
- operadores: Claro, Movistar, Entel, Bitel.
- servicios: al menos 4 (p.ej. "Luz del Sur" categoría Energía, "Sedapal" categoría Agua, "Movistar Hogar" categoría Internet, "Universidad UNI" categoría Educación).

Importante: dame al final las instrucciones exactas de qué SQL pegar en el SQL Editor de Supabase. Esta carga de datos es una preparación que hago YO una sola vez como desarrollador; el profesor no la ejecutará (él solo correrá la app).
```

**Verifica:** pega el SQL en el **SQL Editor** de Supabase y confirma que se crean las tablas y los datos. Asegúrate de que el usuario demo quede con sus hashes. Commit.

---

# FASE 3 — Backend (6 pts)

### PROMPT 4 — Scaffold del backend (arquitectura en capas)

```
Crea el backend en la carpeta "backend": Node.js + Express con arquitectura en capas para bajo costo de cambio.

Estructura:
backend/
  src/
    config/        (carga de variables de entorno y cliente de Supabase)
    routes/        (define rutas, las agrupa en /api)
    controllers/   (reciben req/res, llaman a services)
    services/      (lógica de negocio)
    repositories/  (único lugar que habla con Supabase)
    middlewares/   (manejo de errores, validación, auth)
    utils/
    app.js         (configura express, cors, json, rutas, error handler)
    server.js      (arranca el servidor en el puerto del .env)
  .env             (commiteado a propósito)
  .env.example
  package.json

Requisitos:
- Express, cors, dotenv, @supabase/supabase-js, bcrypt, jsonwebtoken, y un validador (zod o express-validator).
- config/supabase.js crea el cliente con SUPABASE_URL y SUPABASE_SERVICE_KEY del .env. Los repositories usan este cliente.
- CORS habilitado para http://localhost:5173.
- Middleware central de manejo de errores que responde JSON uniforme: { error: { message, code } }.
- Endpoint de salud GET /api/health que devuelva { status: "ok" }.
- En package.json: script "dev" con nodemon y "start" con node. La app debe arrancar con SOLO "npm install" y "npm run dev", sin pasos extra.
- .env con: PORT=4000, SUPABASE_URL=, SUPABASE_SERVICE_KEY=, JWT_SECRET=. Deja SUPABASE_URL y SUPABASE_SERVICE_KEY con un placeholder y dime exactamente dónde pegar mis valores reales de Supabase. .env.example con las mismas claves vacías.

Al terminar, dime cómo probar GET /api/health.
```

**Verifica:** pega tus credenciales reales de Supabase en `backend/.env`. Corre `npm install && npm run dev` y abre `http://localhost:4000/api/health`. Commit.

### PROMPT 5 — Autenticación (login)

```
Implementa la autenticación en el backend.

- POST /api/auth/login: recibe { email, password }. Valida la entrada. Busca el usuario por email (repository), compara password con bcrypt contra password_hash. Si es válido, devuelve un JWT (firmado con JWT_SECRET, expira en 1h) y datos básicos del usuario (id, nombre, email). Si no, error 401 con mensaje uniforme.
- Middleware "auth": valida el header Authorization: Bearer <token>, adjunta req.usuario. Protegerá las rutas de operaciones.
- GET /api/auth/me (protegido): devuelve el usuario actual.
- Endpoint para verificar la clave online lo dejaremos dentro de cada operación (no como login).

Respeta la arquitectura en capas (route → controller → service → repository). No rompas el manejo de errores uniforme.
```

**Verifica:** prueba el login con `cliente@arboleda.com` / `Arboleda123` (con curl, Postman o Thunder Client) y confirma que devuelve token. Commit.

### PROMPT 6 — Recarga celular (backend completo)

```
Implementa la funcionalidad "Recarga celular" en el backend, respetando los 5 pasos del enunciado y la arquitectura en capas. Todas las rutas van protegidas por el middleware auth.

Endpoints:
- GET /api/operadores: lista operadores activos (para el paso 2).
- GET /api/cuentas: lista las cuentas del usuario autenticado (para descontar el monto).
- POST /api/recargas: recibe { numero_celular, operador_id, monto, clave_online, cuenta_id }.
  Lógica en el service:
   1. Validar entrada (número de 9 dígitos, monto > 0, operador y cuenta existentes y del usuario).
   2. Verificar la clave_online con bcrypt contra clave_online_hash del usuario; si no coincide, error 401 "Clave online incorrecta".
   3. Verificar saldo suficiente en la cuenta; si no, error 422.
   4. Descontar el monto de la cuenta y registrar la recarga (estado 'EXITOSA') — idealmente de forma atómica (usa una función RPC de Postgres o haz las dos escrituras y maneja el error).
   5. Responder { mensaje: "Recarga realizada con éxito.", recarga: {...} } para que el frontend muestre el paso 5.

Devuelve mensajes de error claros y uniformes para cada caso.
```

**Verifica:** prueba el flujo con token: GET operadores, GET cuentas, POST recarga con clave `123456`. Prueba también clave mala y saldo insuficiente. Commit.

### PROMPT 7 — Pago de Servicio y Transferencia (backend)

```
Implementa las otras dos operaciones en el backend, mismo patrón y misma rigurosidad que la recarga (rutas protegidas, validación, clave online, descuento de saldo atómico, respuesta uniforme):

Pago de Servicio:
- GET /api/servicios: lista servicios activos.
- POST /api/pagos-servicio: { servicio_id, codigo_referencia, monto, clave_online, cuenta_id }. Verifica clave online, valida saldo, descuenta, registra en pagos_servicio. Responde "Pago realizado con éxito.".

Transferencia entre mis cuentas:
- POST /api/transferencias: { cuenta_origen_id, cuenta_destino_id, monto, clave_online }. Verifica que ambas cuentas sean del usuario y distintas, clave online, saldo suficiente; descuenta de origen y abona a destino de forma atómica; registra en transferencias. Responde "Transferencia realizada con éxito.".

Mantén la arquitectura en capas y reutiliza un helper común para verificar clave online y para mover saldo, para no duplicar lógica (menor costo de cambio).
```

**Verifica:** prueba ambos endpoints. Confirma que el saldo se mueve correctamente. Commit. Aquí el **backend queda completo**.

---

# FASE 4 — Frontend (6 pts)

### PROMPT 8 — Scaffold del frontend

```
Crea el frontend en la carpeta "frontend": React + Vite (JavaScript).

Estructura:
frontend/
  src/
    api/           (cliente HTTP que apunta a VITE_API_URL; un módulo por recurso: auth, cuentas, operadores, recargas, etc.)
    context/       (AuthContext: guarda token y usuario, login/logout)
    components/    (componentes reutilizables: Layout, Header, Card, Button, Input, StepIndicator, Alert)
    pages/         (Login, Principal, Recarga, PagoServicio, Transferencia)
    routes/        (router con rutas protegidas)
    styles/
    App.jsx
    main.jsx
  .env             (commiteado: VITE_API_URL=http://localhost:4000/api)
  .env.example
  package.json

Requisitos:
- react-router-dom para navegación.
- El cliente HTTP (fetch o axios) lee la URL de import.meta.env.VITE_API_URL y agrega el header Authorization con el token cuando exista.
- Estética de banca coherente con los prototipos de docs/prototipos (header "Banco Arboleda", colores sobrios). Mantén el CSS simple y consistente.
- La app debe arrancar con SOLO "npm install" y "npm run dev" (Vite, puerto 5173). Sin pasos extra.
- Crea por ahora páginas placeholder y deja el routing funcionando.

Al terminar dime cómo correrlo.
```

**Verifica:** `npm install && npm run dev`, abre `http://localhost:5173`, navega entre placeholders. Commit.

### PROMPT 9 — Login y rutas protegidas

```
Implementa el inicio de sesión en el frontend.

- Página Login: formulario email + contraseña, llama a POST /api/auth/login vía el módulo api/auth. Al éxito, guarda token+usuario en AuthContext y redirige a /principal. Muestra errores del backend de forma clara.
- AuthContext: persiste el token en memoria de la sesión (estado de React; no uses localStorage si no es necesario, pero si lo usas que sea solo el token). Provee login(), logout(), y el usuario actual.
- Rutas protegidas: si no hay sesión, redirige a /login. El Header muestra el nombre del usuario y un botón "Cerrar sesión".
- En la pantalla de login muestra una nota discreta con las credenciales demo (cliente@arboleda.com / Arboleda123) para que el profesor pueda entrar sin buscarlas.
```

**Verifica:** inicia sesión con las credenciales demo; debe llevarte a /principal. Commit.

### PROMPT 10 — Pantalla principal

```
Implementa la página "Principal" (/principal): muestra un saludo al usuario y las 3 opciones como tarjetas grandes y claras: "Recarga celular", "Pago de Servicio" y "Transferencia entre mis cuentas", cada una navegando a su ruta (/recarga, /pago-servicio, /transferencia). Diseño limpio y coherente con la estética del banco. Muestra también un resumen de las cuentas del usuario (GET /api/cuentas) con su saldo.
```

**Verifica:** la principal muestra las 3 opciones y los saldos. Commit.

### PROMPT 11 — Flujo Recarga celular (los 5 pasos)

```
Implementa la página "Recarga celular" (/recarga) como un asistente de pasos que refleje EXACTAMENTE el enunciado, con un indicador de progreso:

Paso 1: input para el número de celular (validación 9 dígitos).
Paso 2: selección de operador (carga GET /api/operadores; muéstralos como opciones/botones).
Paso 3: selección/digitación del monto (ofrece montos rápidos: 10, 20, 30, 50 y un campo libre) y selección de la cuenta de cargo (GET /api/cuentas).
Paso 4: input de clave online para confirmar (tipo password).
Paso 5: al confirmar, llama POST /api/recargas; si responde éxito, muestra una pantalla con el mensaje "Recarga realizada con éxito." y un botón "Volver al inicio".

Maneja y muestra los errores del backend (clave incorrecta, saldo insuficiente, validaciones) en el paso correspondiente. Permite retroceder entre pasos. Reutiliza componentes (StepIndicator, Input, Button, Alert).
```

**Verifica:** completa una recarga real de inicio a fin; debe mostrar el mensaje de éxito y descontar saldo. Prueba clave mala. Commit.

### PROMPT 12 — Pago de Servicio y Transferencia (frontend)

```
Implementa las páginas de las otras dos opciones, con el mismo estilo de asistente por pasos y reutilizando componentes:

/pago-servicio: seleccionar servicio (GET /api/servicios), ingresar código de referencia y monto, elegir cuenta de cargo, ingresar clave online, confirmar (POST /api/pagos-servicio) y mostrar "Pago realizado con éxito.".

/transferencia: seleccionar cuenta origen y cuenta destino (GET /api/cuentas, deben ser distintas), ingresar monto, clave online, confirmar (POST /api/transferencias) y mostrar "Transferencia realizada con éxito.".

Maneja errores del backend de forma clara en cada caso.
```

**Verifica:** prueba ambos flujos completos. Commit. Aquí el **frontend queda completo**.

---

# FASE 5 — Integración, calidad y entrega (4 pts)

### PROMPT 13 — Revisión integral y README de entrega

```
Revisión final de todo el proyecto para la entrega. Objetivos: que corra sin errores y con el MENOR número de comandos posible (esto se califica).

1. Levanta backend y frontend y verifica el flujo end-to-end: login → principal → recarga → pago de servicio → transferencia. Corrige cualquier error de CORS, rutas, env o consola que aparezca.
2. Revisa que el frontend NUNCA llame a Supabase directo: solo a la API del backend. Confirma que las llaves de Supabase están solo en backend/.env.
3. Revisa consistencia: manejo de errores uniforme, validaciones presentes, nada de código muerto ni credenciales sueltas fuera del .env.
4. Verifica que ambos arranquen SOLO con "npm install" + "npm run dev", sin ningún paso manual adicional. Si algo requiere un paso extra, elimínalo o automatízalo.
5. Reescribe el README.md raíz con:
   - Descripción del caso y del stack.
   - Sección "Cómo ejecutar" con los comandos EXACTOS y en orden, separados para Backend y Frontend (copiables tal cual).
   - Credenciales demo (email, password, clave online).
   - Puertos (backend 4000, frontend 5173) y URLs.
   - Una nota: la base de datos es Supabase en la nube y el .env ya viene configurado, por lo que no se requiere ningún paso adicional de base de datos.
   - Breve sección de arquitectura (frontend → API → Supabase, capas del backend) que evidencie el bajo costo de cambio.

Dame al final el contenido textual de la sección "Cómo ejecutar" para revisarla.
```

**Verifica:** sigue el README **al pie de la letra desde cero** (cierra todo, vuelve a correr los comandos exactos) para confirmar que un tercero (el profesor) lo logra sin pasos extra. Commit final.

### PROMPT 14 (opcional) — Pulido

```
Pulido final opcional: agrega estados de carga (spinners) en las llamadas, deshabilita botones mientras se envía, mensajes de error amigables, y revisa responsividad básica en móvil. No cambies la arquitectura ni agregues pasos de ejecución.
```

---

## 4. Checklist de entrega

- [ ] `docs/historias-de-usuario.md` (2 pts)
- [ ] `docs/prototipos/*.html` + `docs/diseno-interfaz.md` (2 pts)
- [ ] Backend completo: auth + recarga + pago + transferencia (6 pts)
- [ ] Frontend completo: login + principal + 3 flujos (6 pts)
- [ ] Corre con `npm install` + `npm run dev` por carpeta, **sin pasos extra** (4 pts)
- [ ] README con comandos exactos y credenciales demo
- [ ] Probado desde cero siguiendo solo el README
- [ ] `.env` configurados y commiteados (recuerda borrar/rotar el proyecto Supabase tras la nota)

---

## 5. Riesgos a vigilar

- **CORS:** el backend debe permitir `http://localhost:5173`. Es el error más común al integrar.
- **Puertos ocupados:** si 4000 o 5173 están en uso, fija los puertos en los `.env`/config y documéntalo.
- **Atomicidad del saldo:** descontar saldo y registrar la operación deben ir juntos; si una falla, no debe quedar inconsistente. Usa una función RPC en Postgres si quieres hacerlo prolijo.
- **Llaves de Supabase:** que la *service key* viva solo en `backend/.env`, jamás en el frontend.
- **"Pasos extra" ocultos:** evita cosas como migraciones manuales, `supabase start`, o variables que el profesor tenga que rellenar. Todo debe venir listo.
