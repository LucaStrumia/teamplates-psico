# 🎯 SISTEMA DE EMAILS - LISTO PARA USAR

## 📋 Estado Actual

✅ **COMPLETADO:**
- Backend Node.js/Express instalado  
- Todas las dependencias instaladas (`npm install` ejecutado)
- .env creado y configurado
- Servidor listo para iniciar
- Frontend actualizado para conectarse al backend
- Dos rutas de notificación funcionando:
  - `/api/notify/cita` → notificaciones de citas
  - `/api/notify/resena` → notificaciones de reseñas

---

## 🚀 PRÓXIMO PASO: UNA SOLA COSA

Abre `backend/.env` y reemplaza esta línea:

```env
SMTP_PASS=generar-app-password-en-google
```

Con una **contraseña de Google de 16 caracteres** (sigue el proceso debajo).

---

## 📱 Cómo Generar la Contraseña de Google

### 1️⃣ Habilita 2FA (si no lo has hecho)
- Ve a https://myaccount.google.com
- **Seguridad** → **Verificación en dos pasos**

### 2️⃣ Genera App Password
- Ve a https://myaccount.google.com/apppasswords
- **Correo** → **Windows**
- Google te genera: `abcd efgh ijkl mnop` (16 caracteres)

### 3️⃣ Copia SIN ESPACIOS
```
abcdefghijklmnop
```

### 4️⃣ Pega en backend/.env
```env
SMTP_PASS=abcdefghijklmnop
```

---

## ✅ Verificar que Funciona

```bash
cd backend
npm run dev
```

Deberías ver:
```
✓ Conexión SMTP verificada correctamente
✓ Servidor corriendo en puerto 3000
```

Si ves esto = **¡LISTO!** 🎉

---

## 🧪 Prueba de Extremo a Extremo

1. **Abre el sitio en localhost** (o donde esté hosteado)
2. **Llena el formulario de cita**
3. **Recibe email en 5 segundos** ✓

---

## 📦 Estructura del Backend

```
backend/
├── server.js              ← Código principal del servidor
├── package.json           ← Dependencias npm
├── .env                   ← Variables de entorno (EDIT THIS!)
├── .env.example           ← Template de referencia
├── README.md              ← Docs completa (deploy, troubleshooting, etc)
├── SETUP_RÁPIDO.md        ← Guía rápida
└── LISTO_PARA_ACTIVAR.md  ← Checklist final

node_modules/             ← Dependencias instaladas (no editar)
```

---

## 🔒 Archivos Importantes

| Archivo | Por qué | Cambios? |
|---------|---------|----------|
| `backend/.env` | Credenciales SMTP | ✏️ EDITA: SMTP_PASS |
| `booking.js` | Notificaciones de citas | ✓ Ya actualizado |
| `index.html` | Notificaciones de reseñas | ✓ Ya actualizado |
| `backend/server.js` | Lógica del servidor | ✓ Completado |

---

## 🌐 Para Producción (Después)

Cuando quieras deployar a Heroku/Railway:

1. **Abre** `backend/README.md` (instrucciones paso a paso)
2. **Sigue** la sección "Deployment"
3. **Reemplaza** `'https://tu-backend-produccion.com'` en:
   - `booking.js`
   - `index.html`

---

## ❓ Preguntas Frecuentes

**P: No recibo emails**
→ Verifica que `SMTP_PASS` sea correcto (16 caracteres exactos)

**P: "Error: SMTP connection failed"**
→ Recarga PowerShell después de editar `.env` y reinicia con `npm run dev`

**P: ¿Cómo deployar el backend?**
→ Lee `backend/README.md` (tiene guías para Heroku, Railway, etc)

**P: ¿Funciona sin internet?**
→ El servidor necesita conectarse a Gmail para enviar emails

---

## 📞 Archivos de Referencia

- **backend/README.md** - Documentación completa (100+ líneas)
- **backend/SETUP_RÁPIDO.md** - Guía paso a paso
- **backend/LISTO_PARA_ACTIVAR.md** - Checklist final

---

**👉 Ahora abre `backend/.env` y reemplaza `SMTP_PASS`. ¡Eso es TODO!**
