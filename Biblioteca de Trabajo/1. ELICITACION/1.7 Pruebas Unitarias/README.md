# 📄 Pruebas Unitarias

Documentación de pruebas unitarias y plan de pruebas del proyecto **Sistema de Préstamo de Dispositivos Audiovisuales**.

---

## 🗂️ Versiones y Variantes

| Código del ECS | Nombre completo del ECS | Autor(es) del artefacto | Ruta en el repositorio Git | Línea base a la que pertenece | Tipo de ECS | Fecha de creación | Última fecha de modificación |
|----------------|------------------------|------------------------|---------------------------|------------------------------|-------------|------------------|------------------------------|
| PP | Plan de Pruebas | Stefany Díaz, Moisés Benalcazar, Mateo Medranda | 27835_G4_ADS/Biblioteca de Trabajo/1. ELICITACION/1.7 Pruebas Unitarias/ | - | Documentación | 09/02/2026 | 09/02/2026 |

---

## 📝 Descripción del Artefacto

Esta carpeta contiene la documentación relacionada con las pruebas del sistema:

- **Plan de Pruebas (PP):** Define la estrategia, alcance, recursos y cronograma de las actividades de prueba.  
- **Objetivo principal de la prueba:**  
  - Verificar la funcionalidad completa y robusta de los módulos de **Dispositivos** y **Préstamos**.  
  - Validar todas las operaciones CRUD y los flujos completos de negocio asociados a cada módulo.  
  - Proteger la integridad de los datos, evitando pérdidas, duplicados no deseados o corrupciones.  
  - Manejo adecuado de validaciones y errores, mostrando mensajes claros y evitando fallos silenciosos.  
  - Comprobar mecanismos de autenticación y autorización, asegurando que cada usuario pueda realizar solo las acciones permitidas.  

- **Criterios cuantitativos para considerar la fase exitosa:**  
  - Cobertura de casos de prueba ≥ 95% en los flujos relevantes.  
  - Aprobación del 100% de los casos críticos.  
  - Tiempo de respuesta < 500 ms en operaciones de consulta (GET).  
  - Tiempo de respuesta < 1000 ms en operaciones de escritura (POST, PUT, DELETE).  

---

## 🧰 Herramientas y Recursos

**Herramientas Requeridas:**  
- Postman: v10.0 o superior  
- Node.js: Para backend  
- MongoDB: Base de datos  
- Git: Control de versiones  

**Recursos Adicionales:**  
- Documentación de API  
- Esquemas de modelos (Mongoose)  
- Colección Postman exportada  
- Scripts de inicialización de datos  

---

## 🔄 Historial de Cambios

| Versión | Fecha | Descripción del Cambio | Autor |
|---------|------|----------------------|-------|
| V1.0 | 19/01/2026 | Versión inicial del Plan de Pruebas con objetivos, criterios y herramientas | Equipo G4 |

---

## 📁 Archivos

| Archivo | Versión | Descripción |
|--------|--------|-------------|
| Plan_de_Pruebas_v1.pdf | V1.0 | Plan de Pruebas del proyecto, incluyendo objetivos, criterios, casos de prueba y herramientas |

---

## ⚙️ Control de Configuración

- **Verificado por:** Moisés Benalcazar (👤 Gestor de Configuración)  
- **Fecha de verificación:** 03/02/2026  
- **Estado:** Documentación de pruebas integrada correctamente  
- **Aprobado por Comité:** ✅ Sí  
- **Fecha de aprobación:** 03/02/2026  
- **Observación:** Todos los artefactos de diseño han sido verificados y aprobados  

---

## 🧪 Auditoría de Calidad (SQA)

- **Auditado por:** Mateo Medranda (🔍 Responsable SQA)  
- **Fecha de auditoría:** 09/02/2026  
- **Cumplimiento de estándares:** ✅ Cumple  
- **Observaciones:** Casos de prueba con cobertura adecuada  
- **Revisión final:** 🟢 Aprobado  
- **Fecha revisión final:** 09/02/2026  
