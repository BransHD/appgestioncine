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
npm start
```

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

## Base de Datos

El script para crear la base de datos se encuentra en `docs/database/script.sql`

## Decisiones Técnicas

- **Node.js + Express**: Framework ligero y fácil de mantener
- **Sequelize**: ORM para manejo de base de datos
- **SQL Server**: Base de datos relacional robusta para garantizar integridad de datos
- **RESTful API**: Diseño de API siguiendo principios REST para mejor escalabilidad y mantenimiento
