# 🚀 Desplegar en Railway

## Paso 1: Crear Cuenta en Railway

1. Ve a https://railway.app
2. Haz click en **"Start Now"**
3. **Conecta tu GitHub** (autoriza Railway)

---

## Paso 2: Crear un Nuevo Proyecto

1. En el dashboard de Railway, click **"New Project"**
2. Selecciona **"Deploy from GitHub repo"**
3. Selecciona el repo: **`licgonzalezcandela/Teamplates-Psico`** (o similar)
4. **Authorize** si es necesario

---

## Paso 3: Configurar el Backend

Railway detectará automáticamente que es Node.js.

1. Click en **"Deploy"** (o deja que lo haga automáticamente)
2. Espera 2-3 minutos mientras Railway construye y deploya

---

## Paso 4: Agregar Variables de Entorno

Una vez que esté en Railway:

1. Abre el proyecto
2. Click en **"Variables"**
3. Agrega estas variables (copia exactamente):

   ```
   NODE_ENV=production
   ADMIN_EMAIL=licgonzalezcandela@gmail.com
   SENDER_EMAIL=lswork000@gmail.com
   MAILERSEND_API_KEY=mlsn.8c94940d27a7aadc4e590974676400beca5860caf822e3ad3f917e8580bc57d4
   CORS_ORIGIN=https://licgonzalezcandela.github.io
   ```

4. **Save** y el servidor se reiniciará automáticamente

---

## Paso 5: Obtener la URL

En Railway:

1. En tu proyecto, busca **"Settings"** o **"Environment"**
2. Busca algo como **"Railway Domains"** o **"Public URL"**
3. Verás algo como: `https://mi-backend-railway-xxxxx.up.railway.app`

**COPIA ESA URL** 👆

---

## Paso 6: Actualizar URLs en Frontend

Una vez que tengas la URL de Railway:

1. Abre `templates/portfolio-1/booking.js`
2. Busca esta línea (aprox línea 97):
   ```javascript
   const backendURL = window.location.hostname === 'localhost' 
       ? 'http://localhost:3000'
       : 'https://tu-backend-produccion.com';
   ```

3. Reemplaza con tu URL real:
   ```javascript
   const backendURL = window.location.hostname === 'localhost' 
       ? 'http://localhost:3000'
       : 'https://tu-url-de-railway-aqui.up.railway.app';
   ```

4. **Guarda y haz commit a GitHub**

---

## Paso 7: Verificar que Funciona

1. Espera 2-3 minutos para que los cambios se propaguen
2. Ve a: https://licgonzalezcandela.github.io
3. Llena un formulario de cita
4. Verifica que:
   - Railway recibe la solicitud (chequea los logs en Railway)
   - Email se genera en `backend/logs/` (en Railway)

---

## ✅ Verificar en Railway

Para ver los logs en tiempo real:

1. En tu proyecto Railway
2. Click en **"Deployments"**
3. Selecciona el deployment actual
4. Click en **"View Logs"** para ver las solicitudes en vivo

---

## 🚨 Si Algo Falla

### Error: "Cannot find module"
- Railway no tiene tus dependencias
- **Solución**: Asegúrate que `package.json` está en `backend/`

### Error: "Port already in use"
- Railway asigna el puerto automáticamente
- **Solución**: El código ya lo maneja con `process.env.PORT`

### Frontend no se conecta
- La URL en `booking.js` es incorrecta
- **Solución**: Copia exactamente la URL de Railway en el if/else

### Email no se envía
- Las variables de entorno no están configuradas
- **Solución**: Verifica que `MAILERSEND_API_KEY` y `ADMIN_EMAIL` estén en Railway

---

## 📍 Si Todo Funciona

Deberías ver en los logs de Railway:

```
✓ Servidor corriendo en puerto XXXXX
POST /api/notify/cita - 200 ✓
Email guardado: cita-2026-03-16T...html
```

**¡LISTO! 🎉**
