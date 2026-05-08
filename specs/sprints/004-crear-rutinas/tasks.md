---
description: "Task list para Creación de Rutinas"
---

# Tasks: Creación de Rutinas

**Input**: `/specs/sprints/004-crear-rutinas/spec.md`

## Phase 1: Arquitectura Base
- [ ] T001 Revisar entidades `Workout`, `WorkoutExercise` y `Set` en TypeORM.
- [ ] T002 Crear puerto `IRoutineRepository` en `src/routines/domain/ports`.
- [ ] T003 Crear adaptador `RoutinesRepository` en `src/routines/infrastructure/adapters`.
- [ ] T004 Crear caso de uso `RoutinesService` en `src/routines/application`.
- [ ] T005 Conectar todo en `RoutinesModule`.

## Phase 2: Endpoints de Creación
- [ ] T006 [Backend] Crear `POST /routines/workout` que reciba el ID del cliente, día, y array de ejercicios con sus configuraciones.
- [ ] T007 [Backend] Implementar guardado transaccional en `RoutinesService` (Guardar Workout -> Guardar WorkoutExercises).
- [ ] T008 [Backend] Crear `GET /routines/client/:clientId` para listar las rutinas asignadas a un cliente.

## Phase 3: Frontend (Trainer Panel)
- [ ] T009 [Frontend] En el Dashboard de Entrenador, hacer funcional el botón "Rutina".
- [ ] T010 [Frontend] Crear vista/modal "Constructor de Rutina" con buscador de ejercicios.
- [ ] T011 [Frontend] Formulario dinámico para agregar series, repeticiones y peso por cada ejercicio añadido.
