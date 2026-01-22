# Plan de Pruebas Unitarias - Dispositivos y Préstamos

## Información General
- **Proyecto**: Sistema de Gestión de Préstamos de Dispositivos
- **Módulos a probar**: Dispositivos y Préstamos
- **Módulos excluidos**: Estudiante, Inscripción, Materia
- **Base URL**: `http://localhost:3001/api`
- **Fecha de creación**: 21 de enero de 2026
- **Tipo de pruebas**: Pruebas unitarias funcionales

---

## 1. Objetivos

### Objetivos Principales
- Validar la funcionalidad completa del módulo de Dispositivos
- Validar la funcionalidad completa del módulo de Préstamos
- Garantizar la integridad de datos en operaciones CRUD
- Verificar validaciones y manejo de errores
- Asegurar la correcta autenticación y autorización

### Criterios de Éxito
- ✅ 95% de cobertura en casos de prueba
- ✅ 100% de casos críticos exitosos
- ✅ Tiempo de respuesta < 500ms para operaciones GET
- ✅ Tiempo de respuesta < 1000ms para operaciones POST/PUT/DELETE

---

## 2. Alcance

### En Alcance
- ✅ CRUD completo de Dispositivos
- ✅ CRUD completo de Préstamos
- ✅ Validaciones de datos
- ✅ Pruebas de autenticación/autorización
- ✅ Manejo de errores
- ✅ Casos límite y edge cases

### Fuera de Alcance
- ❌ Módulo de Estudiantes
- ❌ Módulo de Inscripciones
- ❌ Módulo de Materias
- ❌ Pruebas de carga masiva
- ❌ Pruebas de seguridad avanzadas (penetración)

---

## 3. Configuración de Entorno

### 3.1 Variables de Entorno (Postman)
```json
{
  "base_url": "http://localhost:3001/api",
  "token": "",
  "dispositivo_id": "",
  "prestamo_id": "",
  "estudiante_id_test": "60d5ec49f1b2c8b1f8e4e1a1",
  "materia_id_test": "60d5ec49f1b2c8b1f8e4e1a2"
}
```

### 3.2 Prerrequisitos
- Backend ejecutándose en puerto 3001
- MongoDB conectado y accesible
- Token JWT válido obtenido del endpoint de login
- Datos de prueba: al menos 1 estudiante y 1 materia creados previamente

---

## 4. Módulo de Dispositivos

### 4.1 Casos de Prueba - Crear Dispositivo

#### TC-DISP-01: Crear dispositivo válido
**Prioridad**: Alta  
**Endpoint**: `POST {{base_url}}/dispositivos`

**Headers**:
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Datos de entrada**:
```json
{
  "name": "Laptop Dell Inspiron 15",
  "type": "LAPTOP",
  "model": "Inspiron 15 3520",
  "serialNumber": "SN-2026-001",
  "status": "DISPONIBLE",
  "location": "Laboratorio A"
}
```

**Resultado esperado**:
- Status Code: `201`
- Response incluye `_id`, `createdAt`, `updatedAt`
- Todos los campos guardados correctamente

**Validaciones**:
- [ ] Status code es 201
- [ ] Response contiene campo `_id`
- [ ] Campo `name` coincide con el enviado
- [ ] Campo `type` es "LAPTOP"
- [ ] Campo `status` es "DISPONIBLE"
- [ ] Campo `serialNumber` es único
- [ ] Campos `createdAt` y `updatedAt` existen

**Script Postman**:
```javascript
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Device created successfully", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData._id).to.exist;
    pm.expect(jsonData.name).to.eql("Laptop Dell Inspiron 15");
    pm.expect(jsonData.type).to.eql("LAPTOP");
    pm.environment.set("dispositivo_id", jsonData._id);
});

pm.test("Response time is less than 1000ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(1000);
});
```

---

#### TC-DISP-02: Crear dispositivo sin autenticación
**Prioridad**: Alta  
**Endpoint**: `POST {{base_url}}/dispositivos`

**Headers**:
```
Content-Type: application/json
```

**Datos de entrada**:
```json
{
  "name": "Tablet Samsung",
  "type": "TABLET",
  "model": "Galaxy Tab S8",
  "serialNumber": "SN-2026-002",
  "status": "DISPONIBLE"
}
```

**Resultado esperado**:
- Status Code: `401`
- Mensaje: "No autorizado" o similar

**Validaciones**:
- [ ] Status code es 401
- [ ] Response contiene mensaje de error
- [ ] Dispositivo NO se crea en base de datos

---

#### TC-DISP-03: Crear dispositivo con campos faltantes
**Prioridad**: Media  
**Endpoint**: `POST {{base_url}}/dispositivos`

**Datos de entrada**:
```json
{
  "name": "Dispositivo Incompleto",
  "type": "LAPTOP"
}
```

**Resultado esperado**:
- Status Code: `400`
- Mensaje indicando campos requeridos faltantes

**Validaciones**:
- [ ] Status code es 400
- [ ] Response indica campos faltantes (`model`, `serialNumber`, etc.)
- [ ] Dispositivo NO se crea

---

#### TC-DISP-04: Crear dispositivo con tipo inválido
**Prioridad**: Media  
**Endpoint**: `POST {{base_url}}/dispositivos`

**Datos de entrada**:
```json
{
  "name": "Dispositivo Test",
  "type": "SMARTPHONE",
  "model": "iPhone 15",
  "serialNumber": "SN-2026-003",
  "status": "DISPONIBLE"
}
```

