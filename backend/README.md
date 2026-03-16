# Backend - Sistema de Notificaciones por Email

Backend en Node.js/Express que maneja el envío de emails para citas y reseñas del portfolio de Candela González.

## 📋 Requisitos

- Node.js 14+ 
- npm o yarn
- Cuenta de correo SMTP (Gmail, empresa, etc.)

## 🚀 Instalación

1. **Instalar dependencias:**
```bash
cd backend
npm install
```

2. **Configurar variables de entorno:**
   - Copia `.env.example` a `.env`
   - Rellena los datos según tu proveedor de email

## 📧 Configuración de Email

### Opción A: Gmail (Recomendado)

1. Habilita la **Autenticación de 2 factores** en tu cuenta de Google
2. Genera una **Contraseña de aplicación**:
   - Ve a [https://myaccount.google.com/security](https://myaccount.google.com/security)
   - "Contraseñas de aplicación"
   - Selecciona "Correo" y "Windows"
   - Copia la contraseña generada

3. En tu `.env`:
```env
SMTP_SERVICE=gmail
SMTP_USER=tu-email@gmail.com
SMTP_PASS=contraseña-generada-de-16-caracteres
ADMIN_EMAIL=licgonzalezcandela@gmail.com
```

### Opción B: Servidor SMTP personalizado

```env
SMTP_HOST=smtp.tu-proveedor.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu-usuario@tu-dominio.com
SMTP_PASS=tu-contraseña
ADMIN_EMAIL=licgonzalezcandela@gmail.com
```

### Opción C: Mailgun, SendGrid, etc.

Configura según las credenciales SMTP de tu proveedor.

## ▶️ Ejecutar

**Desarrollo (con nodemon):**
```bash
npm run dev
```

**Producción:**
```bash
npm start
```

El servidor se ejecutará en `http://localhost:3000` (o el puerto configurado)

## 🔌 Endpoints

### POST `/api/notify/cita`
Envía notificación cuando se recibe una solicitud de cita.

**Body:**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "disponibilidad": "Lunes y miércoles por la tarde",
  "modalidad": "Online"
}
```

### POST `/api/notify/resena`
Envía notificación cuando se recibe una reseña.

**Body:**
```json
{
  "apodo": "María",
  "texto": "Excelente experiencia con Candela..."
}
```

### GET `/api/health`
Verifica que el servidor esté funcionando.

## 🔗 Integración con el Frontend

Los archivos `booking.js` e `index.html` ya están configurados para enviar requests a este backend.

**URLs a usar:**
- Local: `http://localhost:3000`
- Producción: Tu URL del servidor (Heroku, Railway, etc.)

## 📤 Deploy

### Opción 1: Heroku (Gratis)

1. Instala [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
2. Login: `heroku login`
3. Crea app: `heroku create nombre-de-tu-app`
4. Configura variables de entorno:
   ```bash
   heroku config:set SMTP_USER=tu-email@gmail.com
   heroku config:set SMTP_PASS=tu-contraseña
   heroku config:set ADMIN_EMAIL=licgonzalezcandela@gmail.com
   ```
5. Deploy: `git push heroku main`

### Opción 2: Railway

1. Conecta tu repositorio a [railway.app](https://railway.app)
2. Configura variables de entorno en el dashboard
3. Deploy automático

### Opción 3: Tu propio servidor

1. Sube los archivos a tu servidor
2. Ejecuta `npm install`
3. Configura `.env` con tus credenciales SMTP
4. Usa PM2 o similar para mantener el proceso activo
5. Configura un proxy reverso (nginx, Apache)

## ⚠️ Variables de Entorno Importantes

```env
ADMIN_EMAIL=licgonzalezcandela@gmail.com  # Email destino de notificaciones
SMTP_USER=tu-email@gmail.com              # Tu correo
SMTP_PASS=tu-contraseña                   # Contraseña o token
CORS_ORIGIN=https://tu-dominio.com        # Origen permitido
PORT=3000                                  # Puerto
```

## 🧪 Pruebas

Para probar localmente sin deploy:

```bash
# Terminal 1: Inicia el backend
npm run dev

# Terminal 2: Prueba un endpoint
curl -X POST http://localhost:3000/api/notify/cita \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test",
    "email": "test@example.com",
    "disponibilidad": "Lunes",
    "modalidad": "Online"
  }'
```

## 🐛 Troubleshooting

**Error: "No se pudo verificar conexión SMTP"**
- Verifica que SMTP_USER y SMTP_PASS sean correctos
- Si es Gmail, asegúrate de usar contraseña de aplicación
- Algunos servidores SMTP pueden bloquear conexiones: revisa configuración de firewall

**Error: CORS**
- Asegúrate que la URL del frontend esté en la lista de `origin` en server.js

**Port en uso**
- Cambia `PORT=3000` en `.env` a otro puerto disponible

## 📝 Logs

El servidor muestra logs útiles:
```
✓ Conexión SMTP verificada correctamente
✓ Servidor corriendo en puerto 3000
```

## 🔐 Seguridad

- Las credenciales SMTP se guardan en `.env` (nunca committear este archivo)
- CORS está restringido a dominios específicos
- Headers de seguridad configurados
- Validación de datos en los endpoints

## 📄 Licencia

Proyecto personal de Candela González
