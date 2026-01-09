# PREGAME

Esta carpeta contiene toda la documentación inicial del proyecto **Sistema de Préstamo de Proyectores ESPE**, correspondiente a la fase de análisis y planificación previa al desarrollo.

## Propósito

La fase PREGAME engloba todas las actividades de elicitación, análisis de requisitos, planificación y diseño inicial necesarias para establecer las bases sólidas del proyecto antes de iniciar la implementación.

## Contenido

### 1. ELICITACIÓN

Documentación relacionada con la captura y especificación de requisitos:

#### 1.1 Especificación RS
- **Documento SRS (Software Requirements Specification)**
- Requisitos Funcionales (RF-01 al RF-07):
  - RF-01: Autenticación institucional
  - RF-02: Solicitud de préstamo
  - RF-03: Asignación automática de proyector
  - RF-04: Registro de entrega y devolución
  - RF-05: Consulta de disponibilidad
  - RF-06: Reportes de uso
  - RF-07: Alertas por retraso y gestión de sanciones
- Requisitos No Funcionales (RNF-01 al RNF-06):
  - RNF-01: Alta disponibilidad (99% uptime)
  - RNF-02: Interfaz amigable y responsiva
  - RNF-03: Seguridad de datos (AES-256)
  - RNF-04: Tiempo de respuesta < 2s
  - RNF-05: Compatibilidad con navegadores
  - RNF-06: Automatización del flujo de préstamo

#### 1.2 Cronograma
- Planificación temporal del proyecto
- Distribución de sprints
- Hitos y entregables por parcial:
  - Primer Parcial: Requisitos y análisis
  - Segundo Parcial: Diseño e implementación frontend
  - Tercer Parcial: Integración y refinamiento

#### 1.3 Historias de Usuario
- User stories por rol del sistema:
  - **Estudiante:** Solicitud de préstamo dentro de franja horaria
  - **Docente:** Solicitud con/sin franja horaria + observación
  - **Administrativo:** Solicitud con fecha/hora específica
  - **Técnico:** Gestión de entregas y devoluciones
  - **Administrador:** Generación de reportes y análisis

#### 1.4 Actas de Reunión
- Reuniones con stakeholders
- Entrevistas con el Técnico de Audio y Video
- Validaciones con Coordinación Académica
- Acuerdos con Dirección de TIC
- Aprobaciones de la profesora Jenny Ruiz

#### 1.5 Casos de Uso Extendido
- **12 Casos de Uso Principales:**
  - CU-01: Iniciar sesión en el sistema
  - CU-02: Solicitar préstamo (Estudiante)
  - CU-03: Solicitar préstamo (Docente)
  - CU-04: Solicitar préstamo (Administrativo)
  - CU-05: Entregar dispositivo
  - CU-06: Devolver dispositivo
  - CU-07: Consultar catálogo de dispositivos
  - CU-08: Gestionar inventario de dispositivos
  - CU-09: Registrar dispositivo dañado
  - CU-10: Realizar revisión técnica en devolución
  - CU-11: Cancelar solicitud de préstamo
  - CU-12: Generar reportes
- **2 Casos de Uso Automáticos:**
  - CUA-01: Liberar solicitud por no retiro (20 min)
  - CUA-02: Notificar retrasos en devolución

#### 1.6 Backlog
- Product backlog inicial
- Priorización mediante técnica MoSCoW:
  - **Must Have:** RF-01, RF-02, RF-04, RNF-03
  - **Should Have:** RF-05, RF-06, RNF-02, RNF-05
  - **Could Have:** RNF-04
  - **Won't Have (por ahora):** RF-07
- Sprint planning
- Estimaciones de esfuerzo

#### 1.7 Reporte de Errores
- Plantilla de reporte de bugs
- Clasificación por severidad
- Estados: Nuevo, En revisión, Resuelto, Cerrado

#### 1.8 Prueba
- Plan de pruebas inicial
- Estrategia de testing
- Criterios de aceptación por requisito

#### 1.9 Arquitectura
- Arquitectura del sistema propuesta
- Diagrama de componentes
- Diagrama de despliegue
- Decisiones arquitectónicas:
  - Backend: Spring Boot (Java)
  - Frontend: React + TypeScript
  - Base de Datos: PostgreSQL
  - Integración: API REST con Banner ESPE

## Información del Proyecto

- **ID:** 27837_G2_ADS
- **Nombre:** Sistema de Préstamo de Proyectores ESPE
- **Curso:** Analisis y Diseño del Software
- **NRC:** 27837
- **Período:** OCTUBRE 2025 - MARZO 2026
- **Campus:** Matriz - Sangolquí
- **Profesor:** Jenny Ruiz

## Equipo de Trabajo

- **Moisés Benalcázar** - moises.benalcazar@espe.edu.ec
- **Stefany Díaz** - stefany.diaz@espe.edu.ec
- **Mateo Medranda** - mateo.medranda@espe.edu.ec

## Stakeholders Identificados

1. **Técnico de Audio y Video** - Gestión física de proyectores
2. **Coordinación Académica** - Validación de políticas de préstamo
3. **Dirección TIC** - Integración con sistemas institucionales
4. **Estudiantes** - Usuarios finales del sistema
5. **Docentes** - Usuarios con privilegios especiales
6. **Personal Administrativo** - Usuarios para gestión institucional

## Documentos de Referencia

- `requisitos.md` - Lista completa de requisitos con atributos
- `casos_de_uso.md` - Especificación detallada de casos de uso
- Plan de Gestión de Requisitos (Tercer Parcial)
- Matriz de trazabilidad Requisitos → Casos de Uso

## Estado de Documentación

**Fecha de última actualización:** 08/01/2026

- Requisitos funcionales: 7 documentados y aprobados
- Requisitos no funcionales: 6 documentados y aprobados
- Casos de uso: 14 completados (12 principales + 2 automáticos)
- Historias de usuario: Definidas para todos los roles
- Arquitectura: Diseño aprobado
- Cronograma: Planificación completa del semestre
- Backlog: Priorizado mediante MoSCoW

## Próximos Pasos

1. Revisión final de requisitos con stakeholders
2. Transición de documentos aprobados a Biblioteca Maestra
3. Inicio de la fase de implementación (Segundo Parcial)
4. Configuración del entorno de desarrollo
5. Primera iteración de desarrollo del backend