**Resultado esperado**:
- Status Code: `400`
- Mensaje: Error de enum/tipo no válido

**Validaciones**:
- [ ] Status code es 400
- [ ] Response indica que el tipo no es válido
- [ ] Tipos válidos esperados: LAPTOP, TABLET, PROYECTOR, CAMARA

---

#### TC-DISP-05: Crear dispositivo con número de serie duplicado
**Prioridad**: Alta  
**Endpoint**: `POST {{base_url}}/dispositivos`

**Precondición**: Ya existe un dispositivo con serialNumber "SN-2026-001"

**Datos de entrada**:
```json
{
  "name": "Laptop HP",
  "type": "LAPTOP",
  "model": "HP Pavilion",
  "serialNumber": "SN-2026-001",
  "status": "DISPONIBLE"
}
```

**Resultado esperado**:
- Status Code: `400` o `409`
- Mensaje: "Número de serie ya existe" o similar

**Validaciones**:
- [ ] Status code es 400 o 409
- [ ] Response indica error de duplicado
- [ ] Dispositivo NO se crea

---

#### TC-DISP-06: Crear dispositivo con estado inválido
**Prioridad**: Media  
**Endpoint**: `POST {{base_url}}/dispositivos`

**Datos de entrada**:
```json
{
  "name": "Proyector Epson",
  "type": "PROYECTOR",
  "model": "Epson EB-X05",
  "serialNumber": "SN-2026-004",
  "status": "ROTO"
}
```

**Resultado esperado**:
- Status Code: `400`
- Mensaje: Estado no válido

**Validaciones**:
- [ ] Status code es 400
- [ ] Estados válidos esperados: DISPONIBLE, EN_USO, MANTENIMIENTO, RESERVADO

---

### 4.2 Casos de Prueba - Obtener Dispositivos

#### TC-DISP-07: Obtener todos los dispositivos con autenticación
**Prioridad**: Alta  
**Endpoint**: `GET {{base_url}}/dispositivos`

**Headers**:
```
Authorization: Bearer {{token}}
```

**Resultado esperado**:
- Status Code: `200`
- Array de dispositivos

**Validaciones**:
- [ ] Status code es 200
- [ ] Response es un array
- [ ] Cada dispositivo tiene estructura correcta
- [ ] Al menos 1 dispositivo en el array (si existen datos)

**Script Postman**:
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response is an array", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an('array');
});

pm.test("Each device has required fields", function () {
    var jsonData = pm.response.json();
    if (jsonData.length > 0) {
        jsonData.forEach(device => {
            pm.expect(device).to.have.property('_id');
            pm.expect(device).to.have.property('name');
            pm.expect(device).to.have.property('type');
            pm.expect(device).to.have.property('status');
        });
    }
});

