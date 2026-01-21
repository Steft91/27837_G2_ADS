# Plan de Pruebas - API CodigoV2

## Información General
- **Proyecto**: Sistema de Gestión de Préstamos de Dispositivos
- **Base URL**: `http://localhost:3001/api`
- **Fecha**: 20 de enero de 2026
- **Tipo de pruebas**: Pruebas funcionales manuales con Postman

---

## 1. Configuración Inicial

### 1.1 Variables de Entorno en Postman
Crear las siguientes variables:
- `base_url`: `http://localhost:3001/api`
- `token`: (se actualizará después del login)
- `estudiante_id`: (se actualizará después de crear estudiante)
- `dispositivo_id`: (se actualizará después de crear dispositivo)
- `materia_id`: (se actualizará después de crear materia)
- `inscripcion_id`: (se actualizará después de crear inscripción)
- `prestamo_id`: (se actualizará después de crear préstamo)

### 1.2 Requisitos Previos
- Servidor backend ejecutándose en puerto 3001
- MongoDB conectado
- Postman instalado

---

## 2. Módulo de Autenticación (Login)

### TC-LOGIN-01: Login exitoso con credenciales válidas
**Endpoint**: `POST {{base_url}}/login`

**Datos de entrada**:
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Resultado esperado**:
- Status Code: 200
- Respuesta contiene token JWT
- Token tiene formato válido

**Validaciones**:
- [ ] Status code es 200
- [ ] Response tiene campo "token"
- [ ] Token no está vacío

**Script Post-Response** (Postman):
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has token", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.token).to.exist;
    pm.environment.set("token", jsonData.token);
});
```

---

### TC-LOGIN-02: Login fallido - Credenciales inválidas
**Endpoint**: `POST {{base_url}}/login`

**Datos de entrada**:
```json
{
  "email": "wrong@example.com",
  "password": "wrongpassword"
}
```

**Resultado esperado**:
- Status Code: 401
- Mensaje: "Credenciales inválidas."

**Validaciones**:
- [ ] Status code es 401
- [ ] Response contiene mensaje de error

---

### TC-LOGIN-03: Login fallido - Campos faltantes
**Endpoint**: `POST {{base_url}}/login`

**Datos de entrada**:
```json
{
  "email": "test@example.com"
}
```

**Resultado esperado**:
- Status Code: 400
- Mensaje: "Correo y contraseña requeridos."

**Validaciones**:
- [ ] Status code es 400
- [ ] Response contiene mensaje de error apropiado

---

## 3. Módulo de Estudiantes

### TC-EST-01: Crear estudiante válido
**Endpoint**: `POST {{base_url}}/estudiantes`

**Headers**:
```
Content-Type: application/json
```

**Datos de entrada**:
```json
{
  "name": "Juan Pérez",
  "email": "juan.perez@example.com",
  "password": "securePass123",
  "career": "Ingeniería de Sistemas"
}
```

**Resultado esperado**:
- Status Code: 201
- Estudiante creado con todos los campos
- Incluye _id, timestamps

**Validaciones**:
- [ ] Status code es 201
- [ ] Response contiene _id
- [ ] Todos los campos están presentes
- [ ] Email tiene formato correcto

**Script Post-Response**:
```javascript
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Student created successfully", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData._id).to.exist;
    pm.environment.set("estudiante_id", jsonData._id);
});
```

---

### TC-EST-02: Crear estudiante con email duplicado
**Endpoint**: `POST {{base_url}}/estudiantes`

**Datos de entrada**:
```json
{
  "name": "María García",
  "email": "juan.perez@example.com",
  "password": "password456",
  "career": "Ingeniería Industrial"
}
```

**Resultado esperado**:
- Status Code: 400
- Error de email duplicado

**Validaciones**:
- [ ] Status code es 400
- [ ] Response contiene mensaje de error

---

### TC-EST-03: Crear estudiante con datos faltantes
**Endpoint**: `POST {{base_url}}/estudiantes`

**Datos de entrada**:
```json
{
  "name": "Pedro López",
  "email": "pedro@example.com"
}
```

**Resultado esperado**:
- Status Code: 400
- Mensaje de error indicando campos requeridos

**Validaciones**:
- [ ] Status code es 400
- [ ] Response indica campos faltantes

---

### TC-EST-04: Obtener todos los estudiantes (Con autenticación)
**Endpoint**: `GET {{base_url}}/estudiantes`

**Headers**:
```
Authorization: Bearer {{token}}
```

**Resultado esperado**:
- Status Code: 200
- Array de estudiantes

**Validaciones**:
- [ ] Status code es 200
- [ ] Response es un array
- [ ] Cada estudiante tiene estructura correcta

**Script Post-Response**:
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response is an array", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an('array');
});
```

