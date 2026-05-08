# Especificación de Requerimientos: Operativa del Entrenador y Clientes

## 1. Dashboard Operativo del Entrenador (Lo MÁS importante)
Al ingresar a la aplicación, el entrenador debe visualizar un panel ejecutivo de control (Home/Dashboard) enfocado en métricas operativas clave.

**Métricas a visualizar:**
- Clientes activos (Ej. 42)
- Pendientes de pago (Ej. 5)
- Sin entrenar hoy (Ej. 12)
- Riesgo de abandono (Ej. 4)
- Nuevos clientes
- Próximos vencimientos
- Clientes con mejor progreso
- Ingresos del mes (Ej. ₡1.250.000)

## 2. Módulo "Mis Clientes" y Estado Rápido
El listado de clientes sigue el lineamiento estricto de **Tarjetas Verticales** con *Swipe-to-Reveal*. 

### Estado Rápido del Cliente (Diseño de la Tarjeta)
Cada tarjeta debe proporcionar un resumen visual e inmediato del estado del cliente mediante íconos/emojis:
- **Header**: [FOTO]
- **Datos base**: Juan Pérez | Objetivo: Bajar grasa
- **Indicadores de Estado**:
  - 🟢 Activo (o 🔴 Inactivo)
  - 💰 Pago al día (o ⚠ Pendiente)
  - 🔥 4% grasa perdida
  - 📅 Entrena hace 52 días

## 3. Módulo de Cobros Automáticos (MUY importante)
Se requiere un submódulo integrado para el control financiero y retención de clientes.

### Funcionalidades Financieras
- Registrar pagos recibidos.
- Ver lista de clientes morosos.
- Visualizar fecha del próximo cobro.
- Historial de pagos por cliente.
- Sistema de recordatorios automáticos (alertas visuales para el entrenador).

### Tipos de Cobro Soportados
- Diario
- Semanal
- Quincenal
- Mensual

### Alertas Operativas
El sistema debe alertar proactivamente al entrenador sobre:
- ⚠ Cliente vence mañana.
- ⚠ Cliente tiene 7 días sin pagar.
- ⚠ Riesgo de abandono (falta de entrenamiento prolongada).