pm.test("Response time is less than 500ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(500);
});
```

---

#### TC-DISP-08: Obtener todos los dispositivos sin autenticación
**Prioridad**: Alta  
**Endpoint**: `GET {{base_url}}/dispositivos`

**Resultado esperado**:
- Status Code: `401`

**Validaciones**:
- [ ] Status code es 401
- [ ] Acceso denegado

---

#### TC-DISP-09: Obtener dispositivo por ID válido
**Prioridad**: Alta  
**Endpoint**: `GET {{base_url}}/dispositivos/{{dispositivo_id}}`

**Headers**:
```
Authorization: Bearer {{token}}
```

**Resultado esperado**:
- Status Code: `200`
- Objeto con datos del dispositivo solicitado

**Validaciones**:
- [ ] Status code es 200
- [ ] Response contiene el dispositivo correcto
- [ ] `_id` coincide con el solicitado
- [ ] Todos los campos están presentes

---

#### TC-DISP-10: Obtener dispositivo con ID inexistente
**Prioridad**: Media  
**Endpoint**: `GET {{base_url}}/dispositivos/507f1f77bcf86cd799439099`

**Headers**:
```
Authorization: Bearer {{token}}
```

**Resultado esperado**:
- Status Code: `404`
- Mensaje: "Dispositivo no encontrado"

**Validaciones**:
- [ ] Status code es 404
- [ ] Response contiene mensaje apropiado

---

#### TC-DISP-11: Obtener dispositivo con ID inválido (formato)
**Prioridad**: Baja  
**Endpoint**: `GET {{base_url}}/dispositivos/invalid_id_123`

**Headers**:
```
Authorization: Bearer {{token}}
```

**Resultado esperado**:
- Status Code: `400` o `404`
- Mensaje: "ID inválido" o similar

**Validaciones**:
- [ ] Status code es 400 o 404
- [ ] Response indica error de formato

---

### 4.3 Casos de Prueba - Actualizar Dispositivo

#### TC-DISP-12: Actualizar dispositivo exitosamente
**Prioridad**: Alta  
**Endpoint**: `PUT {{base_url}}/dispositivos/{{dispositivo_id}}`

**Headers**:
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Datos de entrada**:
```json
{
  "name": "Laptop Dell Inspiron 15 - Actualizada",
  "status": "MANTENIMIENTO",
  "location": "Laboratorio B"
}
```

**Resultado esperado**:
- Status Code: `200`
- Dispositivo actualizado con nuevos valores
- Campos no enviados permanecen sin cambios

**Validaciones**:
- [ ] Status code es 200
- [ ] Campo `name` actualizado correctamente
- [ ] Campo `status` cambiado a "MANTENIMIENTO"
- [ ] Campo `location` actualizado
- [ ] Campos no modificados permanecen igual
- [ ] `updatedAt` es diferente al `createdAt`

---

#### TC-DISP-13: Actualizar dispositivo sin autenticación
**Prioridad**: Alta  
**Endpoint**: `PUT {{base_url}}/dispositivos/{{dispositivo_id}}`

**Datos de entrada**:
```json
{
  "status": "DISPONIBLE"
}
```

**Resultado esperado**:
- Status Code: `401`

**Validaciones**:
- [ ] Status code es 401
- [ ] Dispositivo NO se actualiza

---

#### TC-DISP-14: Actualizar dispositivo con estado inválido
**Prioridad**: Media  
**Endpoint**: `PUT {{base_url}}/dispositivos/{{dispositivo_id}}`

**Headers**:
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Datos de entrada**:
```json
{
  "status": "DESTRUIDO"
}
```

**Resultado esperado**:
- Status Code: `400`
- Mensaje: Estado no válido

**Validaciones**:
- [ ] Status code es 400
- [ ] Dispositivo NO se actualiza

---

#### TC-DISP-15: Actualizar dispositivo inexistente
**Prioridad**: Media  
**Endpoint**: `PUT {{base_url}}/dispositivos/507f1f77bcf86cd799439099`

**Headers**:
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Datos de entrada**:
```json
{
  "name": "No existe"
}
```

**Resultado esperado**:
- Status Code: `404`

**Validaciones**:
- [ ] Status code es 404

---

### 4.4 Casos de Prueba - Eliminar Dispositivo

#### TC-DISP-16: Eliminar dispositivo exitosamente
**Prioridad**: Alta  
**Endpoint**: `DELETE {{base_url}}/dispositivos/{{dispositivo_id}}`

**Headers**:
```
Authorization: Bearer {{token}}
```

**Resultado esperado**:
- Status Code: `200` o `204`
- Mensaje: "Dispositivo eliminado" o similar

**Validaciones**:
- [ ] Status code es 200 o 204
- [ ] Response confirma eliminación
- [ ] GET del mismo ID retorna 404

---

#### TC-DISP-17: Eliminar dispositivo sin autenticación
**Prioridad**: Alta  
**Endpoint**: `DELETE {{base_url}}/dispositivos/{{dispositivo_id}}`

**Resultado esperado**:
- Status Code: `401`

**Validaciones**:
- [ ] Status code es 401
- [ ] Dispositivo NO se elimina

---

#### TC-DISP-18: Eliminar dispositivo inexistente
**Prioridad**: Media  
**Endpoint**: `DELETE {{base_url}}/dispositivos/507f1f77bcf86cd799439099`

**Headers**:
```
Authorization: Bearer {{token}}
```

**Resultado esperado**:
- Status Code: `404`

**Validaciones**:
- [ ] Status code es 404

---

#### TC-DISP-19: Eliminar dispositivo con préstamos activos
**Prioridad**: Alta  
**Endpoint**: `DELETE {{base_url}}/dispositivos/{{dispositivo_id}}`

**Precondición**: Dispositivo tiene préstamos activos asociados

**Headers**:
```
Authorization: Bearer {{token}}
```

**Resultado esperado**:
- Status Code: `409` o `400`
- Mensaje: "No se puede eliminar dispositivo con préstamos activos"

**Validaciones**:
- [ ] Status code es 409 o 400
- [ ] Dispositivo NO se elimina
- [ ] Response indica conflicto con préstamos

---

## 5. Módulo de Préstamos

### 5.1 Casos de Prueba - Crear Préstamo

#### TC-PRES-01: Crear préstamo válido
**Prioridad**: Alta  
**Endpoint**: `POST {{base_url}}/prestamos`

**Headers**:
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Datos de entrada**:
```json
{
  "userId": "{{estudiante_id_test}}",
  "userRole": "ESTUDIANTE",
  "idClase": "{{materia_id_test}}",
  "status": "ACTIVO",
  "start": "2026-01-22T08:00:00Z",
  "end": "2026-01-22T10:00:00Z",
  "idDispositivo": "{{dispositivo_id}}",
  "code": "PRES-2026-001"
}
```

**Resultado esperado**:
- Status Code: `201`
- Préstamo creado con todas las relaciones correctas

**Validaciones**:
- [ ] Status code es 201
- [ ] Response contiene `_id`
- [ ] Campo `userId` coincide
- [ ] Campo `userRole` es "ESTUDIANTE"
- [ ] Campo `status` es "ACTIVO"
- [ ] Fechas `start` y `end` son correctas
- [ ] Campo `idDispositivo` referencia al dispositivo correcto
- [ ] Campo `code` es único

**Script Postman**:
```javascript
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Loan created successfully", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData._id).to.exist;
    pm.expect(jsonData.status).to.eql("ACTIVO");
    pm.environment.set("prestamo_id", jsonData._id);
});

pm.test("Dates are valid", function () {
    var jsonData = pm.response.json();
    pm.expect(new Date(jsonData.start)).to.be.below(new Date(jsonData.end));
});