---

### TC-EST-05: Obtener todos los estudiantes sin autenticación
**Endpoint**: `GET {{base_url}}/estudiantes`

**Resultado esperado**:
- Status Code: 401
- Mensaje: No autorizado

**Validaciones**:
- [ ] Status code es 401
- [ ] Acceso denegado

---

### TC-EST-06: Obtener estudiante por ID válido
**Endpoint**: `GET {{base_url}}/estudiantes/{{estudiante_id}}`

**Headers**:
```
Authorization: Bearer {{token}}
```

**Resultado esperado**:
- Status Code: 200
- Datos del estudiante solicitado

**Validaciones**:
- [ ] Status code es 200
- [ ] Response contiene estudiante correcto
- [ ] _id coincide con el solicitado

---

### TC-EST-07: Obtener estudiante con ID inválido
**Endpoint**: `GET {{base_url}}/estudiantes/invalid_id`

**Headers**:
```
Authorization: Bearer {{token}}
```

**Resultado esperado**:
- Status Code: 404 o 400
- Mensaje de error

**Validaciones**:
- [ ] Status code es 404 o 400
- [ ] Response contiene mensaje de error

---

### TC-EST-08: Actualizar estudiante exitosamente
**Endpoint**: `PUT {{base_url}}/estudiantes/{{estudiante_id}}`

**Headers**:
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Datos de entrada**:
```json
{
  "name": "Juan Carlos Pérez",
  "career": "Ingeniería de Software"
}
```

**Resultado esperado**:
- Status Code: 200
- Estudiante actualizado con nuevos valores

**Validaciones**:
- [ ] Status code es 200
- [ ] Campos actualizados correctamente
- [ ] Campos no modificados permanecen igual

---

### TC-EST-09: Actualizar estudiante sin autenticación
**Endpoint**: `PUT {{base_url}}/estudiantes/{{estudiante_id}}`

**Datos de entrada**:
```json
{
  "name": "Nuevo Nombre"
}
```

**Resultado esperado**:
- Status Code: 401
- Acceso denegado

**Validaciones**:
- [ ] Status code es 401

---

### TC-EST-10: Eliminar estudiante exitosamente
**Endpoint**: `DELETE {{base_url}}/estudiantes/{{estudiante_id}}`

**Headers**:
```
Authorization: Bearer {{token}}
```

**Resultado esperado**:
- Status Code: 200
- Mensaje: "Eliminado"

**Validaciones**:
- [ ] Status code es 200
- [ ] Response indica eliminación exitosa
- [ ] GET posterior retorna 404

---

### TC-EST-11: Eliminar estudiante inexistente
**Endpoint**: `DELETE {{base_url}}/estudiantes/507f1f77bcf86cd799439011`

**Headers**:
```
Authorization: Bearer {{token}}
```

**Resultado esperado**:
- Status Code: 404
- Mensaje: "No encontrado"

**Validaciones**:
- [ ] Status code es 404

---

## 4. Módulo de Dispositivos

### TC-DISP-01: Crear dispositivo válido
**Endpoint**: `POST {{base_url}}/dispositivos`

**Headers**:
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Datos de entrada**:
```json
{
  "type": "Laptop",
  "brand": "Dell",
  "model": "Latitude 5420",
  "location": "Laboratorio A-201",
  "status": "Disponible"
}
```

**Resultado esperado**:
- Status Code: 201
- Dispositivo creado

**Validaciones**:
- [ ] Status code es 201
- [ ] Response contiene _id
- [ ] Todos los campos están presentes

**Script Post-Response**:
```javascript
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Device created successfully", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData._id).to.exist;
    pm.environment.set("dispositivo_id", jsonData._id);
});
```

---

### TC-DISP-02: Crear dispositivo con campos faltantes
**Endpoint**: `POST {{base_url}}/dispositivos`

**Headers**:
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Datos de entrada**:
```json
{
  "type": "Tablet",
  "brand": "Samsung"
}
```

**Resultado esperado**:
- Status Code: 400
- Mensaje de error

