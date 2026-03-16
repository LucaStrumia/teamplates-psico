# 🚀 SETUP GUÍA RÁPIDA - Backend de Emails

## Paso 1: Instalar Node.js y dependencias

```bash
# Asegúrate de tener Node.js instalado (v14 o superior)
node --version

# Navega a la carpeta backend
cd "c:\Users\luca_\Documents\proyectos\Teamplates Psico\backend"

# Instala las dependencias
npm install
```

## Paso 2: Configurar Gmail

1. **Activa la autenticación de dos factores** en tu cuenta Google:
   - Ve a https://myaccount.google.com
   - Seguridad → Verificación en dos pasos

2. **Genera una contraseña de aplicación**:
   - Ve a https://myaccount.google.com/apppasswords
   - Selecciona "Correo" y "Windows"
   - Google te genera una contraseña de 16 caracteres
   - **Cópiala sin espacios**

3. **Crea el archivo .env**:
   - Copia `.env.example` a `.env` en la carpeta backend
   - Abre `.env` y rellena:

```env
SMTP_SERVICE=gmail
SMTP_USER=licgonzalezcandela@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx
ADMIN_EMAIL=licgonzalezcandela@gmail.com
PORT=3000
```

## Paso 3: Prueba el servidor

```bash
# En la carpeta backend, ejecuta:
npm run dev

# Deberías ver:
# ✓ Conexión SMTP verificada correctamente
# ✓ Servidor corriendo en puerto 3000
```

## Paso 4: Prueba un email

**Abre otro terminal** y ejecuta:

```bash
# En Windows PowerShell:
$body = @{
    nombre = "Test"
    email = "test@example.com"
    disponibilidad = "Lunes"
    modalidad = "Online"
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
}

Invoke-WebRequest -Uri "http://localhost:3000/api/notify/cita" `
                  -Method POST `
                  -Body $body `
                  -Headers $headers
```

Deberías recibir un email en licgonzalezcandela@gmail.com ✓

## Paso 5: Deploy a producción

### Opción A: Heroku (Recomendado)

1. **Crea cuenta en** https://heroku.com

2. **Instala Heroku CLI**:
   - Windows: Descarga desde https://devcenter.heroku.com/articles/heroku-cli

3. **Deploy**:
```bash
# En la carpeta backend
heroku login
heroku create mi-backend-psico
heroku config:set SMTP_SERVICE=gmail
heroku config:set SMTP_USER=licgonzalezcandela@gmail.com
heroku config:set SMTP_PASS="xxxx xxxx xxxx xxxx"
heroku config:set ADMIN_EMAIL=licgonzalezcandela@gmail.com
git push heroku main
```

Tu URL será algo como: `https://mi-backend-psico.herokuapp.com`

### Opción B: Railway

1. Ve a https://railway.app
2. "New Project" → conecta tu repositorio GitHub
3. Configura variables en Settings
4. Deploy automático

Tu URL: `https://proyecto-xxxxx.railway.app`

## Paso 6: Actualizar URLs del frontend

Una vez tengas tu URL de producción, actualiza estos archivos:

**En `booking.js` línea ~87:**
```javascript
const backendURL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000'
    : 'https://mi-backend-psico.herokuapp.com'; // ← Reemplaza aquí
```

**En `index.html` línea ~700:**
```javascript
const backendURL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000'
    : 'https://mi-backend-psico.herokuapp.com'; // ← Reemplaza aquí
```

## ✅ Checklist Final

- [ ] Node.js instalado
- [ ] npm install ejecutado
- [ ] .env creado con credenciales Gmail
- [ ] Servidor inicia sin errores (npm run dev)
- [ ] Email de prueba enviado exitosamente
- [ ] Deployed en Heroku/Railway
- [ ] URLs de frontend actualizadas
- [ ] Prueba en sitio web en vivo

## 🆘 Problemas Comunes

**"Error: Cannot find module 'nodemailer'"**
→ Ejecuta `npm install` en la carpeta backend

**"ECONNREFUSED en localhost:3000"**
→ El servidor no está corriendo. Ejecuta `npm run dev`

**"SMTP Error: Invalid login"**
→ Verifica que usaste la contraseña de aplicación (16 caracteres)

**No recibo email**
→ Revisa carpeta Spam
→ Verifica que ADMIN_EMAIL sea correcto

**CORS Error en consola**
→ Asegúrate que la URL del frontend está en la lista `origin` de server.js

## 📞 Soporte

- Revisa los logs en la consola
- Verifica que .env esté en la carpeta backend
- Comprueba que nodemailer esté instalado: `npm list nodemailer`