pm.test("Response time is less than 1000ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(1000);
});
```

---

#### TC-PRES-02: Crear préstamo sin autenticación
**Prioridad**: Alta  
**Endpoint**: `POST {{base_url}}/prestamos`

**Datos de entrada**:
```json
{
  "userId": "{{estudiante_id_test}}",
  "userRole": "ESTUDIANTE",
  "status": "ACTIVO",
  "code": "PRES-2026-002"
}
```

**Resultado esperado**:
- Status Code: `401`

**Validaciones**:
- [ ] Status code es 401
- [ ] Préstamo NO se crea

---

#### TC-PRES-03: Crear préstamo con rol inválido
**Prioridad**: Media  
**Endpoint**: `POST {{base_url}}/prestamos`

**Headers**:
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Datos de entrada**:
```json
{
  "userId": "{{estudiante_id_test}}",
  "userRole": "ADMINISTRADOR",
  "idClase": "{{materia_id_test}}",
  "status": "ACTIVO",
  "start": "2026-01-22T08:00:00Z",
  "end": "2026-01-22T10:00:00Z",
  "idDispositivo": "{{dispositivo_id}}",
  "code": "PRES-2026-003"
}
```

**Resultado esperado**:
- Status Code: `400`
- Mensaje: Rol no válido

**Validaciones**:
- [ ] Status code es 400
- [ ] Response indica error de enum
- [ ] Roles válidos esperados: ESTUDIANTE, DOCENTE

---

#### TC-PRES-04: Crear préstamo con fechas inválidas (end antes de start)
**Prioridad**: Alta  
**Endpoint**: `POST {{base_url}}/prestamos`

**Headers**:
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Datos de entrada**:
```json
{
  "userId": "{{estudiante_id_test}}",
  "userRole": "ESTUDIANTE",
  "idClase": "{{materia_id_test}}",
  "status": "ACTIVO",
  "start": "2026-01-22T10:00:00Z",
  "end": "2026-01-22T08:00:00Z",
  "idDispositivo": "{{dispositivo_id}}",
  "code": "PRES-2026-004"
}
```

**Resultado esperado**:
- Status Code: `400`
- Mensaje: "Fecha de fin debe ser posterior a fecha de inicio"

**Validaciones**:
- [ ] Status code es 400
- [ ] Response indica error de validación de fechas
- [ ] Préstamo NO se crea

---

#### TC-PRES-05: Crear préstamo con campos faltantes
**Prioridad**: Media  
**Endpoint**: `POST {{base_url}}/prestamos`

**Headers**:
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Datos de entrada**:
```json
{
  "userId": "{{estudiante_id_test}}",
  "status": "ACTIVO"
}
```

**Resultado esperado**:
- Status Code: `400`
- Mensaje indicando campos requeridos

**Validaciones**:
- [ ] Status code es 400
- [ ] Response indica campos faltantes

---

#### TC-PRES-06: Crear préstamo con código duplicado
**Prioridad**: Media  
**Endpoint**: `POST {{base_url}}/prestamos`

**Precondición**: Ya existe un préstamo con code "PRES-2026-001"

**Headers**:
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Datos de entrada**:
```json
{
  "userId": "{{estudiante_id_test}}",
  "userRole": "ESTUDIANTE",
  "idClase": "{{materia_id_test}}",
  "status": "ACTIVO",
  "start": "2026-01-22T14:00:00Z",
  "end": "2026-01-22T16:00:00Z",
  "idDispositivo": "{{dispositivo_id}}",
  "code": "PRES-2026-001"
}
```

**Resultado esperado**:
- Status Code: `400` o `409`
- Mensaje: Código de préstamo duplicado

**Validaciones**:
- [ ] Status code es 400 o 409
- [ ] Response indica error de duplicado

---

#### TC-PRES-07: Crear préstamo con dispositivo inexistente
**Prioridad**: Alta  
**Endpoint**: `POST {{base_url}}/prestamos`

**Headers**:
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Datos de entrada**:
```json
{
  "userId": "{{estudiante_id_test}}",
  "userRole": "ESTUDIANTE",
  "idClase": "{{materia_id_test}}",
  "status": "ACTIVO",
  "start": "2026-01-22T08:00:00Z",
  "end": "2026-01-22T10:00:00Z",
  "idDispositivo": "507f1f77bcf86cd799439099",
  "code": "PRES-2026-005"
}
```

**Resultado esperado**:
- Status Code: `404` o `400`
- Mensaje: Dispositivo no encontrado

**Validaciones**:
- [ ] Status code es 404 o 400
- [ ] Response indica error de referencia

---

#### TC-PRES-08: Crear préstamo con estado inválido
**Prioridad**: Media  
**Endpoint**: `POST {{base_url}}/prestamos`

**Headers**:
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Datos de entrada**:
```json
{
  "userId": "{{estudiante_id_test}}",
  "userRole": "ESTUDIANTE",
  "idClase": "{{materia_id_test}}",
  "status": "CANCELADO_INCORRECTAMENTE",
  "start": "2026-01-22T08:00:00Z",
  "end": "2026-01-22T10:00:00Z",
  "idDispositivo": "{{dispositivo_id}}",
  "code": "PRES-2026-006"
}
```

**Resultado esperado**:
- Status Code: `400`
- Mensaje: Estado no válido

**Validaciones**:
- [ ] Status code es 400
- [ ] Estados válidos esperados: ACTIVO, FINALIZADO, MORA, CANCELADO

---

### 5.2 Casos de Prueba - Obtener Préstamos

#### TC-PRES-09: Obtener todos los préstamos con autenticación
**Prioridad**: Alta  
**Endpoint**: `GET {{base_url}}/prestamos`

**Headers**:
```
Authorization: Bearer {{token}}
```

**Resultado esperado**:
- Status Code: `200`
- Array de préstamos

**Validaciones**:
- [ ] Status code es 200
- [ ] Response es un array
- [ ] Cada préstamo tiene estructura correcta
- [ ] Al menos 1 préstamo en el array (si existen datos)

**Script Postman**:
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response is an array", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an('array');
});

pm.test("Each loan has required fields", function () {
    var jsonData = pm.response.json();
    if (jsonData.length > 0) {
        jsonData.forEach(loan => {
            pm.expect(loan).to.have.property('_id');
            pm.expect(loan).to.have.property('userId');
            pm.expect(loan).to.have.property('status');
            pm.expect(loan).to.have.property('code');
        });
    }
});

pm.test("Response time is less than 500ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(500);
});
```