**Validaciones**:
- [ ] Status code es 400
- [ ] Response indica campos faltantes

---

### TC-DISP-03: Obtener todos los dispositivos (Sin autenticación)
**Endpoint**: `GET {{base_url}}/dispositivos`

**Resultado esperado**:
- Status Code: 200
- Array de dispositivos

**Validaciones**:
- [ ] Status code es 200
- [ ] Response es un array
- [ ] Endpoint es público

---

### TC-DISP-04: Obtener dispositivo por ID
**Endpoint**: `GET {{base_url}}/dispositivos/{{dispositivo_id}}`

**Resultado esperado**:
- Status Code: 200
- Datos del dispositivo

**Validaciones**:
- [ ] Status code es 200
- [ ] _id coincide

---

### TC-DISP-05: Actualizar dispositivo
**Endpoint**: `PUT {{base_url}}/dispositivos/{{dispositivo_id}}`

**Headers**:
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Datos de entrada**:
```json
{
  "status": "En Mantenimiento",
  "location": "Laboratorio B-102"
}
```

**Resultado esperado**:
- Status Code: 200
- Dispositivo actualizado

**Validaciones**:
- [ ] Status code es 200
- [ ] Campos actualizados correctamente

---

### TC-DISP-06: Actualizar dispositivo sin autenticación
**Endpoint**: `PUT {{base_url}}/dispositivos/{{dispositivo_id}}`

**Datos de entrada**:
```json
{
  "status": "Disponible"
}
```

**Resultado esperado**:
- Status Code: 401

**Validaciones**:
- [ ] Status code es 401

---

### TC-DISP-07: Eliminar dispositivo
**Endpoint**: `DELETE {{base_url}}/dispositivos/{{dispositivo_id}}`

**Headers**:
```
Authorization: Bearer {{token}}
```

**Resultado esperado**:
- Status Code: 200
- Mensaje: "Eliminado"

**Validaciones**:
- [ ] Status code es 200
- [ ] Dispositivo eliminado exitosamente

---

## 5. Módulo de Materias

### TC-MAT-01: Crear materia válida
**Endpoint**: `POST {{base_url}}/materias`

**Headers**:
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Datos de entrada**:
```json
{
  "name": "Análisis y Diseño de Sistemas",
  "location": "Aula 302",
  "start": 800,
  "end": 1000,
  "days": ["Lunes", "Miércoles", "Viernes"]
}
```

**Resultado esperado**:
- Status Code: 201
- Materia creada

**Validaciones**:
- [ ] Status code es 201
- [ ] Response contiene _id
- [ ] Array de días está presente

**Script Post-Response**:
```javascript
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Subject created successfully", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData._id).to.exist;
    pm.environment.set("materia_id", jsonData._id);
});
```

---

### TC-MAT-02: Crear materia con horarios inválidos
**Endpoint**: `POST {{base_url}}/materias`

**Headers**:
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Datos de entrada**:
```json
{
  "name": "Base de Datos",
  "location": "Aula 201",
  "start": 1200,
  "end": 1000,
  "days": ["Martes"]
}
```

**Resultado esperado**:
- Status Code: 400
- Error de validación (hora fin antes de hora inicio)

**Validaciones**:
- [ ] Status code es 400

---

### TC-MAT-03: Obtener todas las materias (Sin autenticación)
**Endpoint**: `GET {{base_url}}/materias`

**Resultado esperado**:
- Status Code: 200
- Array de materias

**Validaciones**:
- [ ] Status code es 200
- [ ] Response es un array

---

### TC-MAT-04: Obtener materia por ID
**Endpoint**: `GET {{base_url}}/materias/{{materia_id}}`

**Resultado esperado**:
- Status Code: 200
- Datos de la materia

**Validaciones**:
- [ ] Status code es 200
- [ ] Datos correctos

---

### TC-MAT-05: Actualizar materia
**Endpoint**: `PUT {{base_url}}/materias/{{materia_id}}`

**Headers**:
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Datos de entrada**:
```json
{
  "location": "Aula 405",
  "start": 900
}
```

**Resultado esperado**:
- Status Code: 200
- Materia actualizada

**Validaciones**:
- [ ] Status code es 200
- [ ] Campos actualizados correctamente

---

### TC-MAT-06: Eliminar materia
**Endpoint**: `DELETE {{base_url}}/materias/{{materia_id}}`

