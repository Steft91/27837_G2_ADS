## 💻 Línea Base LBC – Implementación (Código) - VERSIÓN FINAL 

La **Línea Base LBC** contiene todo el código fuente del sistema web para la gestión de préstamos de dispositivos institucionales de la Universidad de las Fuerzas Armadas ESPE.  
Incluye tanto el **Frontend** como el **Backend**, responsables de la interfaz de usuario, validaciones, lógica de negocio e integración con servicios institucionales.

---

### 📌 Versiones y Variantes

| Código del ECS | Nombre completo del ECS | Autor(es) del artefacto | Ruta en el repositorio Git | Línea base | Tipo de ECS | Fecha de creación | Última modificación |
|---------------|------------------------|-------------------------|----------------------------|------------|-------------|-------------------|---------------------|
| FE | Frontend – Sistema de Préstamos | Stefany Díaz, Moisés Benalcázar, Mateo Medranda | Biblioteca de Trabajo/LBC/Frontend/ | LBC | Código | 09/12/2025 | 30/12/2025 |
| BE | Backend – Sistema de Préstamos | Stefany Díaz, Moisés Benalcázar, Mateo Medranda | Biblioteca de Trabajo/LBC/Backend/ | LBC | Código | 09/12/2025 | 30/12/2025 |

---

### 📝 Descripción del Artefacto

La **Línea Base de Implementación** contiene:

- **Frontend**
  - Interfaces de usuario para estudiantes, docentes, administrativos y personal técnico
  - Formularios de solicitud y gestión de préstamos
  - Visualización del catálogo de dispositivos
  - Notificaciones y estados de préstamo

- **Backend**
  - Servicios de validación de usuarios institucionales
  - Lógica de negocio para asignación, liberación y cancelación de préstamos
  - Gestión de inventario y registro de daños
  - Generación de códigos únicos de préstamo
  - Control de fechas y horas para trazabilidad

---

### 📂 Estructura de Carpetas

```
LBC/
├── Frontend/                 # Interfaz de usuario del sistema
│   ├── src/                  # Código fuente
│   ├── assets/               # Recursos gráficos
│   └── ...
└── Backend/                  # Lógica del servidor
    ├── controllers/          # Controladores
    ├── services/             # Lógica de negocio
    ├── routes/               # Endpoints
    └── ...
```

---

### 🔄 Historial de Cambios

| Versión | Fecha | Descripción del Cambio | Autor |
|--------|------|------------------------|-------|
| V1.0 | 09/12/2025 | Estructura inicial del proyecto Frontend y Backend | Equipo de Desarrollo |
| V2.0 | 10/12/2025 | Implementación de módulos básicos de solicitud y validación | Equipo de Desarrollo |
| V3.0 | 15/12/2025 | Integración de reglas de negocio y control de estados | Equipo de Desarrollo |
| V4.0 | 30/12/2025 | Ajustes finales, refactorización y estabilización del código | Equipo de Desarrollo |

---

### 👥 Responsables

- 👩‍💻 **Líder del Proyecto:** Stefany Díaz  
- ⚙️ **Gestor de la Configuración:** Mateo Medranda  
- 🧪 **Responsable SQA:** Moisés Benalcázar  

---

### 🛠️ Control de Configuración

- ✔️ **Verificado por:** Mateo Medranda (Gestor de la Configuración)  
- 📅 **Fecha de verificación:** 30/12/2025  
- 📌 **Estado:** LBC conforme a los estándares definidos en el Plan de Gestión de la Configuración  

---

### 🔍 Auditoría de Calidad (SQA)

- 🧑‍🔬 **Auditado por:** Moisés Benalcázar (Responsable SQA)  
- 📅 **Fecha de auditoría:** 30/12/2025  
- ✅ **Cumplimiento de estándares:** Cumple  
- 📝 **Observaciones:**  
  El código fuente se encuentra correctamente versionado, organizado por módulos y alineado a los requisitos funcionales priorizados del sistema.