---

#### TC-PRES-10: Obtener todos los préstamos sin autenticación
**Prioridad**: Alta  
**Endpoint**: `GET {{base_url}}/prestamos`

**Resultado esperado**:
- Status Code: `401`

**Validaciones**:
- [ ] Status code es 401

---

#### TC-PRES-11: Obtener préstamo por ID válido
**Prioridad**: Alta  
**Endpoint**: `GET {{base_url}}/prestamos/{{prestamo_id}}`

**Headers**:
```
Authorization: Bearer {{token}}
```

**Resultado esperado**:
- Status Code: `200`
- Objeto con datos del préstamo solicitado

**Validaciones**:
- [ ] Status code es 200
- [ ] Response contiene el préstamo correcto
- [ ] `_id` coincide con el solicitado
- [ ] Todos los campos están presentes
- [ ] Referencias a dispositivo, estudiante, materia son válidas

---

#### TC-PRES-12: Obtener préstamo con ID inexistente
**Prioridad**: Media  
**Endpoint**: `GET {{base_url}}/prestamos/507f1f77bcf86cd799439099`

**Headers**:
```
Authorization: Bearer {{token}}
```

**Resultado esperado**:
- Status Code: `404`
- Mensaje: "Préstamo no encontrado"

**Validaciones**:
- [ ] Status code es 404

---

#### TC-PRES-13: Obtener préstamo con ID inválido (formato)
**Prioridad**: Baja  
**Endpoint**: `GET {{base_url}}/prestamos/invalid_id`

**Headers**:
```
Authorization: Bearer {{token}}
```

**Resultado esperado**:
- Status Code: `400` o `404`
- Mensaje: "ID inválido"

**Validaciones**:
- [ ] Status code es 400 o 404

---

### 5.3 Casos de Prueba - Actualizar Préstamo

#### TC-PRES-14: Actualizar estado de préstamo a FINALIZADO
**Prioridad**: Alta  
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
- Status Code: `200`
- Préstamo actualizado con estado FINALIZADO

**Validaciones**:
- [ ] Status code es 200
- [ ] Campo `status` es "FINALIZADO"
- [ ] Otros campos permanecen sin cambios
- [ ] `updatedAt` actualizado

---

#### TC-PRES-15: Actualizar préstamo sin autenticación
**Prioridad**: Alta  
**Endpoint**: `PUT {{base_url}}/prestamos/{{prestamo_id}}`

**Datos de entrada**:
```json
{
  "status": "MORA"
}
```

**Resultado esperado**:
- Status Code: `401`

**Validaciones**:
- [ ] Status code es 401
- [ ] Préstamo NO se actualiza

---

#### TC-PRES-16: Actualizar estado de préstamo a MORA
**Prioridad**: Alta  
**Endpoint**: `PUT {{base_url}}/prestamos/{{prestamo_id}}`

**Headers**:
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Datos de entrada**:
```json
{
  "status": "MORA"
}
```

**Resultado esperado**:
- Status Code: `200`
- Préstamo actualizado con estado MORA

**Validaciones**:
- [ ] Status code es 200
- [ ] Campo `status` es "MORA"

---

#### TC-PRES-17: Actualizar préstamo con estado inválido
**Prioridad**: Media  
**Endpoint**: `PUT {{base_url}}/prestamos/{{prestamo_id}}`

**Headers**:
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Datos de entrada**:
```json
{
  "status": "ESTADO_INEXISTENTE"
}
```

**Resultado esperado**:
- Status Code: `400`
- Mensaje: Estado no válido

**Validaciones**:
- [ ] Status code es 400
- [ ] Préstamo NO se actualiza

---

#### TC-PRES-18: Actualizar fechas del préstamo
**Prioridad**: Media  
**Endpoint**: `PUT {{base_url}}/prestamos/{{prestamo_id}}`

**Headers**:
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Datos de entrada**:
```json
{
  "start": "2026-01-23T08:00:00Z",
  "end": "2026-01-23T12:00:00Z"
}
```

**Resultado esperado**:
- Status Code: `200`
- Fechas actualizadas correctamente

**Validaciones**:
- [ ] Status code es 200
- [ ] Campo `start` actualizado
- [ ] Campo `end` actualizado
- [ ] Fecha `end` es posterior a `start`

---

#### TC-PRES-19: Actualizar préstamo inexistente
**Prioridad**: Media  
**Endpoint**: `PUT {{base_url}}/prestamos/507f1f77bcf86cd799439099`

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
- Status Code: `404`

**Validaciones**:
- [ ] Status code es 404

---

### 5.4 Casos de Prueba - Eliminar Préstamo

#### TC-PRES-20: Eliminar préstamo exitosamente
**Prioridad**: Alta  
**Endpoint**: `DELETE {{base_url}}/prestamos/{{prestamo_id}}`

**Headers**:
```
Authorization: Bearer {{token}}
```

**Resultado esperado**:
- Status Code: `200` o `204`
- Mensaje: "Préstamo eliminado"

**Validaciones**:
- [ ] Status code es 200 o 204
- [ ] Response confirma eliminación
- [ ] GET del mismo ID retorna 404

---

