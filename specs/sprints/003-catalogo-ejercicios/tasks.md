# Tasks: Catálogo de Ejercicios

- `[x]` **1. Backend: Entidades y Base de Datos**
  - `[x]` Modificar `backend/src/entities/exercise.entity.ts` con todos los nuevos campos (General, Técnica, Multimedia).
  - `[x]` Validar sincronización correcta de TypeORM con PostgreSQL.

- `[x]` **2. Backend: Arquitectura Hexagonal**
  - `[x]` Crear directorio `backend/src/exercises/domain/ports/` y definir `exercise.repository.port.ts`.
  - `[x]` Crear directorio `backend/src/exercises/infrastructure/adapters/` e implementar `exercise.repository.ts`.
  - `[x]` Crear directorio `backend/src/exercises/application/` e implementar `exercises.service.ts` con lógica de negocio (duplicados, estado, validaciones).
  - `[x]` Crear controladores en `backend/src/exercises/infrastructure/exercises.controller.ts`.
  - `[x]` Configurar `exercises.module.ts` e importarlo en `app.module.ts`.

- `[x]` **3. Backend: Pruebas Unitarias**
  - `[x]` Escribir pruebas para `exercises.service.ts` validando RN-01, RN-14 (duplicados y cadencia).

- `[x]` **4. Frontend: Componentes Base**
  - `[x]` Crear `ExercisesCatalog.tsx` (Vista de listado/grilla).
  - `[x]` Crear `ExerciseForm.tsx` (Formulario de creación/edición) aplicando diseño Premium (bordes 9999px, glassmorphism).

- `[x]` **5. Frontend: Integración y Flujo**
  - `[x]` Integrar `ExercisesCatalog.tsx` en `TrainerDashboard.tsx` (`MAINTENANCE_EXERCISES`).
  - `[x]` Conectar formulario con API Backend (`POST` y `PUT`).
  - `[x]` Implementar lógica de activación/inactivación (`PATCH`).
  - `[x]` Filtros de búsqueda en la UI del catálogo.

- `[x]` **6. Pruebas Manuales / E2E**
  - `[x]` Verificar creación de ejercicio completo.
  - `[x]` Verificar validación de cadencia y campos obligatorios.
  - `[x]` Verificar visualización responsive en emulador móvil.
