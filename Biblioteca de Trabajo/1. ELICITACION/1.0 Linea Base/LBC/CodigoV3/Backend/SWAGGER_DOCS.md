# Documentación Swagger - API Préstamo de Dispositivos

## 📚 Acceso a la Documentación

Una vez que el servidor esté en ejecución, puedes acceder a la documentación interactiva de Swagger en:

```
http://localhost:3001/api/docs
```

## 🚀 Cómo Iniciar el Servidor

```bash
cd Backend
npm install
node app.js
```

## 🔑 Autenticación

La mayoría de los endpoints requieren autenticación mediante JWT (JSON Web Token).

### Pasos para autenticarte:

1. **Obtener un token**: Usa el endpoint `/api/login` con credenciales válidas
2. **Copiar el token**: Del campo `content.token` en la respuesta
3. **Autorizar en Swagger**: 
   - Haz clic en el botón "Authorize" 🔒 en la parte superior derecha
   - Ingresa el token en el formato: `Bearer <tu-token>`
   - Haz clic en "Authorize"

### Credenciales por defecto:

**Estudiante:**
- Email: El email de un estudiante registrado
- Password: La contraseña del estudiante

**Técnico:**
- Email: Definido en `.env` como `TECNICO_EMAIL`
- Password: Definido en `.env` como `TECNICO_PASSWORD`

**Admin:**
- Email: Definido en `.env` como `ADMIN_EMAIL`
- Password: Definido en `.env` como `ADMIN_PASSWORD`

## 📋 Endpoints Documentados

### 1. **Autenticación** (`/api/login`)
- `POST /api/login` - Iniciar sesión

### 2. **Dispositivos** (`/api/dispositivos`)
- `GET /api/dispositivos` - Listar todos los dispositivos
- `GET /api/dispositivos/:id` - Obtener un dispositivo por ID
- `POST /api/dispositivos` - Crear un dispositivo (TECNICO/ADMIN)
- `PUT /api/dispositivos/:id` - Actualizar un dispositivo (TECNICO/ADMIN)
- `DELETE /api/dispositivos/:id` - Eliminar un dispositivo (TECNICO/ADMIN)

### 3. **Estudiantes** (`/api/estudiantes`)
- `GET /api/estudiantes` - Listar todos los estudiantes (TECNICO/ADMIN)
- `GET /api/estudiantes/:id` - Obtener un estudiante por ID
- `POST /api/estudiantes` - Registrar un nuevo estudiante (público)
- `PUT /api/estudiantes/:id` - Actualizar un estudiante
- `DELETE /api/estudiantes/:id` - Eliminar un estudiante (TECNICO/ADMIN)

### 4. **Materias** (`/api/materias`)
- `GET /api/materias` - Listar todas las materias
- `GET /api/materias/:id` - Obtener una materia por ID
- `POST /api/materias` - Crear una materia (TECNICO/ADMIN)
- `PUT /api/materias/:id` - Actualizar una materia (TECNICO/ADMIN)
- `DELETE /api/materias/:id` - Eliminar una materia (TECNICO/ADMIN)

### 5. **Inscripciones** (`/api/inscripciones`)
- `GET /api/inscripciones` - Listar todas las inscripciones
- `GET /api/inscripciones/:id` - Obtener una inscripción por ID
- `POST /api/inscripciones` - Crear una inscripción (TECNICO/ADMIN)
- `PUT /api/inscripciones/:id` - Actualizar una inscripción (TECNICO/ADMIN)
- `DELETE /api/inscripciones/:id` - Eliminar una inscripción (TECNICO/ADMIN)

### 6. **Préstamos** (`/api/prestamos`)
- `GET /api/prestamos` - Listar préstamos (TECNICO/ADMIN ven todos, ESTUDIANTE solo los suyos)
- `GET /api/prestamos/:id` - Obtener un préstamo por ID
- `POST /api/prestamos` - Crear un préstamo (ESTUDIANTE)
- `PUT /api/prestamos/:id` - Actualizar un préstamo (TECNICO/ADMIN)
- `DELETE /api/prestamos/:id` - Anular un préstamo

## 🎯 Roles y Permisos