#### TC-PRES-21: Eliminar préstamo sin autenticación
**Prioridad**: Alta  
**Endpoint**: `DELETE {{base_url}}/prestamos/{{prestamo_id}}`

**Resultado esperado**:
- Status Code: `401`

**Validaciones**:
- [ ] Status code es 401
- [ ] Préstamo NO se elimina

---

#### TC-PRES-22: Eliminar préstamo inexistente
**Prioridad**: Media  
**Endpoint**: `DELETE {{base_url}}/prestamos/507f1f77bcf86cd799439099`

**Headers**:
```
Authorization: Bearer {{token}}
```

**Resultado esperado**:
- Status Code: `404`

**Validaciones**:
- [ ] Status code es 404

---

#### TC-PRES-23: Eliminar préstamo activo
**Prioridad**: Alta  
**Endpoint**: `DELETE {{base_url}}/prestamos/{{prestamo_id}}`

**Precondición**: Préstamo tiene status "ACTIVO"

**Headers**:
```
Authorization: Bearer {{token}}
```

**Resultado esperado**:
- Puede variar según reglas de negocio:
  - Opción A: `409` - No se puede eliminar préstamo activo
  - Opción B: `200` - Se permite eliminar

**Validaciones**:
- [ ] Comportamiento consistente con reglas de negocio
- [ ] Si se permite: status code es 200
- [ ] Si no se permite: status code es 409

---

## 6. Casos de Prueba - Integración entre Módulos

### TC-INT-01: Flujo completo - Crear dispositivo y préstamo
**Prioridad**: Alta

**Descripción**: Simula el flujo completo de crear un dispositivo y luego crear un préstamo usando ese dispositivo.

**Pasos**:
1. Crear dispositivo (POST /dispositivos)
2. Verificar dispositivo creado (GET /dispositivos/:id)
3. Crear préstamo usando el dispositivo (POST /prestamos)
4. Verificar préstamo creado (GET /prestamos/:id)
5. Verificar relación dispositivo-préstamo

**Validaciones**:
- [ ] Todos los pasos se completan exitosamente
- [ ] El préstamo referencia correctamente al dispositivo
- [ ] El dispositivo puede cambiar estado a "EN_USO" (si aplica)

---

### TC-INT-02: Actualizar estado del dispositivo y verificar préstamos
**Prioridad**: Alta

**Descripción**: Verificar consistencia al cambiar estado del dispositivo que tiene préstamos.

**Pasos**:
1. Crear dispositivo con status "DISPONIBLE"
2. Crear préstamo activo con ese dispositivo
3. Intentar cambiar dispositivo a "MANTENIMIENTO"

**Validaciones**:
- [ ] Sistema maneja correctamente el cambio de estado
- [ ] Préstamo activo se mantiene o se notifica el conflicto

---

### TC-INT-03: Eliminar dispositivo con préstamos históricos
**Prioridad**: Media

**Descripción**: Verificar comportamiento al eliminar dispositivo que tuvo préstamos finalizados.

**Pasos**:
1. Crear dispositivo
2. Crear préstamo y finalizarlo (status "FINALIZADO")
3. Intentar eliminar el dispositivo

**Validaciones**:
- [ ] Sistema permite o rechaza según reglas de negocio
- [ ] Integridad referencial se mantiene

---

### TC-INT-04: Préstamo con fechas solapadas del mismo dispositivo
**Prioridad**: Alta

**Descripción**: Verificar si el sistema permite préstamos solapados.

**Pasos**:
1. Crear préstamo 1: 22/01/2026 08:00-10:00 (ACTIVO)
2. Intentar crear préstamo 2: 22/01/2026 09:00-11:00 (ACTIVO) con mismo dispositivo

**Resultado esperado**: Dependiendo de reglas de negocio
- Opción A: Se rechaza (409 Conflict)
- Opción B: Se permite

**Validaciones**:
- [ ] Comportamiento consistente con reglas de negocio
- [ ] Sistema previene conflictos si es requerido

---

## 7. Casos Edge y Validación de Datos

### TC-EDGE-01: Dispositivo con caracteres especiales
**Prioridad**: Baja  
**Endpoint**: `POST {{base_url}}/dispositivos`

**Datos de entrada**:
```json
{
  "name": "Cámara GoPro™ HERO® 11",
  "type": "CAMARA",
  "model": "HERO 11 Black",
  "serialNumber": "SN-2026-ÑÁÉ",
  "status": "DISPONIBLE",
  "location": "Sala #123 - Edificio B"
}
```

**Validaciones**:
- [ ] Status code es 201
- [ ] Caracteres especiales se guardan correctamente
- [ ] Se pueden recuperar sin problemas

---

### TC-EDGE-02: Longitud máxima de campos
**Prioridad**: Baja  
**Endpoint**: `POST {{base_url}}/dispositivos`

**Datos de entrada**:
```json
{
  "name": "A".repeat(500),
  "type": "LAPTOP",
  "model": "Model",
  "serialNumber": "SN-MAX",
  "status": "DISPONIBLE"
}
```

**Validaciones**:
- [ ] Sistema rechaza o trunca campos muy largos
- [ ] Status code apropiado (400 o 201)

---

### TC-EDGE-03: Fechas límite en préstamos
**Prioridad**: Media  
**Endpoint**: `POST {{base_url}}/prestamos`

**Casos a probar**:
- Fecha de inicio en el pasado
- Fecha de fin muy lejana en el futuro
- Préstamo de 1 minuto de duración
- Préstamo de varios meses

