# Feature Specification: Creación de Rutinas

**Feature Branch**: `004-crear-rutinas`  
**Created**: 2026-05-05  
**Status**: Draft  
**Input**: "crear-rutinas (Asignación de entrenamientos)"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Creación de Rutina por Cliente (Priority: P1)
Como Entrenador, quiero crear una rutina (Workout) para un cliente específico en un día particular, asignando los ejercicios que debe realizar con su peso y repeticiones objetivo.

**Independent Test**: POST a `/workouts` creando una rutina para un User ID específico.
**Acceptance Scenarios**:
1. **Given** un cliente activo, **When** el entrenador crea una rutina para el Lunes, **Then** el sistema asocia la rutina al cliente y crea los registros de `WorkoutExercise` correspondientes.

### User Story 2 - Definición de Series y Peso (Priority: P1)
Como Entrenador, quiero poder establecer las series, las repeticiones y el peso sugerido para cada ejercicio dentro de la rutina.

**Acceptance Scenarios**:
1. **Given** un ejercicio en una rutina, **When** el entrenador define 3 series de 10 reps con 50kg, **Then** el sistema lo guarda como parámetros iniciales para que el cliente lo vea en su app.

## Requirements *(mandatory)*
- **FR-001**: El sistema DEBE usar `Workout`, `WorkoutExercise` y `Set` de la base de datos.
- **FR-002**: Un Workout DEBE pertenecer a un Cliente (User) o a un `WeeklyPlan` (Plantilla).

## Arquitectura Hexagonal
Se crearán Puertos y Adaptadores para `WorkoutsService` y `RoutinesRepository`.