**Headers**:
```
Authorization: Bearer {{token}}
```

**Resultado esperado**:
- Status Code: 200
- Mensaje: "Eliminado"

**Validaciones**:
- [ ] Status code es 200

---

## 6. Módulo de Inscripciones

### TC-INS-01: Crear inscripción válida
**Endpoint**: `POST {{base_url}}/inscripciones`

**Headers**:
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Datos de entrada**:
```json
{
  "estudianteId": "{{estudiante_id}}",
  "materiaId": "{{materia_id}}",
  "date": "2026-01-20T10:00:00Z"
}
```

**Resultado esperado**:
- Status Code: 201
- Inscripción creada

**Validaciones**:
- [ ] Status code es 201
- [ ] Response contiene _id
- [ ] Referencias válidas

**Script Post-Response**:
```javascript
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Enrollment created successfully", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData._id).to.exist;
    pm.environment.set("inscripcion_id", jsonData._id);
});
```

---

### TC-INS-02: Crear inscripción con IDs inválidos
**Endpoint**: `POST {{base_url}}/inscripciones`

**Headers**:
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Datos de entrada**:
```json
{
  "estudianteId": "invalid_id",
  "materiaId": "invalid_id",
  "date": "2026-01-20T10:00:00Z"
}
```

**Resultado esperado**:
- Status Code: 400
- Error de validación

**Validaciones**:
- [ ] Status code es 400

---

### TC-INS-03: Obtener todas las inscripciones
**Endpoint**: `GET {{base_url}}/inscripciones`

**Headers**:
```
Authorization: Bearer {{token}}
```

**Resultado esperado**:
- Status Code: 200
- Array de inscripciones

**Validaciones**:
- [ ] Status code es 200
- [ ] Response es un array

---

### TC-INS-04: Obtener inscripción por ID
**Endpoint**: `GET {{base_url}}/inscripciones/{{inscripcion_id}}`

**Headers**:
```
Authorization: Bearer {{token}}
```

**Resultado esperado**:
- Status Code: 200
- Datos de la inscripción

**Validaciones**:
- [ ] Status code es 200

---

### TC-INS-05: Actualizar inscripción
**Endpoint**: `PUT {{base_url}}/inscripciones/{{inscripcion_id}}`

**Headers**:
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Datos de entrada**:
```json
{
  "date": "2026-01-21T10:00:00Z"
}
```

**Resultado esperado**:
- Status Code: 200
- Inscripción actualizada

**Validaciones**:
- [ ] Status code es 200

---

### TC-INS-06: Eliminar inscripción
**Endpoint**: `DELETE {{base_url}}/inscripciones/{{inscripcion_id}}`

**Headers**:
```
Authorization: Bearer {{token}}
```

**Resultado esperado**:
- Status Code: 200
- Mensaje: "Eliminado"

**Validaciones**:
- [ ] Status code es 200

---

## 7. Módulo de Préstamos

### TC-PRES-01: Crear préstamo válido
**Endpoint**: `POST {{base_url}}/prestamos`

**Headers**:
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Datos de entrada**:
```json
{
  "userId": "{{estudiante_id}}",
  "userRole": "ESTUDIANTE",
  "idClase": "{{materia_id}}",
  "status": "ACTIVO",
  "start": "2026-01-20T08:00:00Z",
  "end": "2026-01-20T10:00:00Z",
  "idDispositivo": "{{dispositivo_id}}",
  "code": "PRES-001"
}
```

**Resultado esperado**:
- Status Code: 201
- Préstamo creado

**Validaciones**:
- [ ] Status code es 201
- [ ] Response contiene _id
- [ ] Relaciones correctas

**Script Post-Response**:
```javascript
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Loan created successfully", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData._id).to.exist;
    pm.environment.set("prestamo_id", jsonData._id);
});
```

---

### TC-PRES-02: Crear préstamo con rol inválido
**Endpoint**: `POST {{base_url}}/prestamos`

**Headers**:
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Datos de entrada**:
```json
{
  "userId": "{{estudiante_id}}",
  "userRole": "INVALIDO",
  "idClase": "{{materia_id}}",
  "status": "ACTIVO",
  "start": "2026-01-20T08:00:00Z",
  "end": "2026-01-20T10:00:00Z",
  "idDispositivo": "{{dispositivo_id}}",
  "code": "PRES-002"
}
```

