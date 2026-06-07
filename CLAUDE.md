# Caso Banco Arboleda

## Contexto del proyecto
Aplicación web bancaria para una práctica universitaria por fases. En esta primera entrega solo se prepara la estructura y la documentación base; no se escribe código de la app todavía.

## Flujo funcional de referencia
Tras login, la app muestra una pantalla principal con tres opciones:
- Recarga celular
- Pago de Servicio
- Transferencia entre mis cuentas

Flujo detallado de "Recarga celular":
1. Digitar número de celular.
2. Seleccionar operador.
3. Seleccionar o digitar monto.
4. Ingresar clave online para confirmar.
5. Mostrar el mensaje "Recarga realizada con éxito.".

## Stack obligatorio
- Backend: Node.js + Express en la carpeta `backend`.
- Frontend: React + Vite en la carpeta `frontend`.
- Base de datos: Supabase con PostgreSQL en la nube.

## Arquitectura obligatoria
- El frontend habla solo con la API del backend.
- El backend es el único que habla con Supabase.
- Las llaves de Supabase nunca van en el frontend.
- El backend debe usar arquitectura en capas para bajo costo de cambio:
  - routes
  - controllers
  - services
  - repositories
- La validación de entrada debe existir.
- El manejo de errores debe estar centralizado en un middleware.

## Reglas de ejecución exigidas por el profesor
- Backend: `npm install` + `npm run dev`.
- Frontend: `npm install` + `npm run dev`.
- No debe haber pasos manuales adicionales para arrancar cada parte.
- El archivo `.env` irá commiteado a propósito para esta entrega.

## Criterios de calificación a respetar
- Separación clara entre frontend y backend.
- Backend como única capa de acceso a Supabase.
- Estructura mantenible y fácil de cambiar.
- Comandos mínimos y exactos para ejecutar el proyecto.
- Entrega ordenada con documentación base desde el inicio.

## Alcance de esta fase
- Solo estructura de carpetas.
- Solo documentación base.
- Sin implementación funcional todavía.
