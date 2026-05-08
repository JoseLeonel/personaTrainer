# Implementation Plan: Catálogo de Ejercicios

## 1. Arquitectura Hexagonal Backend (NestJS)

Basado en la constitución, el módulo `exercises` se estructurará aislando el dominio de la infraestructura:

### Entidades y Base de Datos
- **`backend/src/entities/exercise.entity.ts`**: Expandir la entidad existente para incluir todos los atributos definidos en el modelo conceptual (RF-01 a RF-11):
  - `primaryMuscleGroup`, `secondaryMuscleGroup`, `exerciseType`, `difficultyLevel`, `equipment`, `description`, `executionInstructions`, `commonMistakes`.
  - `sets`, `repetitions`, `cadence`, `rir`, `restSeconds`, `timerEnabled`.
  - `mainImageUrl`, `galleryImages` (array), `videoUrl`, `externalVideoUrl`, `thumbnailUrl`.
  - `active`.

### Domain Layer (Puertos)
- **`backend/src/exercises/domain/ports/exercise.repository.port.ts`**: Definir la interfaz `IExerciseRepository` con métodos:
  - `create(exercise: Partial<Exercise>): Promise<Exercise>`
  - `findAll(filters: any): Promise<Exercise[]>`
  - `findById(id: number): Promise<Exercise>`
  - `update(id: number, data: Partial<Exercise>): Promise<Exercise>`
  - `toggleStatus(id: number): Promise<Exercise>`

### Application Layer (Casos de Uso)
- **`backend/src/exercises/application/exercises.service.ts`**: Implementar lógica de negocio (validaciones de RF-14, evitar duplicados, etc.) que orquesta el repositorio a través del puerto `IExerciseRepository`.

### Infrastructure Layer (Adaptadores)
- **`backend/src/exercises/infrastructure/adapters/exercise.repository.ts`**: Implementación TypeORM del `IExerciseRepository`.
- **`backend/src/exercises/infrastructure/exercises.controller.ts`**: Endpoints REST (`GET /exercises`, `POST /exercises`, `PUT /exercises/:id`, `PATCH /exercises/:id/status`).

### Módulo
- **`backend/src/exercises/exercises.module.ts`**: Registrar el controlador, el servicio, y el proveedor que inyecta el `ExerciseRepository` en el `IExerciseRepository`.

## 2. Frontend Premium 2026 (React + Vite)

El frontend respetará las reglas de UI/UX de la constitución:
- Colores enérgicos (Naranja Neón), paneles Glassmorphism.
- Inputs estilo celular (`border-radius: 9999px`, padding espacioso).

### Componentes
- **`frontend/src/ExercisesCatalog.tsx`**:
  - Vista en grilla estilo tarjetas de vidrio (glassmorphism) de los ejercicios.
  - Filtros en la parte superior.
  - Botón "Nuevo Ejercicio" destacado.
- **`frontend/src/ExerciseForm.tsx`**:
  - Formulario estructurado por secciones (General, Técnica, Multimedia).
  - Validaciones de campos requeridos y formatos (RF-14).
- **`frontend/src/TrainerDashboard.tsx`**:
  - Actualizar la sección `MAINTENANCE_EXERCISES` para renderizar el `ExercisesCatalog`.

## 3. Pruebas y Validación (Test-First)
- Escribir pruebas unitarias para `exercises.service.ts` validando la lógica de duplicados y cadencia.
- Validación manual E2E de creación y listado desde el frontend.