**Resultado esperado**:
- Status Code: 400
- Error de enum

**Validaciones**:
- [ ] Status code es 400
- [ ] Mensaje indica valor de enum inválido

---

### TC-PRES-03: Crear préstamo con fechas inválidas
**Endpoint**: `POST {{base_url}}/prestamos`

**Headers**:
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Datos de entrada**:
```json
{
  "userId": "{{estudiante_id}}",
  "userRole": "ESTUDIANTE",
  "idClase": "{{materia_id}}",
  "status": "ACTIVO",
  "start": "2026-01-20T10:00:00Z",
  "end": "2026-01-20T08:00:00Z",
  "idDispositivo": "{{dispositivo_id}}",
  "code": "PRES-003"
}
```

**Resultado esperado**:
- Status Code: 400
- Error de validación de fechas

**Validaciones**:
- [ ] Status code es 400

---

### TC-PRES-04: Crear préstamo sin autenticación
**Endpoint**: `POST {{base_url}}/prestamos`

**Datos de entrada**:
```json
{
  "userId": "{{estudiante_id}}",
  "userRole": "ESTUDIANTE",
  "status": "ACTIVO",
  "code": "PRES-004"
}
```

**Resultado esperado**:
- Status Code: 401

**Validaciones**:
- [ ] Status code es 401

---

### TC-PRES-05: Obtener todos los préstamos
**Endpoint**: `GET {{base_url}}/prestamos`

**Headers**:
```
Authorization: Bearer {{token}}
```

**Resultado esperado**:
- Status Code: 200
- Array de préstamos

**Validaciones**:
- [ ] Status code es 200
- [ ] Response es un array

---

### TC-PRES-06: Obtener préstamo por ID
**Endpoint**: `GET {{base_url}}/prestamos/{{prestamo_id}}`

**Headers**:
```
Authorization: Bearer {{token}}
```

**Resultado esperado**:
- Status Code: 200
- Datos del préstamo

**Validaciones**:
- [ ] Status code es 200
- [ ] Datos correctos

---

### TC-PRES-07: Actualizar estado de préstamo
**Endpoint**: `PUT {{base_url}}/prestamos/{{prestamo_id}}`

**Headers**:
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Datos de entrada**:
```json
{
  "status": "FINALIZADO"
}
```

**Resultado esperado**:
- Status Code: 200
- Préstamo actualizado

**Validaciones**:
- [ ] Status code es 200
- [ ] Status actualizado a FINALIZADO

---

### TC-PRES-08: Actualizar préstamo sin autenticación
**Endpoint**: `PUT {{base_url}}/prestamos/{{prestamo_id}}`

**Datos de entrada**:
```json
{
  "status": "MORA"
}
```

**Resultado esperado**:
- Status Code: 401

**Validaciones**:
- [ ] Status code es 401

---

### TC-PRES-09: Eliminar préstamo
**Endpoint**: `DELETE {{base_url}}/prestamos/{{prestamo_id}}`

**Headers**:
```
Authorization: Bearer {{token}}
```

**Resultado esperado**:
- Status Code: 200
- Mensaje: "Eliminado"

**Validaciones**:
- [ ] Status code es 200

---

### TC-PRES-10: Eliminar préstamo inexistente
**Endpoint**: `DELETE {{base_url}}/prestamos/507f1f77bcf86cd799439011`

**Headers**:
```
Authorization: Bearer {{token}}
```

**Resultado esperado**:
- Status Code: 404

**Validaciones**:
- [ ] Status code es 404

---

## 8. Pruebas de Integración

### TC-INT-01: Flujo completo de préstamo
**Descripción**: Simula el flujo completo desde crear estudiante hasta finalizar préstamo.

**Pasos**:
1. Crear estudiante (POST /estudiantes)
2. Login con estudiante (POST /login)
3. Crear dispositivo (POST /dispositivos)
4. Crear materia (POST /materias)
5. Crear inscripción (POST /inscripciones)
6. Crear préstamo (POST /prestamos)
7. Actualizar préstamo a FINALIZADO (PUT /prestamos/:id)
8. Verificar préstamo (GET /prestamos/:id)

**Validaciones**:
- [ ] Todos los pasos se completan exitosamente
- [ ] Relaciones entre entidades son correctas
- [ ] Estado final es consistente

---

### TC-INT-02: Validación de referencias
**Descripción**: Verificar que las referencias entre entidades funcionan correctamente.

