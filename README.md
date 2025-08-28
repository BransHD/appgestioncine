# Sistema de Gestión de Cine

Sistema de gestión de turnos y películas para cines.

## Requisitos

- Node.js v14+
- SQL Server

## Instalación

1. Clonar el repositorio

```bash
git clone https://github.com/BransHD/appgestioncine.git
cd appgestioncine
```

2. Instalar dependencias

```bash
npm install
```

3. Configurar variables de entorno

```bash
# Crear archivo .env y configurar:
# Database
DB_SERVER=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=cinemaBD
PORT_DB=10200

# Server
PORT=3000
```

4. Iniciar servidor

```bash
npm run dev
```

4. Crear tablas, procedures, indices, insert en base de datos (SQL server)

El script para crear la base de datos se encuentra en `docs/database/script.sql`


## Documentación API

### Endpoints de Películas

#### Listar Películas

```http
GET localhost:3000/api/peliculas
```

**Query Parameters:**

- `search` (string, optional): Búsqueda por título
- `genero` (string, optional): Filtrar por género
- `estado` (string, optional): Estado de la película (default: 'S')
- `page` (number, optional): Número de página (default: 1)
- `pageSize` (number, optional): Elementos por página (default: 10)

#### Obtener Película por ID

```http
GET /localhost:3000/api/peliculas/{id}
```

#### Crear Película

```http
POST /localhost:3000/api/peliculas
```

**Request Body**

```json
{
  "titulo": "string",
  "sinopsis": "string",
  "duracionMin": "number",
  "clasificacion": "string",
  "genero": "string",
  "fechaEstreno": "date",
  "user": "string"
}
```

#### Actualizar Película

```http
PUT localhost:3000/api/peliculas/{id}
```

**Request Body**

```json
{
  "titulo": "string",
  "sinopsis": "string",
  "duracionMin": "number",
  "clasificacion": "string",
  "genero": "string",
  "fechaEstreno": "date",
  "user": "string"
}
```

#### Eliminar Película

```http
DELETE localhost:3000/api/peliculas/{id}
```

**Request Body**

```json
{
  "user": "string"
}
```

### Turnos

#### Listar Turnos

```http
GET localhost:3000/api/turnos?peliculaId&sala&desde&hasta
```

**Query Parameters:**

- `peliculaId` (string, optional): Filtrar por película
- `sala` (string, optional): Filtrar por sala
- `desde` (date, optional): Fecha inicio
- `hasta` (date, optional): Fecha fin

#### Obtener Turno por ID

```http
GET localhost:3000/api/turnos/{id}
```

#### Crear Turno

```http
POST localhost:3000/api/turnos
```

**Request Body**

```json
{
  "peliculaId": "number",
  "sala": "string",
  "inicio": "datetime",
  "fin": "datetime",
  "precio": "number",
  "idioma": "string",
  "formato": "string",
  "aforo": "number",
  "user": "string"
}
```

#### Actualizar Turno

```http
PUT localhost:3000/api/turnos/{id}
```

**Request Body**

```json
{
  "sala": "string",
  "inicio": "datetime",
  "fin": "datetime",
  "precio": "number",
  "idioma": "string",
  "formato": "string",
  "aforo": "number",
  "user": "string"
}
```

#### Eliminar Turno

```http
DELETE localhost:3000/api/turnos/{id}
```

**Request Body**

```json
{
  "user": "string"
}
```

### Códigos de Estado

- 200: Operación exitosa
- 201: Recurso creado
- 400: Solicitud incorrecta
- 404: Recurso no encontrado
- 500: Error interno del servidor

## Decisiones Técnicas y Trade-offs

### Arquitectura del Proyecto

#### 1. Router -> Controller (2-Layer Architecture)
✅ **Ventajas**
- Arquitectura simple y directa
- Menos complejidad y overhead
- Más fácil de entender y mantener
- Respuesta rápida a cambios

❌ **Desventajas**
- Lógica de negocio mezclada con acceso a datos
- Más difícil de testear unitariamente
- Posible duplicación de código

#### 2. SQL Directo con Sequelize
✅ **Ventajas**
- Control total sobre las queries
- Mejor performance en consultas complejas
- Aprovechamiento de características SQL Server
- Más fácil de optimizar queries

❌ **Desventajas**
- Código más acoplado a SQL Server
- Mantenimiento manual de queries

#### 3. Tecnologías Principales
- **Node.js**: Runtime JavaScript
- **Express**: Framework web minimalista
- **Sequelize**: ORM para conexión con base de datos
- **SQL Server**: Sistema de base de datos relacional

### Trade-offs Realizados

1. **Simplicidad vs Separación de Responsabilidades**
   - Se priorizó una arquitectura simple de 2 capas
   - Se sacrificó algo de separación de responsabilidades
   - Ganamos velocidad de desarrollo y mantenimiento más sencillo

3. **Velocidad de Desarrollo vs Arquitectura Empresarial**
   - Implementación rápida y directa
   - Menos capas de abstracción
   - Más fácil de debuggear

### Consideraciones

1. **Seguridad**
   - Uso de Sequelize para prevenir SQL injection
   - Validación de datos en controllers
   - Manejo de errores centralizado

2. **Mantenibilidad**
   - Código organizado por funcionalidad
   - Nombres descriptivos para rutas y controllers

3. **Performance**
   - Queries SQL optimizadas
   - Índices en tablas principales
   - Paginación implementada