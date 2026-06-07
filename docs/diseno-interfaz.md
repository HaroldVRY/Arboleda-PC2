# Diseño de Interfaz - Banco Arboleda

Este documento resume los prototipos estáticos de baja/media fidelidad creados para presentar la interfaz del Caso Banco Arboleda. Todos los archivos están dentro de `docs/prototipos/` y son HTML autocontenidos, sin frameworks y sin lógica de aplicación.

## Pantallas

### 1. Login
Representa el acceso inicial del cliente con campos para usuario/correo y contraseña. Mantiene una composición sobria con el nombre del banco visible en el encabezado.

Archivo: [docs/prototipos/login.html](prototipos/login.html)

### 2. Pantalla principal
Muestra la vista posterior al inicio de sesión con las tres opciones de negocio en formato de tarjetas: Recarga celular, Pago de Servicio y Transferencia entre mis cuentas.

Archivo: [docs/prototipos/principal.html](prototipos/principal.html)

### 3. Recarga celular
Presenta el flujo completo de cinco pasos solicitado en el enunciado: número de celular, operador, monto, clave online y mensaje final de éxito.

Archivo: [docs/prototipos/recarga.html](prototipos/recarga.html)

### 4. Pago de Servicio
Plantea una pantalla de captura y confirmación de datos para el pago de un servicio, conservando la estética bancaria del conjunto.

Archivo: [docs/prototipos/pago-servicio.html](prototipos/pago-servicio.html)

### 5. Transferencia entre mis cuentas
Modela la transferencia entre cuentas propias con campos de origen, destino, monto y confirmación visual de la operación.

Archivo: [docs/prototipos/transferencia.html](prototipos/transferencia.html)

## Observación
Los prototipos son únicamente referenciales. Su objetivo es mostrar estructura visual y orden de la experiencia, no comportamiento funcional real.
