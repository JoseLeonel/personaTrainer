# Plan de Implementación: Operativa del Entrenador y Cobros

Este documento detalla los pasos técnicos para implementar el Dashboard Ejecutivo, las Tarjetas de Clientes mejoradas y el Módulo de Cobros, basándose en Arquitectura Hexagonal.

## 1. Capa de Dominio (Entidades y Lógica de Negocio)
- **Dashboard Metrics**: Crear lógica de dominio para calcular "riesgo de abandono" (basado en umbrales de inactividad, ej. > X días sin registrar rutinas) y "Grasa Perdida".
- **Entidad `Payment` (Cobros)**:
  - Campos: `clientId`, `amount`, `paymentDate`, `periodCovered`, `status`.
- **Entidad `ClientProfile`**:
  - Extender `chargeType` (Enum: `DIARIO`, `SEMANAL`, `QUINCENAL`, `MENSUAL`).
  - Añadir campos de control de pagos: `lastPaymentDate`, `nextDueDate`.

## 2. Capa de Infraestructura / Backend (NestJS)
- **`DashboardController`**: `GET /trainer/dashboard-metrics`
  - Debe realizar agregaciones (SQL COUNT, SUM) para retornar: ingresos del mes (SUM de `Payment`), morosos, activos, etc.
- **`ClientsController`**:
  - El DTO de salida de los clientes debe incluir estado visual computado (ej. `isPaymentUpToDate`, `daysTraining`, `lostBodyFat`).
- **`PaymentsController`**:
  - `POST /payments/register` (Registrar un nuevo pago y actualizar el `nextDueDate` del cliente basado en el `chargeType`).
  - `GET /payments/defaulters` (Obtener lista de morosos).

## 3. Capa de Presentación / Frontend (React)

### 3.1 Dashboard Operativo (`TrainerDashboard.tsx`)
- Reestructurar el inicio para mostrar un "Grid de Métricas" utilizando *Glassmorphism*. 
- **Tarjetas de Resumen**: Cajas grandes para los KPIs más importantes (Ingresos ₡, Pendientes de Pago, Riesgo Abandono).

### 3.2 Tarjeta Visual Mejorada (`SwipeableClientItem.tsx`)
- Implementar el diseño solicitado utilizando emojis para fácil lectura a primer vistazo:
  - 🟢/🔴 para Activo/Inactivo.
  - 💰/⚠ para Estado de Pago.
  - 🔥 para Grasa perdida.
  - 📅 para Días de entrenamiento.
- Mantener la restricción estricta de **no utilizar tablas** y mantener el patrón Swipe para editar/registrar pagos.

### 3.3 Flujo de Cobros
- Al hacer *Swipe* o clic, añadir una acción "Registrar Pago".
- Crear un componente modal o panel deslizante rápido para registrar un pago confirmando monto y fecha.
- Mostrar notificaciones y banners (⚠) en el Dashboard para vencimientos inminentes o atrasos severos (ej. "7 días sin pagar").
