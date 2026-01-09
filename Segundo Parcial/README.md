# Código Fuente (CF)

Este directorio contiene los archivos que forman parte del Elemento de Configuración del Software (ECS) correspondiente al código fuente del proyecto **Sistema de Préstamo de Proyectores ESPE**.

## Información del ECS

- **Código del ECS:** CF
- **Nombre del ECS:** Código Fuente - Sistema de Préstamo de Proyectores
- **Autores:** Moisés Benalcázar, Stefany Díaz, Mateo Medranda
- **Proyecto:** Sistema de Préstamo de Proyectores ESPE
- **Línea base:** LBD - Línea Base de Desarrollo
- **Localización:** c:\Users\Niño Moi\OneDrive\Escritorio\27837_G2_ADS\Segundo Parcial
- **Tipo de ECS:** Software (Código Fuente)
- **Fecha de creación:** 08/01/2026
- **ID del proyecto:** 27837_G2_ADS
- **NRC:** 27837

## Estructura del Código

### Backend (Spring Boot)
- **Tecnología:** Java + Spring Boot
- **Base de Datos:** PostgreSQL
- **Integración:** Sistema Banner ESPE
- **Funcionalidades:**
  - Autenticación institucional
  - API REST para gestión de préstamos
  - Control de disponibilidad de proyectores
  - Sistema de alertas y notificaciones
  - Gestión de sanciones automáticas

### Frontend (React/Vue.js)
- **Ubicación:** `/Segundo Parcial/Frontend`
- **Tecnología:** React con TypeScript
- **Características:**
  - Interfaz responsiva (móvil, tablet, desktop)
  - Consulta de disponibilidad en tiempo real
  - Gestión de solicitudes de préstamo
  - Panel técnico para entrega/devolución
  - Dashboard administrativo con reportes

## Historial de Versiones del Código Fuente

| Versión     | Fecha      | Responsable         | Aprobado por                                           | Cambios Principales                                    |
| ----------- | ---------- | ------------------- | ------------------------------------------------------ | ------------------------------------------------------ |
| `CF_V1.0.0` | 15/05/2025 | Moisés Benalcázar   | La versión fue aprobada por Stefany Díaz y Mateo Medranda | Implementación inicial: autenticación y solicitudes básicas |
| `CF_V1.0.1` | 28/06/2025 | Stefany Díaz        | La versión fue aprobada por Mateo Medranda             | Integración con Banner y asignación automática         |
| `CF_V1.0.2` | 15/07/2025 | Mateo Medranda      | La versión fue aprobada por Moisés Benalcázar y Stefany Díaz | Sistema de alertas, sanciones y generación de reportes |
| `CF_V1.1.0` | 08/08/2025 | Equipo completo     | Aprobado por el profesor Andrés Pillajo                | Refinamiento final y corrección de bugs               |

Estas versiones representan los hitos clave en el desarrollo del sistema, y cada una fue validada y aprobada antes de su integración.

## Requisitos Implementados

### Funcionales (RF)
- **RF-01:** Autenticación institucional (@espe.edu.ec)
- **RF-02:** Solicitud de préstamo por franja horaria
- **RF-03:** Asignación automática de proyectores
- **RF-04:** Registro de entrega y devolución
- **RF-05:** Consulta de disponibilidad
- **RF-06:** Generación de reportes
- **RF-07:** Alertas por retraso y gestión de sanciones

### No Funcionales (RNF)
- **RNF-01:** Alta disponibilidad (99% uptime en horario laboral)
- **RNF-02:** Interfaz responsiva (360px, 768px, 1080px)
- **RNF-03:** Seguridad de datos (AES-256)
- **RNF-04:** Tiempo de respuesta < 2 segundos
- **RNF-05:** Compatibilidad con navegadores modernos
- **RNF-06:** Automatización completa del flujo

## Comandos de Desarrollo

### Backend
```bash
# Compilar
mvn clean install

# Ejecutar
mvn spring-boot:run

# Tests
mvn test
```

### Frontend
```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build
npm run build

# Tests
npm test
```

## Documentación Relacionada

- **Casos de Uso:** Ver `/PREGAME/1. ELICITACION/1.5 Casos de Uso Extendido/`
- **Requisitos:** Ver documento `requisitos.md` en raíz
- **Plan de Gestión:** Ver documento en Tercer Parcial
- **Diseño:** Ver `/Biblioteca de Trabajo/3.DISEÑOS/`

## Notas Importantes

- Todo el código debe seguir las convenciones establecidas en el documento de estándares
- Los commits deben referenciar el requisito o caso de uso implementado
- Las pruebas unitarias son obligatorias para nuevas funcionalidades
- La documentación del código debe actualizarse con cada cambio significativo
