# Historias de Usuario - Caso Banco Arboleda

## Resumen

| ID | Historia | Prioridad |
|---|---|---|
| HU-01 | Como cliente, quiero iniciar sesión en la aplicación, para acceder a mis operaciones bancarias. | Alta |
| HU-02 | Como cliente autenticado, quiero ver una pantalla principal con las opciones disponibles, para elegir rápidamente la operación que necesito. | Alta |
| HU-03 | Como cliente, quiero realizar una recarga celular, para enviar saldo a un número móvil desde mi cuenta. | Alta |
| HU-04 | Como cliente, quiero pagar un servicio, para cumplir con mis obligaciones de pago desde la plataforma. | Media |
| HU-05 | Como cliente, quiero transferir dinero entre mis cuentas, para mover fondos de forma segura y controlada. | Media |

## Historias de Usuario

### HU-01 - Inicio de sesión
**Historia:** Como cliente, quiero iniciar sesión en la aplicación, para acceder a mis operaciones bancarias.

**Criterios de aceptación:**
- **Dado** que el cliente se encuentra en la pantalla de acceso, **cuando** ingresa sus credenciales válidas y confirma el inicio de sesión, **entonces** el sistema autentica al usuario y le permite continuar a la pantalla principal.
- **Dado** que el cliente ingresa credenciales incorrectas, **cuando** intenta iniciar sesión, **entonces** el sistema muestra un mensaje de error y no permite el acceso.
- **Dado** que el cliente no completa los campos obligatorios, **cuando** intenta autenticarse, **entonces** el sistema valida la información e indica los datos faltantes.

### HU-02 - Pantalla principal con opciones
**Historia:** Como cliente autenticado, quiero ver una pantalla principal con las opciones disponibles, para elegir rápidamente la operación que necesito.

**Criterios de aceptación:**
- **Dado** que el cliente inició sesión correctamente, **cuando** el sistema carga la pantalla principal, **entonces** se muestran las tres opciones: Recarga celular, Pago de Servicio y Transferencia entre mis cuentas.
- **Dado** que el cliente está en la pantalla principal, **cuando** visualiza las opciones, **entonces** cada una aparece como una acción clara y diferenciada.
- **Dado** que el cliente aún no se ha autenticado, **cuando** intenta acceder a la pantalla principal, **entonces** el sistema no le permite ver las opciones operativas.

### HU-03 - Recarga celular
**Historia:** Como cliente, quiero realizar una recarga celular, para enviar saldo a un número móvil desde mi cuenta.

**Criterios de aceptación:**
- **Dado** que el cliente selecciona la opción Recarga celular, **cuando** se abre el flujo de operación, **entonces** el sistema solicita el número de celular como primer paso.
- **Dado** que el cliente ingresó un número de celular válido, **cuando** continúa el proceso, **entonces** el sistema permite seleccionar el operador móvil.
- **Dado** que el cliente seleccionó el operador, **cuando** avanza en el flujo, **entonces** el sistema permite seleccionar o digitar el monto de la recarga.
- **Dado** que el cliente definió el número, el operador y el monto, **cuando** llega al paso de confirmación, **entonces** el sistema solicita la clave online para autorizar la transacción.
- **Dado** que el cliente ingresa la clave online correcta y confirma la operación, **cuando** el sistema procesa la solicitud, **entonces** muestra el mensaje "Recarga realizada con éxito.".
- **Dado** que el cliente ingresa una clave online incorrecta, **cuando** intenta confirmar la recarga, **entonces** el sistema rechaza la operación y muestra un mensaje de validación.
- **Dado** que el cliente omite alguno de los cinco pasos requeridos, **cuando** intenta continuar, **entonces** el sistema impide completar la recarga hasta corregir la información.

### HU-04 - Pago de Servicio
**Historia:** Como cliente, quiero pagar un servicio, para cumplir con mis obligaciones de pago desde la plataforma.

**Criterios de aceptación:**
- **Dado** que el cliente selecciona la opción Pago de Servicio, **cuando** ingresa al flujo de pago, **entonces** el sistema permite identificar el servicio que desea cancelar.
- **Dado** que el cliente completa los datos requeridos del servicio, **cuando** confirma la operación, **entonces** el sistema valida la información antes de procesarla.
- **Dado** que el cliente autoriza el pago con los datos correctos, **cuando** el sistema finaliza la transacción, **entonces** confirma la operación exitosa.
- **Dado** que la información del pago es inválida o incompleta, **cuando** intenta confirmar, **entonces** el sistema muestra un error y no procesa el pago.

### HU-05 - Transferencia entre mis cuentas
**Historia:** Como cliente, quiero transferir dinero entre mis cuentas, para mover fondos de forma segura y controlada.

**Criterios de aceptación:**
- **Dado** que el cliente selecciona la opción Transferencia entre mis cuentas, **cuando** inicia el flujo, **entonces** el sistema permite elegir la cuenta de origen y la cuenta destino.
- **Dado** que el cliente ingresa el monto de la transferencia, **cuando** continúa con la operación, **entonces** el sistema valida que exista formato y valor permitido.
- **Dado** que el cliente confirma la transferencia con los datos correctos, **cuando** el sistema procesa la solicitud, **entonces** registra el movimiento como exitoso.
- **Dado** que el cliente selecciona cuentas inválidas o datos incompletos, **cuando** intenta confirmar, **entonces** el sistema impide continuar y muestra el error correspondiente.
