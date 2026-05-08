# SPECIFICATION DOCUMENT
# Mantenimiento de Catálogo Técnico de Ejercicios
# Personal Trainer App

---

# 1. Objetivo

Desarrollar el módulo de mantenimiento de catálogo técnico de ejercicios para la aplicación de Personal Trainer, permitiendo administrar ejercicios físicos profesionales y reutilizarlos dentro de rutinas de entrenamiento personalizadas.

Cada ejercicio debe permitir:

- Configuración técnica de entrenamiento
- Configuración de ejecución muscular
- Control de series y repeticiones
- Manejo de cadencias
- Manejo de RIR
- Descanso con cronómetro
- Ilustración multimedia mediante fotos y videos

El objetivo principal es que el cliente pueda comprender visual y técnicamente cómo ejecutar correctamente cada ejercicio.

---

# 2. Alcance

El módulo permitirá:

- Crear ejercicios
- Editar ejercicios
- Consultar ejercicios
- Filtrar ejercicios
- Activar/Inactivar ejercicios
- Subir imágenes
- Subir videos
- Configurar parámetros técnicos de entrenamiento
- Visualizar ejercicios desde rutinas del cliente

---

# 3. Actores

## 3.1 Personal Trainer

Usuario encargado de:

- Crear ejercicios
- Editar ejercicios
- Configurar parámetros técnicos
- Subir multimedia
- Asignar ejercicios a rutinas

---

## 3.2 Cliente

Usuario encargado de:

- Visualizar ejercicios asignados
- Ejecutar rutinas
- Ver videos e imágenes
- Seguir tiempos de descanso
- Completar series

---

# 4. Requerimientos funcionales

---

# RF-01 Crear ejercicio

El sistema debe permitir crear un ejercicio con la siguiente información:

## Información general

- Nombre del ejercicio
- Grupo muscular principal
- Grupo muscular secundario
- Tipo de ejercicio
- Nivel de dificultad
- Equipo requerido
- Descripción técnica
- Instrucciones de ejecución
- Errores comunes
- Estado activo/inactivo

---

## Información técnica

- Series
- Repeticiones
- Cadencia
- RIR
- Tiempo de descanso
- Activar cronómetro

---

## Información multimedia

- Imagen principal obligatoria
- Galería de imágenes opcional
- Video demostrativo opcional
- URL de video externo opcional
- Thumbnail del video

---

# RF-02 Editar ejercicio

El sistema debe permitir modificar todos los datos del ejercicio.

---

# RF-03 Inactivar ejercicio

El sistema debe permitir inactivar ejercicios sin eliminarlos físicamente.

---

# RF-04 Listar ejercicios

El sistema debe mostrar listado de ejercicios con filtros por:

- Nombre
- Grupo muscular
- Tipo
- Nivel
- Equipo
- Estado

---

# RF-05 Configuración de series

Cada ejercicio debe permitir definir:

- Cantidad de series

---

# RF-06 Configuración de repeticiones

Cada ejercicio debe permitir definir:

Cantidad de repeticiones

Ejemplo:

12 repeticiones

---

# RF-07 Configuración de cadencia

El sistema debe permitir registrar la cadencia en formato:

Excéntrica - Pausa inferior - Concéntrica - Pausa superior

Ejemplo:

3-1-1-0

Significado:

3 segundos fase excéntrica
1 segundo pausa inferior
1 segundo fase concéntrica
0 pausa superior

---

# RF-08 Configuración de RIR

El sistema debe permitir registrar el RIR del ejercicio.

RIR significa:

Repeticiones en Reserva

Ejemplo:

RIR 2

Significa que el cliente termina la serie sintiendo que podía hacer 2 repeticiones más.

---

# RF-09 Configuración de descanso

El sistema debe permitir definir el tiempo de descanso entre series.

Ejemplo:

90 segundos

---

# RF-10 Cronómetro de descanso

Cuando el cliente complete una serie:

El sistema debe iniciar automáticamente un cronómetro regresivo
Debe mostrar visualmente el tiempo restante
Debe permitir pausar o reiniciar el cronómetro

---

# RF-11 Gestión multimedia

El sistema debe permitir subir contenido multimedia para ilustrar correctamente el ejercicio.

Cada ejercicio podrá tener:

Imagen principal
Varias imágenes adicionales
Video demostrativo (subido directamente a la plataforma)
Video externo (YouTube/Vimeo)

---

# RF-12 Visualización multimedia del cliente

Cuando el cliente abra un ejercicio deberá visualizar:

Imagen principal
Galería de imágenes
Video demostrativo
Instrucciones técnicas
Series
Repeticiones
Cadencia
RIR
Descanso
Cronómetro

---

# RF-13 Visualización responsive

El módulo debe funcionar correctamente en:

Celulares
Tablets
Escritorio

---

# RF-14 Validaciones

El sistema debe validar:

Nombre obligatorio
Grupo muscular obligatorio
Imagen principal obligatoria
Series mayores a cero
Repeticiones mayores a cero
RIR entre 0 y 5
Descanso mayor o igual a cero
Cadencia válida
No duplicar ejercicios activos con mismo nombre

---

# 5. Reglas de negocio

**RN-01**
Un ejercicio inactivo no puede asignarse a nuevas rutinas.

**RN-02**
La imagen principal del ejercicio es obligatoria.

**RN-03**
La cadencia debe almacenarse como texto estructurado.

**RN-04**
El descanso debe almacenarse internamente en segundos.

**RN-05**
El cronómetro debe ejecutarse desde el frontend del cliente.

**RN-06**
Las imágenes deben optimizarse automáticamente.

**RN-07**
Los videos deben poder reproducirse desde dispositivos móviles.

**RN-08**
El sistema debe aceptar:
- Imágenes: JPG, JPEG, PNG, WEBP
- Videos: MP4

**RN-09**
El sistema debe permitir múltiples imágenes por ejercicio.

**RN-10**
Los archivos multimedia no deben descargarse automáticamente.

**RN-11**
El sistema debe generar thumbnail automático del video.

**RN-12**
La interfaz debe ser simple y rápida para uso operativo del trainer.

---

# 6. Modelo conceptual sugerido

**Exercise**
- id
- name
- primaryMuscleGroup
- secondaryMuscleGroup
- exerciseType
- difficultyLevel
- equipment
- description
- executionInstructions
- commonMistakes
- mainImageUrl
- galleryImages
- videoUrl
- externalVideoUrl
- thumbnailUrl
- sets
- repetitions
- cadence
- rir
- restSeconds
- timerEnabled
- active
- createdAt
- updatedAt

---

# 7. Casos de uso

## CU-01 Crear ejercicio
**Flujo:**
1. Trainer abre mantenimiento
2. Presiona "Nuevo ejercicio"
3. Completa formulario
4. Sube imágenes y videos
5. Configura parámetros técnicos
6. Guarda ejercicio
7. Sistema valida y almacena

## CU-02 Editar ejercicio
**Flujo:**
1. Trainer selecciona ejercicio
2. Modifica información
3. Guarda cambios
4. Sistema actualiza datos

## CU-03 Cliente visualiza ejercicio
**Flujo:**
1. Cliente abre rutina
2. Selecciona ejercicio
3. Sistema muestra:
   - imágenes
   - video
   - series
   - repeticiones
   - cadencia
   - RIR
   - descanso
4. Cliente ejecuta ejercicio

## CU-04 Cronómetro de descanso
**Flujo:**
1. Cliente completa serie
2. Sistema inicia cronómetro
3. Se muestra cuenta regresiva
4. Finaliza descanso
5. Cliente continúa siguiente serie

---

# 8. Criterios de aceptación

**CA-01**
El sistema debe permitir crear ejercicios correctamente.

**CA-02**
El sistema debe impedir ejercicios duplicados activos.

**CA-03**
El sistema debe validar correctamente la cadencia.

**CA-04**
El sistema debe permitir subir múltiples imágenes.

**CA-05**
El sistema debe reproducir videos correctamente.

**CA-06**
El cronómetro debe iniciar automáticamente al completar una serie.

**CA-07**
El cliente debe visualizar claramente RIR y cadencia.

**CA-08**
Los ejercicios inactivos no deben aparecer disponibles.

**CA-09**
El módulo debe funcionar correctamente en celular.

**CA-10**
La carga multimedia debe funcionar sin errores.

---

# 9. Fuera de alcance inicial

No incluye inicialmente:
- Inteligencia artificial de recomendación
- Corrección automática postural
- Integración con smartwatch
- Conteo automático de repeticiones
- Detección por cámara
- Marketplace de trainers
- Rutinas automáticas por IA

---

# 10. Objetivo de experiencia de usuario

La experiencia debe sentirse:
- Moderna
- Visual
- Operativa
- Rápida
- Intuitiva
- Similar a apps fitness premium

El cliente debe poder entender el ejercicio únicamente viendo:
- Fotos
- Videos
- Cadencia
- Indicaciones
- RIR
- Descanso
