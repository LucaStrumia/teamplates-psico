# 🟢 LISTO PARA ACTIVAR

El sistema está completamente configurado. Solo falta **1 PASO**:

## ✅ Qué está hecho:

- ✓ Backend instalado (Node.js + dependencias)
- ✓ .env creado
- ✓ URLs frontend configuradas (detección automática localhost/producción)
- ✓ Servidor listo para iniciar

## ⚠️ PASO FINAL: Generar contraseña de Gmail

1. **Abre tu cuenta Google**:
   - Ve a https://myaccount.google.com
   
2. **Activa 2FA** (si no lo hiciste):
   - Seguridad → Verificación en dos pasos
   
3. **Genera app password**:
   - Ve a https://myaccount.google.com/apppasswords
   - Selecciona: "Correo" y "Windows"
   - Google te genera una contraseña de 16 caracteres (ej: `abcd efgh ijkl mnop`)
   
4. **Copia la contraseña sin espacios**:
   - Ej: `abcdefghijklmnop`
   
5. **Reemplaza en `backend/.env`**:
   ```env
   SMTP_PASS=abcdefghijklmnop
   ```
   
6. **Listo!** El servidor está a 100% funcional

## ✓ Cómo probar que funciona:

```bash
# En la carpeta backend
npm run dev

# Deberías ver:
# ✓ Conexión SMTP verificada correctamente
# ✓ Servidor corriendo en puerto 3000
```

Luego prueba el formulario de booking en el sitio web → deberías recibir un email.

---

**Nota**: Si vas a deployar a producción (Heroku/Railway):
1. Reemplaza `'https://tu-backend-produccion.com'` en booking.js e index.html
2. Sigue los pasos en `backend/README.md`
