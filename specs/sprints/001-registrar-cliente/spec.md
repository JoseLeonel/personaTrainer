# Feature Specification: Registro de Cliente

**Feature Branch**: `001-registrar-cliente`  
**Created**: 2026-05-05  
**Status**: Draft  
**Input**: User description: "Se puede registrar un cliente pero tiene que ser aprobado por el entrenador personal, en el registro debe elegir el entrenador personal"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Registro de Nuevo Cliente (Priority: P1)

Como nuevo cliente, quiero poder registrarme en la plataforma y seleccionar a mi entrenador personal para poder iniciar mi plan de entrenamiento.

**Why this priority**: Es el punto de entrada principal para que un usuario comience a usar la aplicación. Sin registro, no hay clientes.

**Independent Test**: Se puede probar llenando un formulario de registro y verificando en la base de datos que el usuario se crea con estado `PENDING_APPROVAL` y con la relación correcta al entrenador seleccionado.

**Acceptance Scenarios**:

1. **Given** un usuario en la pantalla de registro, **When** completa sus datos, email, contraseña y selecciona un entrenador de la lista, **Then** el sistema crea la cuenta en estado "Pendiente de Aprobación" y muestra un mensaje de éxito.
2. **Given** un cliente recién registrado, **When** intenta iniciar sesión, **Then** el sistema le informa que su cuenta aún debe ser aprobada por su entrenador.

---

### User Story 2 - Aprobación de Cliente por el Entrenador (Priority: P1)

Como entrenador personal, quiero ver una lista de clientes que se han registrado bajo mi nombre y poder aprobarlos o rechazarlos para mantener control sobre mis clientes.

**Why this priority**: Es el paso requerido inmediatamente después del registro para que el cliente pueda entrar al sistema.

**Independent Test**: El entrenador puede entrar a su panel, ver los usuarios pendientes y al hacer clic en "Aprobar", el estado del usuario cambia a `ACTIVE`.

**Acceptance Scenarios**:

1. **Given** un entrenador autenticado en su panel, **When** navega a la sección de "Aprobar Clientes", **Then** ve una lista de clientes con estado `PENDING_APPROVAL`.
2. **Given** la lista de clientes pendientes, **When** el entrenador hace clic en "Aprobar" para un cliente, **Then** el estado del cliente cambia a `ACTIVE` y ya puede iniciar sesión.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE permitir a los usuarios crear cuentas con rol `CLIENT`.
- **FR-002**: El sistema DEBE asignar automáticamente el estado `PENDING_APPROVAL` a todos los clientes nuevos.
- **FR-003**: El sistema DEBE listar los entrenadores disponibles (usuarios con rol `ADMIN` o `TRAINER`) en el formulario de registro para que el cliente seleccione uno.
- **FR-004**: El sistema DEBE impedir el inicio de sesión a usuarios con estado `PENDING_APPROVAL`.
- **FR-005**: El sistema DEBE permitir a los entrenadores listar a los clientes que los han seleccionado y que están pendientes de aprobación.
- **FR-006**: El sistema DEBE permitir a los entrenadores cambiar el estado de un cliente de `PENDING_APPROVAL` a `ACTIVE` o `REJECTED`.

### Key Entities

- **User (Client)**: Usuario final, tiene credenciales, rol (`CLIENT`), estado de cuenta (`PENDING_APPROVAL`), y un entrenador asignado.
- **User (Trainer)**: Usuario administrador, tiene rol (`ADMIN` o `TRAINER`), y puede tener múltiples clientes asignados a él.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un cliente puede registrarse y seleccionar un entrenador en menos de 2 minutos.
- **SC-002**: Un entrenador puede aprobar a un cliente en su panel en 1-2 clics.
- **SC-003**: Un usuario rechazado o pendiente no puede acceder a las rutas protegidas de la aplicación.

## Assumptions

- Se asume que en esta fase MVP los entrenadores ya están creados directamente en la base de datos (mediante seed o scripts manuales).
- No se enviarán correos electrónicos reales de confirmación en este sprint, solo mensajes en la UI.
- La contraseña se almacenará en texto plano temporalmente o mediante un hash básico si Auth ya está configurado.
