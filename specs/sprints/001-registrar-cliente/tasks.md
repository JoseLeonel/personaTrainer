---
description: "Task list para el sprint de registro de cliente"
---

# Tasks: Registro de Cliente

**Input**: Design documents from `/specs/sprints/001-registrar-cliente/spec.md`
**Prerequisites**: Entidades base (`User`) ya definidas en TypeORM, base de datos en funcionamiento, e interfaz base en React.

**Organization**: Las tareas están agrupadas por historia de usuario para permitir la implementación y prueba independiente de cada historia.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Asegurar que las dependencias base de la BD y la estructura están listas.

- [x] T001 [P] Configurar el archivo `.env` localmente con credenciales de PostgreSQL.
- [x] T002 Ejecutar script de seed o inserción manual de al menos un Entrenador (Admin/Trainer) en la base de datos.
- [x] T003 Configurar Auth module básico o rutas sin protección temporalmente para permitir el registro público.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestructura central que DEBE estar completa antes de implementar las historias de usuario.

- [x] T004 Crear/Verificar que la entidad `User` incluye correctamente los roles, estados y la relación recursiva (`trainer` y `clients`).
- [x] T005 Sincronizar TypeORM con PostgreSQL para tener la tabla de usuarios lista.

**Checkpoint**: Foundation ready - se puede comenzar con las historias de usuario.

---

## Phase 3: User Story 1 - Registro de Nuevo Cliente (Priority: P1) 🎯 MVP

**Goal**: Un nuevo cliente puede registrarse y seleccionar a su entrenador personal.

**Independent Test**: Se puede verificar enviando una petición POST de registro y luego observando que en la base de datos el estado del usuario es `PENDING_APPROVAL`.

### Implementation for User Story 1

- [x] T006 [P] [US1] Backend: Crear endpoint `GET /auth/trainers` para listar entrenadores disponibles en el dropdown.
- [x] T007 [P] [US1] Backend: Crear endpoint `POST /auth/register` que asigne automáticamente rol `CLIENT` y estado `PENDING_APPROVAL`.
- [x] T008 [US1] Frontend: Crear componente visual de Registro con formulario (nombre, email, password) y dropdown de entrenador.
- [x] T009 [US1] Frontend: Conectar el formulario de registro con la API para crear la cuenta.
- [x] T010 [US1] Frontend: Implementar redirección o mensaje de éxito informando que debe ser aprobado.

**Checkpoint**: User Story 1 completamente funcional y probable de forma independiente.

---

## Phase 4: User Story 2 - Aprobación de Cliente por el Entrenador (Priority: P1)

**Goal**: El entrenador personal puede ver sus clientes pendientes y aprobarlos.

**Independent Test**: El entrenador hace clic en "Aprobar" y el cliente cambia su estado, permitiéndole iniciar sesión posteriormente.

### Implementation for User Story 2

- [x] T011 [P] [US2] Backend: Crear endpoint `GET /clients/pending` (o filtrado en el endpoint existente) para listar clientes con estado `PENDING_APPROVAL`.
- [x] T012 [P] [US2] Backend: Crear endpoint `PUT /clients/:id/approve` para cambiar el estado a `ACTIVE`.
- [x] T013 [US2] Frontend: Actualizar `TrainerDashboard.tsx` para llamar al endpoint de clientes pendientes o combinados.
- [x] T014 [US2] Frontend: Añadir un botón "Aprobar" en la UI de TrainerDashboard para clientes en estado PENDING.
- [x] T015 [US2] Frontend: Conectar el botón "Aprobar" al endpoint `PUT` y refrescar la tabla al completar.

**Checkpoint**: Las historias de usuario 1 y 2 están completas y operan en conjunto (registro y aprobación).

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Mejoras finales que afectan al flujo completo.

- [x] T016 Añadir validación visual y manejo de errores (ej. "Este correo ya está en uso") en el frontend.
- [x] T017 Proteger la aplicación cliente para no dejar entrar (o mostrar vista bloqueada) si se inicia sesión y el estado sigue siendo `PENDING_APPROVAL`.
