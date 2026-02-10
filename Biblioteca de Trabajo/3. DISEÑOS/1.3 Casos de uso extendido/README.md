# 📄 Diagrama de Casos de Uso Extendido

Documentación de casos de uso del **Sistema de Préstamo de Dispositivos Audiovisuales**, incluyendo actores, flujos principales y alternativos.

---

## 🗂️ Versiones y Variantes

| Código del ECS | Nombre completo del ECS | Autor(es) del artefacto | Ruta en el repositorio Git | Línea base a la que pertenece | Tipo de ECS | Fecha de creación | Última fecha de modificación |
|----------------|------------------------|------------------------|---------------------------|------------------------------|-------------|------------------|------------------------------|
| CU | Casos de uso del sistema | Moisés Benalcázar, Stefany Díaz, Mateo Medranda | 227837_G2_ADS/DISEÑOS/1.3 Casos de uso | LBD | Documentación | 24/10/2025 | 10/12/2025 |

---

## 📝 Descripción del Artefacto

El documento de **Casos de Uso** incluye:

- 👥 **Actores del sistema:** Administrador, Usuario (estudiante o personal autorizado), Sistema de notificaciones.  
- 📌 **Casos de uso principales:** Registrar préstamo, Registrar devolución, Consultar inventario, Generar reportes de dispositivos.  
- 🔄 **Relaciones entre casos de uso:**  
  - Include: Validar disponibilidad → Registrar préstamo  
  - Extend: Alertas de retraso → Notificar al usuario  
- 🛤️ **Flujos principales y alternativos:**  
  - Flujo principal: Usuario solicita préstamo → Sistema valida → Actualización de inventario → Confirmación al usuario.  
  - Flujo alternativo: Usuario intenta préstamo de dispositivo no disponible → Sistema genera alerta → Sugerencia de reserva futura.

---

## 🔄 Historial de Cambios

| Versión | Fecha | Descripción del Cambio | Autor |
|---------|------|----------------------|-------|
| V1.0.0 | 24/10/2025 | Primera versión del documento de casos de uso | Equipo G4 |
| V2.0.0 | 06/12/2025 | Corrección de errores en actores y flujos | Equipo G4 |
| V3.0.0 | 10/12/2025 | Versión final aprobada | Equipo G4 |

---

## ⚙️ Control de Configuración

- **Verificado por:** Moisés Benalcázar (👤 Gestor de Configuración)  
- **Fecha de verificación:** 10/12/2025  
- **Estado:** Casos de uso verificados y aprobados  
- **Aprobado por Comité:** ✅ Sí  
- **Fecha de aprobación:** 10/12/2025  

---

## 🧪 Auditoría de Calidad (SQA)

- **Auditado por:** Mateo Medranda (🔍 Responsable SQA)  
- **Fecha de auditoría:** 10/12/2025  
- **Cumplimiento de estándares:** ✅ Cumple  
- **Observaciones:** Casos de uso con flujos alternativos correctamente definidos y cobertura completa de actores  
- **Revisión final:** 🟢 Aprobado  
- **Fecha revisión final:** 10/12/2025  
