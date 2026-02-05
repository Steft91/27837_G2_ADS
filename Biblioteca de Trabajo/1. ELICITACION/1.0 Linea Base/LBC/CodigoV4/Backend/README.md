# Backend - Sistema de Préstamo de Dispositivos

**Versión 3.0**  
**Fecha:** 21 de enero de 2026

## Descripción
Este backend gestiona el préstamo de dispositivos tecnológicos (proyectores, laptops, pantallas, etc.) en una institución educativa. Permite a estudiantes solicitar dispositivos dentro de su horario de clases, y a técnicos gestionar y supervisar todos los préstamos, incluyendo solicitudes especiales y anulación de préstamos. El sistema garantiza la asignación automática y segura de dispositivos disponibles, evitando conflictos de concurrencia.

## Características principales
- **Asignación automática de dispositivos disponibles** por tipo, evitando duplicidad en solicitudes simultáneas.
- **Validación de horario:** los estudiantes solo pueden solicitar préstamos dentro de su horario de clases inscritas.
- **Gestión de roles:**
  - **Estudiante:** puede solicitar préstamo, ver historial y préstamo activo, ver dispositivos disponibles, ver su horario y materias inscritas, y anular su propia solicitud.
  - **Técnico/Admin:** puede ver todos los préstamos (normales y especiales), eliminar/anular cualquier préstamo, y gestionar dispositivos, materias, inscripciones y estudiantes.
- **Protección de endpoints:** todos los endpoints requieren autenticación por token JWT y validación de rol.
- **Auditoría y trazabilidad:** registro de fechas y estados de préstamos y dispositivos.

## Instalación y uso
1. Clona el repositorio y entra a la carpeta `Backend`.
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Configura el archivo `.env` con tus credenciales de MongoDB y usuarios admin/técnico:
   ```env
   MONGODB_URI=...
   JWT_SECRET=...
   ADMIN_EMAIL=admin@institucion.edu
   ADMIN_PASSWORD=admin123
   TECNICO_EMAIL=tecnico@institucion.edu
   TECNICO_PASSWORD=tecnico123
   ```
4. Inicia el servidor:
   ```bash
   node app.js
   ```

## Endpoints principales
> Todos requieren autenticación por token JWT en el header `Authorization: Bearer <token>` (excepto el login y registro inicial de estudiante).

### Autenticación
- `POST /api/login` — Iniciar sesión (estudiante, técnico, admin). Retorna token y rol.

### Préstamos
- `POST /api/prestamos` — Crear solicitud de préstamo. (**Estudiante**; asignación automática y validación de horario).
- `GET /api/prestamos` — Listar préstamos (Estudiante: solo los suyos; Técnico/Admin: todos).
- `GET /api/prestamos/historial` — Obtener historial completo de préstamos del usuario autenticado.
- `GET /api/prestamos/activo` — Obtener el préstamo activo actual del usuario autenticado (si existe).
- `GET /api/prestamos/:id` — Ver detalles de un préstamo específico.
- `PUT /api/prestamos/:id` — Actualizar estado de préstamo. (**Técnico/Admin**).
- `DELETE /api/prestamos/:id` — Anular/Eliminar préstamo. (Estudiante: solo el suyo; Técnico/Admin: cualquiera).

### Dispositivos
- `GET /api/dispositivos` — Listar todos los dispositivos disponibles.
- `POST /api/dispositivos` — Crear nuevo dispositivo. (**Técnico/Admin**).
- `GET /api/dispositivos/:id` — Obtener detalles de un dispositivo.
- `PUT /api/dispositivos/:id` — Actualizar información de dispositivo. (**Técnico/Admin**).
- `DELETE /api/dispositivos/:id` — Eliminar dispositivo. (**Técnico/Admin**).

### Estudiantes
- `POST /api/estudiantes` — Registrar nuevo estudiante (Público).
- `GET /api/estudiantes` — Listar todos los estudiantes. (**Técnico/Admin**).
- `GET /api/estudiantes/:id` — Ver perfil de estudiante. (Propio o Técnico/Admin).
- `PUT /api/estudiantes/:id` — Actualizar datos de estudiante. (Propio o Técnico/Admin).
- `DELETE /api/estudiantes/:id` — Eliminar estudiante. (**Técnico/Admin**).

### Materias
- `GET /api/materias` — Listar todas las materias.
- `POST /api/materias` — Crear nueva materia. (**Técnico/Admin**).
- `GET /api/materias/:id` — Ver detalles de una materia.
- `PUT /api/materias/:id` — Actualizar materia. (**Técnico/Admin**).
- `DELETE /api/materias/:id` — Eliminar materia. (**Técnico/Admin**).

### Inscripciones
- `GET /api/inscripciones` — Listar todas las inscripciones.
- `POST /api/inscripciones` — Crear nueva inscripción estudiante-materia. (**Técnico/Admin**).
- `GET /api/inscripciones/:id` — Ver detalles de una inscripción.
- `PUT /api/inscripciones/:id` — Actualizar inscripción. (**Técnico/Admin**).
- `DELETE /api/inscripciones/:id` — Eliminar inscripción. (**Técnico/Admin**).

## Notas técnicas
- El sistema utiliza **MongoDB** y **Mongoose** para persistencia.
- Todas las operaciones críticas usan transacciones para evitar conflictos de concurrencia.
- El frontend debe enviar el token JWT en cada petición protegida.

---
**Desarrollado por el equipo 27837_G2_ADS**