### ESTUDIANTE
- ✅ Crear préstamos
- ✅ Ver sus propios préstamos
- ✅ Anular sus propios préstamos
- ✅ Ver dispositivos, materias e inscripciones
- ✅ Actualizar su propio perfil

### TECNICO
- ✅ Todas las operaciones sobre dispositivos
- ✅ Todas las operaciones sobre estudiantes
- ✅ Todas las operaciones sobre materias
- ✅ Todas las operaciones sobre inscripciones
- ✅ Ver y actualizar todos los préstamos

### ADMIN
- ✅ Todos los permisos de TECNICO

## 🔧 Ejemplos de Uso

### Ejemplo 1: Login
```json
POST /api/login
{
  "email": "juan.perez@example.com",
  "password": "password123"
}
```

**Respuesta:**
```json
{
  "status": "success",
  "message": "Login exitoso",
  "content": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "role": "ESTUDIANTE"
  }
}
```

### Ejemplo 2: Crear un Dispositivo
```json
POST /api/dispositivos
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "type": "Laptop",
  "brand": "Dell",
  "model": "Inspiron 15",
  "location": "Laboratorio A",
  "status": "Disponible"
}
```

### Ejemplo 3: Crear un Préstamo
```json
POST /api/prestamos
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "dispositivoId": "65f1a9b4c12e3a001234abcd",
  "fechaDevolucion": "2026-02-01"
}
```

## 📦 Modelos de Datos

### Dispositivo
```json
{
  "_id": "string",
  "type": "string",
  "brand": "string",
  "model": "string",
  "location": "string",
  "status": "string",
  "createdAt": "date-time",
  "updatedAt": "date-time"
}
```

### Estudiante
```json
{
  "_id": "string",
  "name": "string",
  "email": "string",
  "password": "string",
  "career": "string",
  "createdAt": "date-time",
  "updatedAt": "date-time"
}
```

### Materia
```json
{
  "_id": "string",
  "name": "string",
  "location": "string",
  "start": "number",
  "end": "number",
  "days": ["string"]
}
```

### Inscripción
```json
{
  "_id": "string",
  "estudianteId": "string",
  "materiaId": "string",
  "date": "date"
}
```

### Préstamo
```json
{
  "_id": "string",
  "userId": "string",
  "userRole": "ESTUDIANTE | DOCENTE | ADMIN",
  "idClase": "string",
  "status": "ACTIVO | FINALIZADO | MORA | CANCELADO",
  "start": "date-time",
  "end": "date-time",
  "idDispositivo": "string",
  "code": "string",
  "createdAt": "date-time",
  "updatedAt": "date-time"
}
```

## 🛠️ Estructura de Respuestas

Todas las respuestas siguen el siguiente formato:

**Éxito:**
```json
{
  "status": "success",
  "message": "Mensaje descriptivo",
  "content": { /* datos */ }
}
```

**Error:**
```json
{
  "status": "error",
  "message": "Mensaje de error",
  "content": null
}
```

## 📝 Códigos de Estado HTTP

- `200 OK` - Operación exitosa
- `201 Created` - Recurso creado exitosamente
- `400 Bad Request` - Error en los datos enviados
- `401 Unauthorized` - No autenticado (falta token o es inválido)
- `403 Forbidden` - No autorizado (sin permisos para esta operación)
- `404 Not Found` - Recurso no encontrado
- `500 Internal Server Error` - Error del servidor

## 🔍 Probar la API

Puedes probar todos los endpoints directamente desde la interfaz de Swagger:

1. Navega a http://localhost:3001/api/docs
2. Encuentra el endpoint que quieres probar
3. Haz clic en el endpoint para expandirlo
4. Haz clic en "Try it out"
5. Completa los parámetros necesarios
6. Haz clic en "Execute"
7. Revisa la respuesta

## 📚 Recursos Adicionales

- **Swagger/OpenAPI**: https://swagger.io/docs/
- **JWT**: https://jwt.io/
- **MongoDB**: https://www.mongodb.com/docs/
- **Express.js**: https://expressjs.com/

---

**Versión**: 3.0  
**Última actualización**: 21 de enero de 2026
