# Casos de Uso - Sistema de Préstamo de Dispositivos ESPE

## Índice de Casos de Uso

1. [CU-01: Iniciar sesión en el sistema](#cu-01-iniciar-sesión-en-el-sistema)
2. [CU-02: Solicitar préstamo de dispositivo (Estudiante)](#cu-02-solicitar-préstamo-de-dispositivo-estudiante)
3. [CU-03: Solicitar préstamo de dispositivo (Docente)](#cu-03-solicitar-préstamo-de-dispositivo-docente)
4. [CU-04: Solicitar préstamo de dispositivo (Administrativo)](#cu-04-solicitar-préstamo-de-dispositivo-administrativo)
5. [CU-05: Entregar dispositivo](#cu-05-entregar-dispositivo)
6. [CU-06: Devolver dispositivo](#cu-06-devolver-dispositivo)
7. [CU-07: Consultar catálogo de dispositivos](#cu-07-consultar-catálogo-de-dispositivos)
8. [CU-08: Gestionar inventario de dispositivos](#cu-08-gestionar-inventario-de-dispositivos)
9. [CU-09: Registrar dispositivo dañado](#cu-09-registrar-dispositivo-dañado)
10. [CU-10: Realizar revisión técnica en devolución](#cu-10-realizar-revisión-técnica-en-devolución)
11. [CU-11: Cancelar solicitud de préstamo](#cu-11-cancelar-solicitud-de-préstamo)
12. [CU-12: Generar reportes](#cu-12-generar-reportes)

---

## CU-01: Iniciar sesión en el sistema

**ID:** CU-01  
**Nombre:** Iniciar sesión en el sistema  
**Actor Principal:** Usuario (Estudiante, Docente, Administrativo, Técnico)  
**Requisito Relacionado:** RF-01  
**Prioridad:** Alta

### Descripción
Permite a los usuarios autenticarse en el sistema utilizando sus credenciales institucionales de la ESPE integradas con Banner.

### Precondiciones
- El usuario debe tener una cuenta institucional activa (@espe.edu.ec)
- El sistema Banner debe estar disponible

### Flujo Principal
1. El usuario accede a la página de inicio del sistema
2. El sistema muestra el formulario de autenticación institucional
3. El usuario ingresa sus credenciales institucionales (@espe.edu.ec)
4. El sistema valida las credenciales con Banner
5. Banner confirma la autenticidad de las credenciales
6. El sistema identifica el rol del usuario (Estudiante, Docente, Administrativo, Técnico)
7. El sistema redirige al dashboard correspondiente según el rol

### Flujo Alternativo
**FA-01: Credenciales inválidas**
- 4a. Banner rechaza las credenciales
- 4b. El sistema muestra mensaje de error "Credenciales incorrectas"
- 4c. Retorna al paso 3

**FA-02: Cuenta no institucional**
- 3a. El usuario intenta ingresar con correo que no es @espe.edu.ec
- 3b. El sistema muestra mensaje "Debe usar su correo institucional @espe.edu.ec"
- 3c. Retorna al paso 3

**FA-03: Banner no disponible**
- 4a. El sistema no puede conectar con Banner
- 4b. El sistema muestra mensaje "Servicio de autenticación temporalmente no disponible"
- 4c. Fin del caso de uso

### Postcondiciones
- El usuario accede exitosamente al sistema con sesión activa
- El sistema registra la hora de inicio de sesión

---

## CU-02: Solicitar préstamo de dispositivo (Estudiante)

**ID:** CU-02  
**Nombre:** Solicitar préstamo de dispositivo (Estudiante)  
**Actor Principal:** Estudiante  
**Requisitos Relacionados:** RF-02, RF-09, RF-10, RF-11  
**Prioridad:** Alta

### Descripción
Permite a los estudiantes solicitar el préstamo de un dispositivo únicamente dentro de su franja horaria de clase cargada desde Banner.

### Precondiciones
- El estudiante ha iniciado sesión en el sistema
- El horario de clases del estudiante está sincronizado desde Banner
- Existen dispositivos disponibles del tipo solicitado

### Flujo Principal
1. El estudiante accede a la opción "Solicitar préstamo"
2. El sistema verifica la franja horaria actual del estudiante desde Banner
3. El sistema confirma que el estudiante tiene clase en este momento
4. El sistema muestra los tipos de dispositivos disponibles
5. El estudiante selecciona el tipo de dispositivo que necesita
6. El sistema verifica la disponibilidad de dispositivos del tipo seleccionado (RF-09)
7. El sistema asigna automáticamente un dispositivo disponible (RF-10)
8. El sistema genera un código único de préstamo (RF-11)
9. El sistema muestra el código de préstamo y los detalles (dispositivo asignado, tiempo límite de retiro)
10. El sistema cambia el estado del dispositivo a "Reservado"
11. El sistema inicia temporizador de 20 minutos para retiro

### Flujo Alternativo
**FA-01: Fuera de franja horaria**
- 3a. El estudiante no tiene clase en el horario actual
- 3b. El sistema muestra mensaje "Solo puede solicitar dispositivos durante su franja horaria de clase"
- 3c. Fin del caso de uso

**FA-02: Sin dispositivos disponibles**
- 6a. No hay dispositivos disponibles del tipo solicitado
- 6b. El sistema muestra mensaje "No hay dispositivos disponibles en este momento"
- 6c. Fin del caso de uso

**FA-03: No se retira en 20 minutos**
- Referirse a proceso automático de liberación (RF-15)

### Postcondiciones
- La solicitud de préstamo queda registrada con estado "Reservado"
- El dispositivo queda asignado al estudiante por 20 minutos
- Se genera un código único para el retiro del dispositivo

---

## CU-03: Solicitar préstamo de dispositivo (Docente)

**ID:** CU-03  
**Nombre:** Solicitar préstamo de dispositivo (Docente)  
**Actor Principal:** Docente  
**Requisitos Relacionados:** RF-03, RF-09, RF-10, RF-11  
**Prioridad:** Alta

### Descripción
Permite a los docentes solicitar el préstamo de dispositivos dentro o fuera de su franja horaria, requiriendo observación obligatoria cuando es fuera de horario.

### Precondiciones
- El docente ha iniciado sesión en el sistema
- El horario del docente está sincronizado desde Banner
- Existen dispositivos disponibles del tipo solicitado

### Flujo Principal
1. El docente accede a la opción "Solicitar préstamo"
2. El sistema verifica la franja horaria actual del docente desde Banner
3. El sistema detecta que el docente está dentro de su horario de clase
4. El sistema muestra los tipos de dispositivos disponibles
5. El docente selecciona el tipo de dispositivo que necesita
6. El sistema verifica la disponibilidad de dispositivos del tipo seleccionado (RF-09)
7. El sistema asigna automáticamente un dispositivo disponible (RF-10)
8. El sistema genera un código único de préstamo (RF-11)
9. El sistema muestra el código de préstamo y los detalles
10. El sistema cambia el estado del dispositivo a "Reservado"
11. El sistema inicia temporizador de 20 minutos para retiro

### Flujo Alternativo
**FA-01: Solicitud fuera de franja horaria**
- 3a. El docente no tiene clase en el horario actual
- 3b. El sistema muestra formulario adicional requiriendo observación obligatoria
- 3c. El docente ingresa la justificación/observación del uso del dispositivo
- 3d. El sistema valida que la observación no esté vacía
- 3e. Continúa en paso 4

**FA-02: Observación vacía**
- 3d. El docente intenta continuar sin ingresar observación
- 3e. El sistema muestra mensaje "La observación es obligatoria para préstamos fuera de horario"
- 3f. Retorna al paso 3c

**FA-03: Sin dispositivos disponibles**
- 6a. No hay dispositivos disponibles del tipo solicitado
- 6b. El sistema muestra mensaje "No hay dispositivos disponibles en este momento"
- 6c. Fin del caso de uso

### Postcondiciones
- La solicitud de préstamo queda registrada con estado "Reservado"
- Si fue fuera de horario, la observación queda registrada
- El dispositivo queda asignado al docente por 20 minutos

---

## CU-04: Solicitar préstamo de dispositivo (Administrativo)

**ID:** CU-04  
**Nombre:** Solicitar préstamo de dispositivo (Administrativo)  
**Actor Principal:** Administrativo  
**Requisitos Relacionados:** RF-04, RF-09, RF-10, RF-11  
**Prioridad:** Media

### Descripción
Permite a los administrativos solicitar dispositivos indicando fecha, hora de uso y una observación que justifique el préstamo.

### Precondiciones
- El administrativo ha iniciado sesión en el sistema
- Existen dispositivos disponibles del tipo solicitado

### Flujo Principal
1. El administrativo accede a la opción "Solicitar préstamo"
2. El sistema muestra formulario de solicitud para administrativos
3. El administrativo selecciona el tipo de dispositivo
4. El administrativo ingresa la fecha y hora de uso planeado
5. El administrativo ingresa una observación justificando el uso
6. El sistema valida que todos los campos obligatorios estén completos
7. El sistema verifica la disponibilidad del dispositivo para la fecha/hora indicada (RF-09)
8. El sistema asigna automáticamente un dispositivo disponible (RF-10)
9. El sistema genera un código único de préstamo (RF-11)
10. El sistema muestra el código de préstamo y los detalles
11. El sistema cambia el estado del dispositivo a "Reservado"

### Flujo Alternativo
**FA-01: Campos incompletos**
- 6a. Falta fecha, hora o observación
- 6b. El sistema muestra mensaje "Todos los campos son obligatorios"
- 6c. Retorna al paso 3

**FA-02: Sin dispositivos disponibles**
- 7a. No hay dispositivos disponibles para la fecha/hora solicitada
- 7b. El sistema muestra mensaje "No hay dispositivos disponibles para el período solicitado"
- 7c. Fin del caso de uso

**FA-03: Fecha/hora en el pasado**
- 6a. La fecha/hora ingresada es anterior al momento actual
- 6b. El sistema muestra mensaje "La fecha y hora deben ser futuras"
- 6c. Retorna al paso 4

### Postcondiciones
- La solicitud de préstamo queda registrada con fecha, hora y observación
- El dispositivo queda reservado para el administrativo en la fecha/hora indicada

---

## CU-05: Entregar dispositivo

**ID:** CU-05  
**Nombre:** Entregar dispositivo  
**Actor Principal:** Técnico  
**Actor Secundario:** Usuario (Estudiante, Docente, Administrativo)  
**Requisitos Relacionados:** RF-05, RF-11  
**Prioridad:** Alta

### Descripción
Permite al técnico registrar la entrega física de un dispositivo al usuario que presenta un código de préstamo válido.

### Precondiciones
- El usuario tiene una solicitud aprobada con código único
- El técnico ha iniciado sesión en el sistema
- El dispositivo está en estado "Reservado"

### Flujo Principal
1. El usuario se presenta en el mostrador con su código de préstamo
2. El técnico accede a la opción "Entregar dispositivo"
3. El técnico ingresa o escanea el código de préstamo
4. El sistema valida el código y muestra los detalles de la solicitud
5. El sistema muestra: nombre del usuario, dispositivo asignado, tipo, serie
6. El técnico verifica la identidad del usuario
7. El técnico confirma la entrega del dispositivo
8. El sistema registra automáticamente la fecha y hora exacta de entrega
9. El sistema cambia el estado del préstamo a "En uso"
10. El sistema cambia el estado del dispositivo a "Prestado"
11. El sistema muestra confirmación de entrega exitosa

### Flujo Alternativo
**FA-01: Código inválido**
- 4a. El código ingresado no existe en el sistema
- 4b. El sistema muestra mensaje "Código de préstamo no válido"
- 4c. Retorna al paso 3

**FA-02: Código expirado**
- 4a. Han pasado más de 20 minutos desde la solicitud sin retiro
- 4b. El sistema muestra mensaje "El código ha expirado. Debe generar una nueva solicitud"
- 4c. Fin del caso de uso

**FA-03: Usuario no coincide**
- 6a. La identidad del usuario no coincide con la solicitud
- 6b. El técnico cancela la operación
- 6c. Fin del caso de uso

### Postcondiciones
- Queda registrada la fecha y hora exacta de entrega del dispositivo
- El dispositivo cambia a estado "Prestado"
- El préstamo queda activo en el sistema

---

## CU-06: Devolver dispositivo

**ID:** CU-06  
**Nombre:** Devolver dispositivo  
**Actor Principal:** Técnico  
**Actor Secundario:** Usuario (Estudiante, Docente, Administrativo)  
**Requisitos Relacionados:** RF-05, RF-14  
**Prioridad:** Alta

### Descripción
Permite al técnico registrar la devolución física de un dispositivo y realizar una revisión técnica de su estado.

### Precondiciones
- El dispositivo está en estado "Prestado"
- Existe un préstamo activo para el dispositivo
- El técnico ha iniciado sesión en el sistema

### Flujo Principal
1. El usuario se presenta en el mostrador para devolver el dispositivo
2. El técnico accede a la opción "Devolver dispositivo"
3. El técnico identifica el préstamo (por código o búsqueda)
4. El sistema muestra los detalles del préstamo activo
5. El técnico recibe físicamente el dispositivo
6. El técnico realiza inspección visual del dispositivo
7. El técnico selecciona "Estado: Correcto" (sin daños)
8. El técnico puede agregar observaciones opcionales sobre la devolución
9. El técnico confirma la devolución
10. El sistema registra automáticamente la fecha y hora exacta de devolución
11. El sistema cambia el estado del préstamo a "Finalizado"
12. El sistema cambia el estado del dispositivo a "Disponible"
13. El sistema muestra confirmación de devolución exitosa

### Flujo Alternativo
**FA-01: Dispositivo con daños**
- Referirse a CU-10: Realizar revisión técnica en devolución

**FA-02: Devolución con retraso**
- 10a. El sistema detecta que la hora de devolución supera el tiempo establecido
- 10b. El sistema marca el préstamo como "Finalizado con retraso"
- 10c. El sistema activa notificación automática de retraso (RF-07)
- 10d. Continúa en paso 11

**FA-03: Préstamo no encontrado**
- 3a. El código o búsqueda no arroja resultados
- 3b. El sistema muestra mensaje "No se encontró préstamo activo"
- 3c. Retorna al paso 2

### Postcondiciones
- Queda registrada la fecha y hora exacta de devolución
- El dispositivo cambia a estado "Disponible" (o "En mantenimiento" si hay daños)
- El préstamo se finaliza en el sistema
- Si hay retraso, se notifica al usuario correspondiente

---

## CU-07: Consultar catálogo de dispositivos

**ID:** CU-07  
**Nombre:** Consultar catálogo de dispositivos  
**Actor Principal:** Técnico  
**Requisitos Relacionados:** RF-06  
**Prioridad:** Media

### Descripción
Permite a los técnicos visualizar el catálogo completo de dispositivos con opciones de filtrado por tipo y estado.

### Precondiciones
- El técnico ha iniciado sesión en el sistema
- Existen dispositivos registrados en el inventario

### Flujo Principal
1. El técnico accede a la opción "Catálogo de dispositivos"
2. El sistema muestra todos los dispositivos registrados con sus detalles:
   - Código/Serie
   - Tipo de dispositivo
   - Marca/Modelo
   - Estado (Disponible, Prestado, En mantenimiento, Baja)
   - Última actualización
3. El técnico puede aplicar filtros por tipo de dispositivo
4. El técnico puede aplicar filtros por estado
5. El sistema actualiza la lista según los filtros aplicados
6. El técnico visualiza los dispositivos filtrados

### Flujo Alternativo
**FA-01: Sin dispositivos que cumplan los filtros**
- 5a. La combinación de filtros no arroja resultados
- 5b. El sistema muestra mensaje "No hay dispositivos que cumplan los criterios de búsqueda"
- 5c. El técnico puede modificar los filtros

**FA-02: Inventario vacío**
- 2a. No hay dispositivos registrados en el sistema
- 2b. El sistema muestra mensaje "No hay dispositivos registrados en el inventario"
- 2c. Fin del caso de uso

### Postcondiciones
- El técnico visualiza la información actualizada del inventario

---

## CU-08: Gestionar inventario de dispositivos

**ID:** CU-08  
**Nombre:** Gestionar inventario de dispositivos  
**Actor Principal:** Técnico  
**Requisitos Relacionados:** RF-12  
**Prioridad:** Alta

### Descripción
Permite a los técnicos dar de alta nuevos dispositivos, realizar bajas lógicas y modificar el estado de dispositivos existentes.

### Precondiciones
- El técnico ha iniciado sesión en el sistema
- El técnico tiene permisos de gestión de inventario

### Flujo Principal - Alta de dispositivo
1. El técnico accede a la opción "Gestionar inventario"
2. El técnico selecciona "Agregar nuevo dispositivo"
3. El técnico ingresa los datos del dispositivo:
   - Tipo de dispositivo
   - Marca
   - Modelo
   - Número de serie
   - Estado inicial (Disponible)
   - Observaciones
4. El técnico confirma el registro
5. El sistema valida que todos los campos obligatorios estén completos
6. El sistema verifica que el número de serie no esté duplicado
7. El sistema registra el nuevo dispositivo con estado "Disponible"
8. El sistema muestra confirmación de alta exitosa

### Flujo Alternativo - Modificar estado de dispositivo
1. El técnico accede a la opción "Gestionar inventario"
2. El técnico busca y selecciona un dispositivo existente
3. El sistema muestra los detalles actuales del dispositivo
4. El técnico selecciona "Modificar estado"
5. El técnico selecciona el nuevo estado (Disponible, En mantenimiento, Baja)
6. Si selecciona "En mantenimiento" o "Baja", ingresa observación obligatoria
7. El técnico confirma la modificación
8. El sistema actualiza el estado del dispositivo
9. El sistema registra la fecha y hora del cambio de estado
10. El sistema muestra confirmación de actualización exitosa

### Flujo Alternativo - Baja lógica de dispositivo
1. El técnico accede a la opción "Gestionar inventario"
2. El técnico busca y selecciona un dispositivo existente
3. El sistema muestra los detalles actuales del dispositivo
4. El técnico selecciona "Dar de baja"
5. El sistema verifica que el dispositivo no esté en préstamo activo
6. El técnico ingresa la razón de la baja (obligatoria)
7. El técnico confirma la baja
8. El sistema cambia el estado del dispositivo a "Baja"
9. El dispositivo deja de aparecer en catálogo de disponibles
10. El sistema muestra confirmación de baja exitosa

### Flujos de Excepción
**FE-01: Campos obligatorios vacíos**
- 5a. Faltan campos obligatorios en el formulario
- 5b. El sistema muestra mensaje indicando los campos faltantes
- 5c. Retorna al paso 3

**FE-02: Número de serie duplicado**
- 6a. Ya existe un dispositivo con ese número de serie
- 6b. El sistema muestra mensaje "El número de serie ya está registrado"
- 6c. Retorna al paso 3

**FE-03: Dispositivo en préstamo activo**
- 5a. El dispositivo está actualmente prestado
- 5b. El sistema muestra mensaje "No se puede dar de baja un dispositivo en préstamo"
- 5c. Fin del caso de uso

**FE-04: Intento de borrado físico**
- El sistema no permite borrado físico, solo baja lógica
- Cualquier intento de eliminación física es rechazado

### Postcondiciones
- Los cambios en el inventario quedan registrados con fecha y hora
- El dispositivo refleja su nuevo estado en el sistema
- Las bajas son lógicas, preservando el historial

---

## CU-09: Registrar dispositivo dañado

**ID:** CU-09  
**Nombre:** Registrar dispositivo dañado  
**Actor Principal:** Técnico  
**Requisitos Relacionados:** RF-13  
**Prioridad:** Media

### Descripción
Permite al técnico registrar un dispositivo como dañado, bloqueando su préstamo hasta que sea reparado.

### Precondiciones
- El técnico ha iniciado sesión en el sistema
- El dispositivo existe en el inventario
- Se detectó un daño en el dispositivo

### Flujo Principal
1. El técnico identifica un dispositivo dañado
2. El técnico accede a la opción "Registrar dispositivo dañado"
3. El técnico busca y selecciona el dispositivo
4. El sistema muestra los detalles actuales del dispositivo
5. El técnico selecciona "Marcar como dañado"
6. El técnico ingresa observación detallada del daño (obligatoria)
7. El técnico puede adjuntar evidencia fotográfica (opcional)
8. El técnico confirma el registro
9. El sistema cambia el estado del dispositivo a "En mantenimiento"
10. El sistema registra la fecha y hora del reporte
11. El dispositivo queda bloqueado para nuevos préstamos
12. El sistema muestra confirmación del registro

### Flujo Alternativo
**FA-01: Dispositivo en préstamo activo**
- 4a. El dispositivo está actualmente prestado
- 4b. El sistema muestra advertencia pero permite continuar
- 4c. El sistema notifica que será bloqueado al finalizar el préstamo actual
- 4d. Continúa en paso 5

**FA-02: Observación vacía**
- 8a. El técnico intenta confirmar sin ingresar observación
- 8b. El sistema muestra mensaje "La observación del daño es obligatoria"
- 8c. Retorna al paso 6

### Postcondiciones
- El dispositivo queda en estado "En mantenimiento"
- El dispositivo no puede ser asignado en nuevos préstamos
- Queda registrado el reporte del daño con fecha, hora y observaciones

---

## CU-10: Realizar revisión técnica en devolución

**ID:** CU-10  
**Nombre:** Realizar revisión técnica en devolución  
**Actor Principal:** Técnico  
**Requisitos Relacionados:** RF-14  
**Prioridad:** Alta

### Descripción
Permite al técnico realizar una revisión exhaustiva del dispositivo al momento de la devolución, registrando observaciones y evidencia fotográfica de posibles daños.

### Precondiciones
- El dispositivo está siendo devuelto (CU-06 en progreso)
- El técnico detecta daños o anomalías en el dispositivo

### Flujo Principal
1. El técnico está en proceso de devolución (paso 6 de CU-06)
2. El técnico detecta daños en el dispositivo
3. El técnico selecciona "Estado: Dañado"
4. El sistema muestra formulario de revisión técnica
5. El técnico describe detalladamente los daños encontrados
6. El técnico adjunta evidencia fotográfica de los daños (obligatoria)
7. El técnico especifica el tipo de daño (físico, funcional, cosmético)
8. El técnico confirma la revisión
9. El sistema asocia el reporte al usuario que devolvió
10. El sistema cambia el estado del dispositivo a "En mantenimiento"
11. El sistema registra la fecha y hora de la revisión
12. El dispositivo queda bloqueado para nuevos préstamos
13. El sistema completa la devolución con observaciones de daño
14. El sistema puede generar notificación al usuario responsable

### Flujo Alternativo
**FA-01: Sin evidencia fotográfica**
- 8a. El técnico intenta confirmar sin adjuntar imágenes
- 8b. El sistema muestra mensaje "Debe adjuntar al menos una imagen del daño"
- 8c. Retorna al paso 6

**FA-02: Descripción insuficiente**
- 8a. La descripción del daño está vacía o muy breve
- 8b. El sistema solicita descripción más detallada
- 8c. Retorna al paso 5

### Postcondiciones
- El dispositivo queda en estado "En mantenimiento"
- Queda registrada la responsabilidad del daño al usuario
- Se almacena evidencia fotográfica del estado del dispositivo
- El dispositivo no puede ser prestado hasta su reparación

---

## CU-11: Cancelar solicitud de préstamo

**ID:** CU-11  
**Nombre:** Cancelar solicitud de préstamo  
**Actor Principal:** Usuario (Estudiante, Docente, Administrativo)  
**Requisitos Relacionados:** RF-16  
**Prioridad:** Media

### Descripción
Permite al usuario cancelar una solicitud de préstamo activa con al menos 20 minutos de anticipación a la hora programada.

### Precondiciones
- El usuario ha iniciado sesión en el sistema
- El usuario tiene una solicitud de préstamo activa (estado "Reservado")
- Faltan al menos 20 minutos para la hora de retiro programada

### Flujo Principal
1. El usuario accede a "Mis solicitudes"
2. El sistema muestra las solicitudes activas del usuario
3. El usuario selecciona la solicitud que desea cancelar
4. El usuario presiona el botón "Cancelar solicitud"
5. El sistema verifica que falten al menos 20 minutos para la hora de retiro
6. El sistema muestra mensaje de confirmación "¿Está seguro de cancelar esta solicitud?"
7. El usuario confirma la cancelación
8. El sistema cambia el estado de la solicitud a "Cancelada"
9. El sistema libera el dispositivo asignado (cambia a "Disponible")
10. El sistema registra la fecha y hora de cancelación
11. El sistema muestra confirmación "Solicitud cancelada exitosamente"

### Flujo Alternativo
**FA-01: Cancelación tardía (menos de 20 minutos)**
- 5a. Faltan menos de 20 minutos para la hora de retiro
- 5b. El sistema muestra mensaje "No se puede cancelar con menos de 20 minutos de anticipación"
- 5c. El botón "Cancelar solicitud" está deshabilitado
- 5d. Fin del caso de uso

**FA-02: Usuario se arrepiente**
- 7a. El usuario selecciona "No" en la confirmación
- 7b. El sistema cierra el diálogo de confirmación
- 7c. La solicitud permanece activa
- 7d. Retorna al paso 2

**FA-03: Dispositivo ya retirado**
- 5a. El préstamo ya está en estado "En uso"
- 5b. El sistema muestra mensaje "No se puede cancelar un préstamo ya retirado"
- 5c. Fin del caso de uso

### Postcondiciones
- La solicitud queda cancelada en el sistema
- El dispositivo vuelve a estar disponible para otros usuarios
- Queda registrado el historial de cancelación

---

## CU-12: Generar reportes

**ID:** CU-12  
**Nombre:** Generar reportes  
**Actor Principal:** Administrador  
**Requisitos Relacionados:** RF-08  
**Prioridad:** Media

### Descripción
Permite al administrador generar reportes configurables con diversos filtros para análisis y toma de decisiones.

### Precondiciones
- El administrador ha iniciado sesión en el sistema
- Existen datos de préstamos en el sistema

### Flujo Principal
1. El administrador accede a la opción "Generar reportes"
2. El sistema muestra las opciones de reportes disponibles:
   - Préstamos por período
   - Dispositivos más solicitados
   - Usuarios con más préstamos
   - Préstamos con retraso
   - Estado del inventario
   - Dispositivos en mantenimiento
3. El administrador selecciona el tipo de reporte
4. El sistema muestra los filtros disponibles para ese tipo de reporte:
   - Rango de fechas
   - Tipo de dispositivo
   - Estado del préstamo
   - Tipo de usuario (Estudiante, Docente, Administrativo)
   - Facultad/Departamento
5. El administrador configura los filtros deseados
6. El administrador selecciona el formato de exportación (PDF o Excel)
7. El administrador presiona "Generar reporte"
8. El sistema procesa los datos según los filtros aplicados
9. El sistema genera el reporte en el formato seleccionado
10. El sistema muestra vista previa del reporte
11. El administrador puede descargar el reporte generado

### Flujo Alternativo
**FA-01: Sin datos para los filtros seleccionados**
- 8a. No existen registros que cumplan los criterios de filtrado
- 8b. El sistema muestra mensaje "No hay datos disponibles para los filtros seleccionados"
- 8c. Retorna al paso 5

**FA-02: Rango de fechas inválido**
- 5a. La fecha final es anterior a la fecha inicial
- 5b. El sistema muestra mensaje "El rango de fechas no es válido"
- 5c. Retorna al paso 5

**FA-03: Error en generación**
- 8a. Ocurre un error al procesar los datos
- 8b. El sistema muestra mensaje "Error al generar el reporte. Intente nuevamente"
- 8c. Retorna al paso 7

### Postcondiciones
- Se genera un archivo descargable con el reporte solicitado
- Queda registrada la generación del reporte (quién, cuándo, qué tipo)

---

## Casos de Uso Automáticos (Procesos del Sistema)

### CUA-01: Liberar solicitud por no retiro

**Requisito Relacionado:** RF-15

**Descripción:** El sistema libera automáticamente una solicitud si el usuario no retira el dispositivo en los 20 minutos siguientes a la aprobación.

**Flujo:**
1. Han transcurrido 20 minutos desde que se generó el código de préstamo
2. El sistema verifica que el préstamo sigue en estado "Reservado"
3. El sistema cambia el estado de la solicitud a "No retirado"
4. El sistema libera el dispositivo asignado (estado "Disponible")
5. El sistema registra la liberación automática con fecha y hora
6. El código de préstamo queda invalidado

---

### CUA-02: Notificar retrasos en devolución

**Requisito Relacionado:** RF-07

**Descripción:** El sistema detecta automáticamente cuando un préstamo supera el tiempo establecido y notifica al usuario correspondiente según su rol.

**Flujo:**
1. El sistema verifica periódicamente los préstamos activos
2. El sistema detecta que un préstamo superó el tiempo límite de devolución
3. El sistema identifica el rol del usuario (Estudiante, Docente, Administrativo)
4. El sistema genera notificación personalizada según el rol
5. El sistema envía correo electrónico al correo institucional del usuario
6. El sistema registra la notificación enviada con fecha y hora
7. El préstamo se marca con indicador de "Retraso"

---

## Matriz de Trazabilidad: Requisitos → Casos de Uso

| Requisito | Nombre del Requisito | Casos de Uso Relacionados |
|-----------|----------------------|---------------------------|
| RF-01 | Inicio de sesión institucional | CU-01 |
| RF-02 | Solicitud de préstamo para estudiantes | CU-02 |
| RF-03 | Solicitud de préstamo para docentes | CU-03 |
| RF-04 | Solicitud de préstamo para administrativos | CU-04 |
| RF-05 | Registro de entrega y devolución | CU-05, CU-06 |
| RF-06 | Catálogo de dispositivos | CU-07 |
| RF-07 | Notificaciones automáticas por retraso | CUA-02 |
| RF-08 | Reportes filtrables | CU-12 |
| RF-09 | Validación de disponibilidad del dispositivo | CU-02, CU-03, CU-04 |
| RF-10 | Asignación automática de dispositivo | CU-02, CU-03, CU-04 |
| RF-11 | Código único de préstamo | CU-02, CU-03, CU-04, CU-05 |
| RF-12 | Gestión de inventario | CU-08 |
| RF-13 | Registro de dispositivos dañados | CU-09 |
| RF-14 | Revisión técnica en devolución | CU-10 |
| RF-15 | Liberación automática por no retiro | CUA-01 |
| RF-16 | Cancelación anticipada de solicitud | CU-11 |

---

## Diagrama de Actores y Casos de Uso

### Actores del Sistema

1. **Estudiante**
   - CU-01: Iniciar sesión
   - CU-02: Solicitar préstamo (dentro de franja horaria)
   - CU-11: Cancelar solicitud

2. **Docente**
   - CU-01: Iniciar sesión
   - CU-03: Solicitar préstamo (con/sin franja horaria)
   - CU-11: Cancelar solicitud

3. **Administrativo**
   - CU-01: Iniciar sesión
   - CU-04: Solicitar préstamo (con fecha/hora específica)
   - CU-11: Cancelar solicitud

4. **Técnico**
   - CU-01: Iniciar sesión
   - CU-05: Entregar dispositivo
   - CU-06: Devolver dispositivo
   - CU-07: Consultar catálogo
   - CU-08: Gestionar inventario
   - CU-09: Registrar dispositivo dañado
   - CU-10: Realizar revisión técnica

5. **Administrador**
   - CU-01: Iniciar sesión
   - CU-12: Generar reportes

6. **Sistema (Actor automático)**
   - CUA-01: Liberar solicitud por no retiro
   - CUA-02: Notificar retrasos

---

**Documento generado:** 7 de diciembre de 2025  
**Versión:** 1.0  
**Estado:** Completo