**Validaciones**:
- [ ] Sistema valida fechas según reglas de negocio
- [ ] Mensajes de error apropiados

---

### TC-EDGE-04: Préstamo con código muy largo
**Prioridad**: Baja  
**Endpoint**: `POST {{base_url}}/prestamos`

**Datos de entrada**:
```json
{
  "code": "PRES-" + "X".repeat(1000),
  "..."
}
```

**Validaciones**:
- [ ] Sistema rechaza o trunca códigos muy largos

---

## 8. Matriz de Trazabilidad

| ID | Módulo | Funcionalidad | Prioridad | Estado |
|----|--------|---------------|-----------|---------|
| TC-DISP-01 | Dispositivos | Crear válido | Alta | ⬜ |
| TC-DISP-02 | Dispositivos | Crear sin auth | Alta | ⬜ |
| TC-DISP-03 | Dispositivos | Campos faltantes | Media | ⬜ |
| TC-DISP-04 | Dispositivos | Tipo inválido | Media | ⬜ |
| TC-DISP-05 | Dispositivos | Serial duplicado | Alta | ⬜ |
| TC-DISP-06 | Dispositivos | Estado inválido | Media | ⬜ |
| TC-DISP-07 | Dispositivos | Obtener todos | Alta | ⬜ |
| TC-DISP-08 | Dispositivos | Obtener sin auth | Alta | ⬜ |
| TC-DISP-09 | Dispositivos | Obtener por ID | Alta | ⬜ |
| TC-DISP-10 | Dispositivos | ID inexistente | Media | ⬜ |
| TC-DISP-11 | Dispositivos | ID inválido | Baja | ⬜ |
| TC-DISP-12 | Dispositivos | Actualizar | Alta | ⬜ |
| TC-DISP-13 | Dispositivos | Actualizar sin auth | Alta | ⬜ |
| TC-DISP-14 | Dispositivos | Estado inválido | Media | ⬜ |
| TC-DISP-15 | Dispositivos | Actualizar inexistente | Media | ⬜ |
| TC-DISP-16 | Dispositivos | Eliminar | Alta | ⬜ |
| TC-DISP-17 | Dispositivos | Eliminar sin auth | Alta | ⬜ |
| TC-DISP-18 | Dispositivos | Eliminar inexistente | Media | ⬜ |
| TC-DISP-19 | Dispositivos | Eliminar con préstamos | Alta | ⬜ |
| TC-PRES-01 | Préstamos | Crear válido | Alta | ⬜ |
| TC-PRES-02 | Préstamos | Crear sin auth | Alta | ⬜ |
| TC-PRES-03 | Préstamos | Rol inválido | Media | ⬜ |
| TC-PRES-04 | Préstamos | Fechas inválidas | Alta | ⬜ |
| TC-PRES-05 | Préstamos | Campos faltantes | Media | ⬜ |
| TC-PRES-06 | Préstamos | Código duplicado | Media | ⬜ |
| TC-PRES-07 | Préstamos | Dispositivo inexistente | Alta | ⬜ |
| TC-PRES-08 | Préstamos | Estado inválido | Media | ⬜ |
| TC-PRES-09 | Préstamos | Obtener todos | Alta | ⬜ |
| TC-PRES-10 | Préstamos | Obtener sin auth | Alta | ⬜ |
| TC-PRES-11 | Préstamos | Obtener por ID | Alta | ⬜ |
| TC-PRES-12 | Préstamos | ID inexistente | Media | ⬜ |
| TC-PRES-13 | Préstamos | ID inválido | Baja | ⬜ |
| TC-PRES-14 | Préstamos | Actualizar a FINALIZADO | Alta | ⬜ |
| TC-PRES-15 | Préstamos | Actualizar sin auth | Alta | ⬜ |
| TC-PRES-16 | Préstamos | Actualizar a MORA | Alta | ⬜ |
| TC-PRES-17 | Préstamos | Estado inválido | Media | ⬜ |
| TC-PRES-18 | Préstamos | Actualizar fechas | Media | ⬜ |
| TC-PRES-19 | Préstamos | Actualizar inexistente | Media | ⬜ |
| TC-PRES-20 | Préstamos | Eliminar | Alta | ⬜ |
| TC-PRES-21 | Préstamos | Eliminar sin auth | Alta | ⬜ |
| TC-PRES-22 | Préstamos | Eliminar inexistente | Media | ⬜ |
| TC-PRES-23 | Préstamos | Eliminar activo | Alta | ⬜ |
| TC-INT-01 | Integración | Flujo completo | Alta | ⬜ |
| TC-INT-02 | Integración | Estado dispositivo | Alta | ⬜ |
| TC-INT-03 | Integración | Eliminar con históricos | Media | ⬜ |
| TC-INT-04 | Integración | Préstamos solapados | Alta | ⬜ |
| TC-EDGE-01 | Validación | Caracteres especiales | Baja | ⬜ |
| TC-EDGE-02 | Validación | Longitud máxima | Baja | ⬜ |
| TC-EDGE-03 | Validación | Fechas límite | Media | ⬜ |
| TC-EDGE-04 | Validación | Código largo | Baja | ⬜ |

**Total de casos**: 50

---

## 9. Resumen Estadístico

### Por Módulo
| Módulo | Casos | Alta | Media | Baja |
|--------|-------|------|-------|------|
| Dispositivos | 19 | 11 | 7 | 1 |
| Préstamos | 23 | 13 | 9 | 1 |
| Integración | 4 | 3 | 1 | 0 |
| Edge Cases | 4 | 0 | 1 | 3 |
| **Total** | **50** | **27** | **18** | **5** |

