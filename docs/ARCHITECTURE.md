# Arquitectura del Sistema - Teamplates Psico

## Vista General

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENTE (Frontend)                       │
│  React/Vue.js - Componentes | Estilos | Assets              │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTP/HTTPS
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    API REST (Backend)                        │
│  Node.js + Express - Routes | Controllers | Middleware      │
└──────────┬──────────────────────────────────────┬───────────┘
           │                                      │
           ▼                                      ▼
   ┌──────────────────┐            ┌──────────────────────┐
   │  PostgreSQL BD   │            │  Almacenamiento      │
   │  - Usuarios      │            │  - Imágenes (Cloud)  │
   │  - Portfolios    │            │  - Documentos        │
   │  - Trabajos      │            │  - Archivos          │
   │  - Mensajes      │            └──────────────────────┘
   └──────────────────┘
```

## Componentes Clave

### 1. Frontend (src/)
- **Componentes**: Botones, tarjetas, formularios reutilizables
- **Páginas**: Home, Portfolio, Dashboard, Admin
- **Estilos**: Tema global, variables CSS, responsive design
- **Utils**: Funciones auxiliares, formateo de datos
- **Hooks**: Lógica de estado personalizada

### 2. Backend (backend/)
- **Rutas**: Endpoints REST agrupados por entidad
- **Controladores**: Lógica de negocio
- **Middleware**: Autenticación, validación, logging
- **Seguridad**: Encriptación, tokens JWT
- **Configuración**: Variables de entorno, BD

### 3. Base de Datos (database/)
- **Esquema**: Tablas normalizadas
- **Migraciones**: Control de versiones de BD
- **Seeds**: Datos de prueba

### 4. Seguridad (backend/security/)
- **Autenticación**: JWT tokens
- **Encriptación**: Bcrypt para contraseñas
- **Validación**: Input validation
- **Autorización**: Control de roles y permisos

## Flujo de Datos Típico

### Ejemplo: Login de Usuario

```
1. CLIENTE (Frontend)
   └─> Usuario ingresa credenciales
       └─> Envía POST /api/auth/login con {email, password}

2. SERVIDOR (Backend)
   └─> Middleware de validación verifica formato
       └─> Controlador busca usuario por email en BD
           └─> Compara password con hash usando bcrypt
               └─> Si es válido, genera JWT token
                   └─> Responde con token + datos usuario

3. CLIENTE (Frontend)
   └─> Almacena token en localStorage
       └─> Lo incluye en headers de futuras peticiones
           └─> Accede a rutas protegidas
```

## Patrones de Diseño

### Model-View-Controller (MVC)
- **Model**: Esquema BD y lógica de datos
- **View**: Componentes React/Vue
- **Controller**: Lógica de negocio en backend

### Middleware Pattern
- Cadena de procesamiento de peticiones
- Autenticación → Validación → Controlador → Respuesta

### Repository Pattern (Futuro)
- Abstracción de acceso a datos
- Facilita testing y cambio de BD

## Escalabilidad

### Fase 1 (Actual)
- ✅ Monolito con frontend y backend integrados
- ✅ PostgreSQL local
- ✅ Autenticación básica

### Fase 2 (Próxima)
- 📋 Separar frontend y backend completamente
- 📋 Implementar sistema de pagos (Stripe)
- 📋 CDN para imágenes
- 📋 Caché (Redis)

### Fase 3 (Futura)
- 🔄 Microservicios por dominio
- 🔄 Docker containers
- 🔄 Kubernetes orquestación
- 🔄 Bases de datos distribuidas

## Seguridad en Capas

```
Capa 1: HTTPS
  └─> Encriptación en tránsito

Capa 2: CORS + Headers
  └─> Control de origen y headers de seguridad

Capa 3: Autenticación
  └─> JWT tokens verificados en cada petición

Capa 4: Validación
  └─> Validación de tipos y formatos

Capa 5: Autorización
  └─> Verificación de roles y permisos

Capa 6: BD
  └─> Hashing de datos sensibles
  └─> Encriptación de información crítica
```

## Tecnologías Recomendadas

| Componente | Tecnología | Alternativa |
|-----------|-----------|-----------|
| Frontend | React 18 | Vue 3, Svelte |
| Styling | Tailwind CSS | Bootstrap, Styled Components |
| Backend | Node.js/Express | Python/Flask, Java/Spring |
| BD | PostgreSQL | MySQL, MongoDB |
| Auth | JWT | OAuth 2.0, Sessions |
| Almacenamiento | Cloudinary | AWS S3, Google Cloud |
| Pagos | Stripe | PayPal, Mercado Pago |

## Mejoras de Seguridad (Implementar)

- [ ] Rate limiting
- [ ] HTTPS obligatorio
- [ ] CSRF protection
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS protection
- [ ] Password reset seguro
- [ ] 2FA (Two-factor authentication)
- [ ] Logging y monitoreo
- [ ] Backup automático de BD
