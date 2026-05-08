---
description: "Task list para Inicio de Sesión y JWT"
---

# Tasks: Inicio de Sesión y Autenticación (JWT)

**Input**: `/specs/sprints/002-inicio-sesion-auth/spec.md`

## Phase 1: Setup & Foundational
- [ ] T001 Instalar dependencias: `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt`, `bcrypt`.
- [ ] T002 Crear módulo genérico `AuthModule`.
- [ ] T003 Refactorizar creación de usuario en `ClientsService` para usar `bcrypt` antes de guardar la contraseña.

## Phase 2: User Story 1 & 2 - Autenticación
- [ ] T004 [Backend] Crear `AuthService` (Application Layer) para verificar contraseñas.
- [ ] T005 [Backend] Implementar bloqueo en `AuthService` si el `status` es `PENDING_APPROVAL`.
- [ ] T006 [Backend] Configurar `JwtModule` y emitir el token con el `sub` y `role` del usuario.
- [ ] T007 [Backend] Crear `AuthController` (Adapter) con ruta `POST /auth/login`.
- [ ] T008 [Backend] Crear `JwtAuthGuard` y `RolesGuard` para proteger futuros endpoints.

## Phase 3: Frontend Integration
- [ ] T009 [Frontend] Crear vista de Login.
- [ ] T010 [Frontend] Guardar JWT en LocalStorage o Cookies de forma segura.
- [ ] T011 [Frontend] Implementar ruteo condicional (`react-router-dom`) basado en el JWT (si es TRAINER o CLIENT).
