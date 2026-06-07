# Banco Arboleda — Práctica PC2

Aplicación web bancaria que implementa tres operaciones: **Recarga celular**, **Pago de Servicio** y **Transferencia entre cuentas**.

---

## Cómo ejecutar

> La base de datos es Supabase (PostgreSQL en la nube) y el `.env` ya viene configurado en el repositorio. **No se requiere ningún paso adicional de base de datos.**

### Terminal 1 — Backend

```bash
cd backend
npm install
npm run dev
```

API disponible en **http://localhost:4000**

### Terminal 2 — Frontend

```bash
cd frontend
npm install
npm run dev
```

App disponible en **http://localhost:5173**

---

## Credenciales demo

| Campo | Valor |
|---|---|
| Email | `cliente@arboleda.com` |
| Contraseña | `Arboleda123` |
| Clave online | `123456` |

> Las credenciales demo también aparecen en la pantalla de login para facilitar la revisión.

---

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + Vite 5 + React Router v6 |
| Backend | Node.js + Express 5 |
| Base de datos | Supabase (PostgreSQL gestionado en la nube) |
| Autenticación | JWT (`jsonwebtoken`) + bcrypt |
| Validación | Zod (backend) |

---

## Arquitectura

```
Navegador (React)
      │  HTTP / JSON  (VITE_API_URL = http://localhost:4000/api)
      ▼
Backend (Express)  ←── único punto de acceso a Supabase
      │  @supabase/supabase-js  (service key solo en backend/.env)
      ▼
Supabase / PostgreSQL (nube)
```

### Capas del backend (bajo costo de cambio)

```
routes/        → define los endpoints y aplica middlewares
controllers/   → recibe req/res, delega a services
services/      → lógica de negocio (validación, bcrypt, saldo)
repositories/  → único lugar que habla con Supabase
middlewares/   → auth (JWT), validate (Zod), errorHandler
utils/         → AppError, authHelpers, saldoHelpers
```

Cambiar la base de datos solo afecta a `repositories/`; cambiar reglas de negocio solo afecta a `services/`. El frontend no conoce la existencia de Supabase.

---

## Funcionalidades implementadas

| Funcionalidad | Ruta frontend | Endpoint backend |
|---|---|---|
| Inicio de sesión | `/login` | `POST /api/auth/login` |
| Pantalla principal | `/principal` | `GET /api/cuentas` |
| Recarga celular (5 pasos) | `/recarga` | `GET /api/operadores` · `POST /api/recargas` |
| Pago de Servicio (4 pasos) | `/pago-servicio` | `GET /api/servicios` · `POST /api/pagos-servicio` |
| Transferencia (4 pasos) | `/transferencia` | `POST /api/transferencias` |
