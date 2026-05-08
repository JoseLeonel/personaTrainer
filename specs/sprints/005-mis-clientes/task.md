# Tareas: Hu-Mis-Cliente-App-Entrenador

### Backend (Hexagonal)
- [ ] 1. Crear/Actualizar en `ClientsController` un endpoint GET para listar clientes por Entrenador con soporte para paginación (`limit` y `offset`).
- [ ] 2. Implementar en `ClientsService` la lógica de negocio para obtener la lista de clientes paginada.
- [ ] 3. Escribir la consulta en el repositorio de Base de Datos para asegurar que solo se traen usuarios activos y asociados al Entrenador, incluyendo sus datos de perfil (`ClientProfile`).

### Frontend (React UI)
- [ ] 4. Crear el componente `SwipeableClientItem.tsx` aplicando el diseño de tarjetas verticales, grid de dos columnas y la lógica de deslizamiento a -150px.
- [ ] 5. Crear el componente `ClientsCatalog.tsx` que maneje el array de clientes, el scroll infinito (`IntersectionObserver`) y el buscador superior.
- [ ] 6. Integrar `<ClientsCatalog />` dentro del `TrainerDashboard.tsx` para que se despliegue al seleccionar la opción "Mis Clientes" del menú lateral.

### Pruebas y Ajustes
- [ ] 7. Validar el diseño visual en pantallas de dispositivo móvil y en escritorio.
- [ ] 8. Validar la paginación con más de 5 clientes de prueba.