### Por Tipo de Operación
| Operación | Cantidad |
|-----------|----------|
| CREATE (POST) | 15 |
| READ (GET) | 12 |
| UPDATE (PUT) | 10 |
| DELETE | 9 |
| Integración | 4 |

---

## 10. Instrucciones de Ejecución

### 10.1 Preparación
1. ✅ Levantar servidor backend
2. ✅ Verificar conexión a MongoDB
3. ✅ Obtener token JWT válido (endpoint /login)
4. ✅ Configurar variables de entorno en Postman
5. ✅ Crear datos de prueba necesarios (estudiante y materia)

### 10.2 Orden de Ejecución Recomendado
1. **Dispositivos - CRUD básico** (TC-DISP-01 a TC-DISP-06)
2. **Dispositivos - Lectura** (TC-DISP-07 a TC-DISP-11)
3. **Dispositivos - Actualización** (TC-DISP-12 a TC-DISP-15)
4. **Préstamos - Creación** (TC-PRES-01 a TC-PRES-08)
5. **Préstamos - Lectura** (TC-PRES-09 a TC-PRES-13)
6. **Préstamos - Actualización** (TC-PRES-14 a TC-PRES-19)
7. **Dispositivos - Eliminación** (TC-DISP-16 a TC-DISP-19)
8. **Préstamos - Eliminación** (TC-PRES-20 a TC-PRES-23)
9. **Integración** (TC-INT-01 a TC-INT-04)
10. **Edge Cases** (TC-EDGE-01 a TC-EDGE-04)

### 10.3 Registro de Resultados
- Marcar checkbox (✅) al completar cada validación
- Anotar observaciones en casos fallidos
- Capturar screenshots de errores
- Documentar bugs en sección de Reporte de Errores

---

## 11. Criterios de Aceptación

### Criterios de Éxito Global
- ✅ 100% de casos de autenticación/autorización exitosos
- ✅ 95% de casos CRUD exitosos
- ✅ 100% de validaciones de datos funcionando
- ✅ Tiempos de respuesta dentro de límites establecidos

### Criterios por Módulo

#### Dispositivos
- ✅ CRUD completo funcional
- ✅ Validación de campos únicos (serialNumber)
- ✅ Validación de enums (type, status)
- ✅ Protección por autenticación

#### Préstamos
- ✅ CRUD completo funcional
- ✅ Validación de fechas
- ✅ Validación de referencias (dispositivo, estudiante, materia)
- ✅ Validación de enums (userRole, status)
- ✅ Código único por préstamo

### Criterios de Fallo
- ❌ Endpoints sin autenticación apropiada
- ❌ Datos no validados correctamente
- ❌ Referencias rotas entre entidades
- ❌ Errores 500 en operaciones normales
- ❌ Pérdida de integridad referencial

---

## 12. Riesgos y Mitigación

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Datos de prueba inconsistentes | Media | Alto | Crear script de inicialización de datos |
| Token JWT expirado durante pruebas | Alta | Medio | Renovar token antes de cada sesión |
| Referencias rotas entre colecciones | Media | Alto | Validar referencias antes de eliminar |
| Falta de validaciones en backend | Media | Alto | Documentar y reportar en cada caso |
| Cambios en API durante pruebas | Baja | Alto | Versionar endpoints y mantener comunicación |

---

## 13. Reporte de Errores

### Template de Bug Report
```markdown
**ID**: BUG-XXX
**Fecha**: DD/MM/YYYY
**Caso de prueba**: TC-XXX-XX
**Severidad**: Crítica | Alta | Media | Baja
**Módulo**: Dispositivos | Préstamos

**Descripción**:
[Descripción clara del problema]

**Pasos para reproducir**:
1. [Paso 1]
2. [Paso 2]
3. [Paso 3]

**Resultado esperado**:
[Qué debería suceder]

**Resultado obtenido**:
[Qué sucedió realmente]

**Evidencia**:
[Screenshots, logs, response body]

**Ambiente**:
- SO: Windows/Linux/Mac
- Backend: Puerto 3001
- MongoDB: Versión X.X
```

---

## 14. Herramientas y Recursos

### Herramientas Requeridas
- **Postman**: v10.0 o superior
- **Node.js**: Para backend
- **MongoDB**: Base de datos
- **Git**: Control de versiones

### Recursos Adicionales
- Documentación de API
- Esquemas de modelos (Mongoose)
- Colección Postman exportada
- Scripts de inicialización de datos

---

## 15. Glosario

| Término | Definición |
|---------|------------|
| CRUD | Create, Read, Update, Delete |
| JWT | JSON Web Token - Token de autenticación |
| Endpoint | URL de API para operaciones específicas |
| Status Code | Código HTTP de respuesta (200, 400, 500, etc.) |
| Payload | Datos enviados en el cuerpo de la petición |
| Edge Case | Caso límite o extremo en pruebas |
| Enum | Enumeración - Conjunto limitado de valores válidos |

---

## 16. Control de Cambios

| Versión | Fecha | Autor | Cambios |
|---------|-------|-------|---------|
| 1.0 | 21/01/2026 | Equipo G2 | Creación inicial del plan |

---

## 17. Aprobaciones

| Rol | Nombre | Fecha | Firma |
|-----|--------|-------|-------|
| Líder de Proyecto | | | |
| QA Lead | | | |
| Desarrollador Backend | | | |

---

**Fin del Plan de Pruebas Unitarias - Dispositivos y Préstamos**
