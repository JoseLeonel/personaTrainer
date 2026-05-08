# Arquitectura y Roadmap: E-Forge Personal Trainer App

Este documento detalla el plan maestro y la arquitectura del sistema para construir una plataforma integral donde el entrenador controla el entrenamiento, nutrición, progreso y comunicación del cliente desde un solo lugar. Se posiciona como una **"Herramienta para que el entrenador gane más dinero y pierda menos clientes"**.

## Arquitectura del Sistema (Backend NestJS + Frontend React)

### Principio de Diseño: Arquitectura Hexagonal (Ports & Adapters)
El backend está diseñado bajo la **Arquitectura Hexagonal**, asegurando que:
1. **Dominio Centralizado:** La lógica de negocio y las entidades no dependen de bases de datos ni frameworks externos.
2. **Puertos e Interfaces:** Toda comunicación con la BD (PostgreSQL) o APIs de terceros se define a través de contratos (interfaces).
3. **Adaptadores:** TypeORM y los Controladores NestJS actúan puramente como adaptadores, facilitando el cambio tecnológico a futuro y pruebas unitarias aisladas.

### Módulo 1: Gestión de Clientes y Finanzas (El Core del Negocio)
- **Ficha Completa:** Datos físicos, objetivos, historial de lesiones.
- **Estado del Cliente:** Activo/Inactivo, Al día/Atrasado en pagos, Nivel de compromiso.
- **Control Financiero:** Ver pagos, estado de membresía, alertas de cobro, historial de pagos.

### Módulo 2: Creación y Gestión de Rutinas
- Creación de rutinas por Día, Semana, y Fase (ej. volumen, definición).
- **Plantillas reutilizables** para optimizar el tiempo del entrenador.
- Ejercicios con series, reps, descanso, peso sugerido, y notas técnicas.

### Módulo 3: Monitoreo del Cumplimiento (Semáforo)
- Visualizar quién entrenó hoy y quién no.
- **Semáforo del Cliente:** 
  - 🟢 **Verde:** Cumple entrenos y dieta.
  - 🟡 **Amarillo:** Está fallando poco.
  - 🔴 **Rojo:** Lleva varios días sin cumplir.

### Módulo 4: Seguimiento del Progreso y Ajustes Dinámicos
- Gráficas de peso, medidas, fuerza (progresión de cargas) y evolución por semanas.
- Fotos comparativas.
- **Ajustes Dinámicos:** Modificar rutina en tiempo real, cambiar macros/calorías, y ajustar carga según el desempeño.

### Módulo 5: Comunicación Directa y Evaluaciones
- **Chat Integrado:** Mensajes, audios, videos, respuestas rápidas.
- **Check-ins Semanales:** ¿Cumpliste entrenos? ¿Cómo te sentiste? Nivel de energía, hambre y estrés.
- Registro Diario de "Entrenamiento completado" con comentarios de cómo se sintió.

### Módulo 6: Agenda y Reportes
- Programar sesiones y control de asistencia.
- Reportes Inteligentes: Clientes activos vs inactivos, tasa de abandono, clientes en riesgo.

### Módulo 7: Inteligencia Artificial (AI Coach) y Automatización
- Alertas automáticas ("Cliente sin entrenar 3 días").
- Sugerencias de ajustes ("Aumentar calorías").
- Resumen semanal automático.

---

## Plan de Ejecución Inmediata (Fase 1: Core de Entrenamiento)

Para no saturar el sistema, comenzaremos construyendo la **Fase 1**, que establece la base de datos de PostgreSQL y conecta la interfaz de registro de entrenamiento.

#### Entidades a Crear en Fase 1:
1. `User` (Roles, Status, Semáforo, Pagos).
2. `Exercise` (Catálogo con media).
3. `WeeklyPlan` y `Workout` (Rutinas personalizadas, Plantillas).
4. `WorkoutExercise` (Metas, descanso, auto-peso).
5. `Set` (Checklist, reps logradas).
6. `Measurement` (Peso corporal).
7. `DailyLog` (Check-ins, Feedback).
