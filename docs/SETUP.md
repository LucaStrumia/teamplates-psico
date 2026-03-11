# Guía de Configuración - Teamplates Psico

## Requisitos Previos

- Node.js (v16 o superior)
- npm o yarn
- PostgreSQL (v12 o superior)
- Git

## Instalación

### 1. Clonar el Repositorio

```bash
git clone <tu-repo-url>
cd Teamplates Psico
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

```bash
cp .env.example .env
```

Editar `.env` con tus valores:

```env
# Backend
PORT=3000
NODE_ENV=development

# Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=teamplates_psico
DB_USER=postgres
DB_PASSWORD=tu_contraseña

# JWT
JWT_SECRET=tu_clave_super_secreta
JWT_EXPIRY=7d
BCRYPT_ROUNDS=10

# CORS
CORS_ORIGIN=http://localhost:3000
```

### 4. Crear Base de Datos

```bash
# Acceder a PostgreSQL
psql -U postgres

# Dentro de psql:
CREATE DATABASE teamplates_psico;
\c teamplates_psico
\i database/schemas/schema.sql
```

### 5. Ejecutar en Desarrollo

```bash
npm run dev
```

Esto iniciará:
- Frontend en `http://localhost:5173`
- Backend en `http://localhost:3000`

## Estructura de Carpetas Explicada

### `/src` - Frontend
- **components/** - Componentes reutilizables
- **pages/** - Páginas principales de la aplicación
- **styles/** - CSS global y estilos
- **assets/** - Imágenes, iconos y fuentes
- **utils/** - Funciones utilitarias
- **hooks/** - Custom hooks para React
- **constants/** - Constantes de la aplicación

### `/backend` - Servidor API
- **routes/** - Definición de endpoints API
- **controllers/** - Lógica de negocio
- **models/** - Modelos de datos
- **middleware/** - Autenticación, validación, logging
- **security/** - Funciones de seguridad (JWT, bcrypt)
- **config/** - Configuraciones de BD y aplicación
- **utils/** - Funciones utilitarias del backend

### `/database` - Gestión de Datos
- **schemas/** - Definición de tablas SQL
- **migrations/** - Scripts para actualizar BD
- **seeds/** - Datos iniciales para desarrollo

### `/templates` - Plantillas de Portfolios
- **portfolio-1/** - Template 1
- **portfolio-2/** - Template 2
- **portfolio-3/** - Template 3

## Seguridad Implementada

✅ **JWT** - Autenticación basada en tokens
✅ **Bcrypt** - Encriptación de contraseñas
✅ **CORS** - Validación de origen
✅ **Input Validation** - Validación de datos de entrada
✅ **Headers de Seguridad** - Protección contra ataques comunes
✅ **Rate Limiting** - Límite de peticiones (a implementar)
✅ **SQL Injection Protection** - Validación de parámetros

## Próximos Pasos

1. Desarrollar componentes del frontend
2. Implementar controladores en el backend
3. Crear modelos de datos
4. Agregar autenticación real
5. Implementar pagos (Stripe)
6. Configurar emails
7. Agregar tests

## Ayuda

Ver `/docs` para más documentación específica.
