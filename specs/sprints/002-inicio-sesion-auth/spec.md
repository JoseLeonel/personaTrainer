# Feature Specification: Inicio de Sesión y Autenticación (JWT)

**Feature Branch**: `002-inicio-sesion-auth`  
**Created**: 2026-05-05  
**Status**: Draft  
**Input**: "002-inicio-sesion-auth (Login y JWT)"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Login Exitoso con JWT (Priority: P1)
Como usuario registrado (Entrenador o Cliente), quiero poder iniciar sesión con mi correo y contraseña para acceder a la plataforma.

**Independent Test**: Enviar credenciales válidas a `/auth/login` y recibir un JWT token.
**Acceptance Scenarios**:
1. **Given** credenciales correctas, **When** el usuario hace login, **Then** recibe un token JWT y su información básica.

### User Story 2 - Bloqueo de Clientes Pendientes (Priority: P1)
Como administrador, quiero que el sistema rechace el inicio de sesión de clientes que aún están en estado `PENDING_APPROVAL`.

**Independent Test**: Cliente en estado pendiente intenta iniciar sesión y recibe error 403 o 401.
**Acceptance Scenarios**:
1. **Given** un usuario cliente pendiente, **When** intenta loguearse, **Then** el sistema arroja "Cuenta pendiente de aprobación".

### User Story 3 - Redirección por Rol (Priority: P2)
Como usuario, quiero que la interfaz me dirija al panel correcto dependiendo de mi rol (Cliente o Entrenador).

**Acceptance Scenarios**:
1. **Given** un token de TRAINER, **When** accede a la app, **Then** ve el Trainer Dashboard.
2. **Given** un token de CLIENT, **When** accede a la app, **Then** ve el Client Dashboard.

## Requirements *(mandatory)*
- **FR-001**: El sistema DEBE proveer un endpoint de login que devuelva un JWT.
- **FR-002**: Las contraseñas DEBEN encriptarse con bcrypt.
- **FR-003**: El sistema DEBE proteger rutas con Guards basados en el JWT y el Rol.

## Success Criteria
- **SC-001**: Los usuarios solo pueden ver información autorizada para su rol.