**Pasos**:
1. Crear préstamo con dispositivoId válido
2. Eliminar el dispositivo
3. Intentar obtener el préstamo

**Validaciones**:
- [ ] Préstamo se crea correctamente
- [ ] Comportamiento apropiado después de eliminar dispositivo

---

### TC-INT-03: Límites de préstamos concurrentes
**Descripción**: Verificar comportamiento con múltiples préstamos del mismo dispositivo.

**Pasos**:
1. Crear dispositivo
2. Crear primer préstamo ACTIVO
3. Intentar crear segundo préstamo ACTIVO para el mismo dispositivo

**Validaciones**:
- [ ] Sistema maneja correctamente préstamos concurrentes

---

## 9. Pruebas de Seguridad

### TC-SEC-01: Acceso sin token
**Descripción**: Verificar que endpoints protegidos requieren autenticación.

**Endpoints a probar**:
- GET /estudiantes
- PUT /estudiantes/:id
- DELETE /estudiantes/:id
- POST /dispositivos
- PUT /dispositivos/:id
- DELETE /dispositivos/:id
- POST /materias
- PUT /materias/:id
- DELETE /materias/:id
- POST /inscripciones
- GET /inscripciones
- POST /prestamos
- GET /prestamos

**Validaciones**:
- [ ] Todos retornan 401

---

### TC-SEC-02: Token expirado
**Descripción**: Verificar comportamiento con token JWT expirado.

**Pasos**:
1. Usar token generado hace más de 1 hora
2. Intentar acceder a endpoint protegido

**Validaciones**:
- [ ] Status code es 401
- [ ] Mensaje indica token expirado

---

### TC-SEC-03: Token malformado
**Descripción**: Verificar rechazo de tokens inválidos.

**Pasos**:
1. Usar token con formato incorrecto
2. Intentar acceder a endpoint protegido

**Validaciones**:
- [ ] Status code es 401

---

## 10. Pruebas de Validación de Datos

### TC-VAL-01: Email formato inválido
**Endpoint**: `POST {{base_url}}/estudiantes`

**Datos de entrada**:
```json
{
  "name": "Test User",
  "email": "invalid-email",
  "password": "pass123",
  "career": "Ingeniería"
}
```

**Validaciones**:
- [ ] Status code es 400
- [ ] Mensaje indica formato de email inválido

---

### TC-VAL-02: Campos con valores vacíos
**Endpoint**: `POST {{base_url}}/estudiantes`

**Datos de entrada**:
```json
{
  "name": "",
  "email": "",
  "password": "",
  "career": ""
}
```

**Validaciones**:
- [ ] Status code es 400
- [ ] Mensaje indica campos vacíos

---

### TC-VAL-03: Tipos de datos incorrectos
**Endpoint**: `POST {{base_url}}/materias`

**Datos de entrada**:
```json
{
  "name": "Materia Test",
  "location": "Aula 101",
  "start": "ocho",
  "end": "diez",
  "days": "Lunes"
}
```

**Validaciones**:
- [ ] Status code es 400
- [ ] Mensaje indica tipo de dato incorrecto

---

## 11. Pruebas de Rendimiento (Básicas)

### TC-PERF-01: Tiempo de respuesta GET
**Descripción**: Medir tiempo de respuesta de endpoints GET.

**Endpoints**:
- GET /dispositivos
- GET /materias
- GET /estudiantes
- GET /prestamos

**Validaciones**:
- [ ] Tiempo de respuesta < 500ms

**Script Postman**:
```javascript
pm.test("Response time is less than 500ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(500);
});
```

---

### TC-PERF-02: Tiempo de respuesta POST
**Descripción**: Medir tiempo de respuesta de endpoints POST.

**Validaciones**:
- [ ] Tiempo de respuesta < 1000ms

---

## 12. Casos Especiales

### TC-ESP-01: Caracteres especiales en nombres
**Endpoint**: `POST {{base_url}}/estudiantes`

**Datos de entrada**:
```json
{
  "name": "José María Ñoño",
  "email": "jose@example.com",
  "password": "pass123",
  "career": "Ingeniería"
}
```

**Validaciones**:
- [ ] Status code es 201
- [ ] Caracteres especiales se guardan correctamente

---

### TC-ESP-02: Longitud máxima de campos
**Endpoint**: `POST {{base_url}}/estudiantes`

