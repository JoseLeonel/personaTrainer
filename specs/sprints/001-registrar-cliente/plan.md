# Implementación: Sprint 001 - Registro de Cliente (Onboarding Completo)

Este sprint abarca la creación del flujo de registro de clientes con un proceso de "Onboarding Exhaustivo", el cual recopila información detallada del cliente y requiere aprobación manual por parte del entrenador.

## Decisiones Arquitectónicas (Aprobadas)

1. **Estado del Cliente:** Todo cliente nuevo quedará en estado `PENDING_APPROVAL` al terminar su registro y requerirá que un Entrenador lo apruebe manualmente desde el panel.
2. **Estructura de Base de Datos:** Se creará una nueva entidad `ClientProfile` para almacenar los más de 40 campos (datos médicos, físicos, de hábitos y comerciales), dejando la tabla `User` limpia solo para la autenticación y roles.

## Cambios Propuestos (Proposed Changes)

### 1. Entidades y Base de Datos (Backend)
- **[MODIFY]** `backend/src/entities/user.entity.ts`: Agregar relación One-to-One con el perfil.
- **[NEW]** `backend/src/entities/client-profile.entity.ts`: Nueva entidad masiva para almacenar:
  - *Personales*: dob (fecha nac), phone, gender.
  - *Físicos*: currentWeight, height, bodyFat, waist, etc.
  - *Objetivos*: mainGoal, targetWeight, estimatedTime.
  - *Nivel*: experienceLevel.
  - *Salud*: injuries, medicalConditions, limitations.
  - *Hábitos*: trainingDays, preferredTime, activityLevel, sleepQuality.
  - *Nutrición*: dietType, foodRestrictions.
  - *Comercial*: planType, planPrice, renewalDate.

### 2. Capa de Autenticación / Registro (Backend)
- **[NEW]** Endpoint `POST /auth/register` (Arquitectura Hexagonal):
  - Recibirá el payload del formulario (datos de cuenta + datos de perfil).
  - Calculará la edad automáticamente basándose en la fecha de nacimiento (DOB).
  - Calculará el IMC automáticamente basándose en peso y estatura.
  - Guardará el `User` (estado `PENDING_APPROVAL`) y su `ClientProfile` asociado de manera transaccional.
- **[NEW]** Endpoint `GET /auth/trainers` para llenar el selector de entrenadores.

### 3. Capa de Aprobación de Clientes (Backend)
- **[MODIFY]** `ClientsService` y Controladores:
  - `GET /clients/pending` para listar a los clientes pendientes del entrenador.
  - `PUT /clients/:id/approve` para cambiar el estado a `ACTIVE`.

### 4. Frontend - Wizard de Registro
- **[NEW]** Componente `RegisterWizard.tsx`: Formulario por pasos para no abrumar al usuario:
  - *Paso 1*: Cuenta y Entrenador.
  - *Paso 2*: Físico y Medidas.
  - *Paso 3*: Objetivos.
  - *Paso 4*: Salud y Hábitos.
- **[MODIFY]** `TrainerDashboard.tsx`: Actualizar para incluir la sección de clientes pendientes con el botón de "Aprobar".

## Plan de Verificación (Verification Plan)
- **Backend**: Validar que un registro sin `Nombre`, `Peso`, `Estatura` u `Objetivo` sea rechazado (bad request).
- **Frontend**: Llenar el Wizard completo, verificar que el cálculo de IMC y Edad sea correcto en base de datos, y que el entrenador pueda aprobar la solicitud exitosamente.