**Datos de entrada**:
```json
{
  "name": "A".repeat(1000),
  "email": "test@example.com",
  "password": "pass123",
  "career": "Ingeniería"
}
```

**Validaciones**:
- [ ] Sistema maneja campos muy largos apropiadamente

---

### TC-ESP-03: Payload muy grande
**Endpoint**: `POST {{base_url}}/dispositivos`

**Datos de entrada**: JSON con campos muy largos

**Validaciones**:
- [ ] Sistema rechaza o maneja payloads grandes

---

## 13. Resumen de Ejecución

### Matriz de Resultados

| Módulo | Total Casos | Ejecutados | Exitosos | Fallidos | Bloqueados |
|--------|-------------|------------|----------|----------|------------|
| Login | 3 | | | | |
| Estudiantes | 11 | | | | |
| Dispositivos | 7 | | | | |
| Materias | 6 | | | | |
| Inscripciones | 6 | | | | |
| Préstamos | 10 | | | | |
| Integración | 3 | | | | |
| Seguridad | 3 | | | | |
| Validación | 3 | | | | |
| Rendimiento | 2 | | | | |
| Especiales | 3 | | | | |
| **TOTAL** | **57** | | | | |

---

## 14. Instrucciones de Uso

### Paso 1: Importar Colección en Postman
1. Crear nueva colección llamada "API CodigoV2"
2. Configurar variables de entorno
3. Organizar requests por módulos

### Paso 2: Orden de Ejecución Sugerido
1. Iniciar servidor backend
2. Verificar conexión a MongoDB
3. Ejecutar casos de Login
4. Ejecutar casos de Estudiantes
5. Ejecutar casos de Dispositivos
6. Ejecutar casos de Materias
7. Ejecutar casos de Inscripciones
8. Ejecutar casos de Préstamos
9. Ejecutar casos de Integración
10. Ejecutar casos de Seguridad
11. Ejecutar casos de Validación

### Paso 3: Registro de Resultados
- Marcar checkbox al completar cada validación
- Anotar observaciones en casos fallidos
- Capturar screenshots de errores
- Documentar bugs encontrados

### Paso 4: Reportes
- Generar reporte de ejecución
- Documentar defectos encontrados
- Priorizar correcciones

---

## 15. Criterios de Aceptación

### Criterios de Éxito
- ✅ 100% de casos de Login exitosos
- ✅ 95% de casos CRUD exitosos
- ✅ 100% de casos de seguridad exitosos
- ✅ Tiempos de respuesta < 500ms

### Criterios de Fallo
- ❌ Endpoints sin autenticación apropiada
- ❌ Datos no validados correctamente
- ❌ Referencias rotas entre entidades
- ❌ Errores 500 en operaciones normales

---

## 16. Notas Adicionales

### Problemas Conocidos en el Código
1. **Login.js**: Variables no definidas (`correo`, `contraseña`, `user`, `admin`)
2. **Modelo Prestamo**: Campo `userId` tiene typo (`equired` en lugar de `required`)
3. **Inconsistencia de campos**: Modelo usa `email`/`name`, Login usa `correo`/`nombre`

### Recomendaciones
1. Corregir errores en código antes de pruebas
2. Estandarizar nombres de campos
3. Implementar validaciones de negocio
4. Agregar logs para debugging
5. Implementar rate limiting
6. Agregar validación de referencias entre entidades

---

## Apéndice A: Scripts de Postman Útiles

### Script para Tests Genéricos
```javascript
// Verificar status code exitoso
pm.test("Status code is successful", function () {
    pm.expect(pm.response.code).to.be.oneOf([200, 201]);
});

// Verificar que response es JSON
pm.test("Response is JSON", function () {
    pm.response.to.be.json;
});

// Verificar tiempo de respuesta
pm.test("Response time is acceptable", function () {
    pm.expect(pm.response.responseTime).to.be.below(1000);
});
```

### Script para Validar Estructura
```javascript
pm.test("Response has correct structure", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('_id');
    pm.expect(jsonData).to.have.property('createdAt');
    pm.expect(jsonData).to.have.property('updatedAt');
});
```

---

## Apéndice B: Colección Postman JSON

```json
{
  "info": {
    "name": "API CodigoV2 - Plan de Pruebas",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:3001/api"
    },
    {
      "key": "token",
      "value": ""
    }
  ]
}
```

---

**Fin del Plan de Pruebas**
