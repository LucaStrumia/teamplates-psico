/**
 * BACKEND - Servidor Express para notificaciones
 * Modo desarrollo: guarda emails en archivos HTML
 * Modo producción: envía emails vía MailerSend
 */

// Manejo de errores no capturados ANTES de cualquier otro código
process.on('uncaughtException', (err) => {
    console.error('❌ UNCAUGHT EXCEPTION:', err);
    console.error(err.stack);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ UNHANDLED REJECTION at:', promise);
    console.error('❌ Reason:', reason);
    process.exit(1);
});

// Cargar .env solo en desarrollo (en Railway usa variables de entorno)
try {
    require('dotenv').config();
} catch (err) {
    console.log('⚠️ No se pudo cargar .env (esperado en producción)');
}

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Log de configuración inicial
console.log('🚀 Iniciando servidor...');
console.log(`📌 NODE_ENV: "${NODE_ENV}"`);
console.log(`📌 PORT: "${PORT}"`);
console.log(`📌 MAILERSEND_API_KEY: ${process.env.MAILERSEND_API_KEY ? '✓ Configurada' : '❌ NO configurada'}`);
console.log(`📌 SENDER_EMAIL: ${process.env.SENDER_EMAIL || '❌ NO configurada'}`);
console.log(`📌 ADMIN_EMAIL: ${process.env.ADMIN_EMAIL || '❌ NO configurada'}`);

// Crear carpeta de logs si no existe (solo en desarrollo)
// En producción NO crear archivos locales
const logsDir = path.join(__dirname, 'logs');
let canWriteLogs = false;

if (NODE_ENV === 'development') {
    try {
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir, { recursive: true });
        }
        canWriteLogs = true;
        console.log(`✓ Directorio de logs creado/verificado: ${logsDir}`);
    } catch (err) {
        console.warn(`⚠️ No se pudo crear directorio de logs: ${err.message}`);
        canWriteLogs = false;
    }
}

// Middleware
const CORS_ORIGIN = process.env.CORS_ORIGIN?.split(',').map(url => url.trim()) || [
    'http://localhost:3000',
    'http://localhost:8000',
    'https://lucastrumia.github.io',
    'https://licgonzalezcandela.github.io'
];

app.use(cors({
    origin: CORS_ORIGIN,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de seguridad
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// Función para enviar email con MailerSend
async function sendEmailWithMailerSend(to, subject, htmlContent) {
    try {
        const apiKey = process.env.MAILERSEND_API_KEY;
        const senderEmail = process.env.SENDER_EMAIL || 'lswork000@gmail.com';
        
        if (!apiKey) {
            console.warn('⚠️ MAILERSEND_API_KEY no configurada - email no será enviado');
            return { success: false, reason: 'API key not configured' };
        }

        console.log(`📤 Intentando enviar email a ${to} desde ${senderEmail}`);
        console.log(`🔑 API Key configurada (longitud: ${apiKey.length})`);

        const response = await fetch('https://api.mailersend.com/v1/email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                from: {
                    email: senderEmail,
                    name: 'Candela González'
                },
                to: [
                    {
                        email: to,
                        name: to
                    }
                ],
                subject: subject,
                html: htmlContent
            })
        });

        console.log(`📊 Response status: ${response.status}`);
        console.log(`📋 Response headers: ${JSON.stringify([...response.headers.entries()])}`);

        if (response.status === 202) {
            // 202 Accepted - Email fue aceptado por MailerSend
            const messageId = response.headers.get('x-message-id');
            console.log(`✓ Email enviado exitosamente a ${to} (Message ID: ${messageId})`);
            return { success: true, messageId: messageId };
        } else if (response.ok) {
            // Otros 2xx - intenta parsear JSON
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                console.log(`✓ Email enviado a ${to} mediante MailerSend`);
                return { success: true, messageId: data.message_id };
            } else {
                console.log(`✓ Email enviado a ${to} (status ${response.status})`);
                return { success: true, messageId: null };
            }
        } else {
            // Error
            try {
                const errorData = await response.json();
                console.error(`❌ Error enviando email con MailerSend:`, errorData);
                return { success: false, error: errorData };
            } catch (jsonError) {
                const errorText = await response.text();
                console.error(`❌ Error enviando email con MailerSend (status ${response.status})`);
                console.error(`   Response body: ${errorText.substring(0, 500)}`);
                return { success: false, error: errorText };
            }
        }
    } catch (error) {
        console.error('❌ Error conectando con MailerSend:', error.message);
        console.error('❌ Stack trace:', error.stack);
        return { success: false, error: error.message };
    }
}

// Función para guardar email en archivo HTML (solo en desarrollo)
function saveEmailToFile(type, to, subject, htmlContent, data) {
    // En producción o si no se puede escribir, no guardar archivos
    if (NODE_ENV === 'production' || !canWriteLogs) {
        return null;
    }
    
    try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `${type}-${timestamp}.html`;
    const filepath = path.join(logsDir, filename);
    
    const fullHTML = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px; }
        .container { max-width: 700px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 4px; margin-bottom: 25px; }
        .header h2 { margin: 0; font-size: 20px; }
        .meta { background: #f0f0f0; padding: 15px; border-radius: 4px; margin-bottom: 25px; font-size: 13px; border-left: 4px solid #667eea; }
        .data { background: #e8f4f8; padding: 20px; border-radius: 4px; margin-bottom: 25px; }
        .data p { margin: 8px 0; }
        .content { margin-top: 25px; padding-top: 25px; border-top: 2px solid #eee; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #999; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>${subject}</h2>
        </div>
        
        <div class="meta">
            <strong>📧 Para:</strong> ${to}<br>
            <strong>📅 Fecha:</strong> ${new Date().toLocaleString('es-AR')}<br>
            <strong>🔑 ID:</strong> ${timestamp}
        </div>
        
        <div class="data">
            <strong>📋 Datos del Formulario:</strong><br><br>
            ${Object.entries(data).map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`).join('')}
        </div>
        
        <div class="content">
            <h3>Contenido del Email:</h3>
            ${htmlContent}
        </div>
        
        <div class="footer">
            <p>Este archivo de prueba fue generado por el servidor en modo desarrollo.</p>
            <p>En producción, estos emails se enviarían a través de un servicio de email SMTP.</p>
        </div>
    </div>
</body>
</html>
    `;
    
        fs.writeFileSync(filepath, fullHTML);
        return filepath;
    } catch (err) {
        console.error(`⚠️ Error al guardar archivo de email: ${err.message}`);
        return null;
    }
}

// POST /api/notify/cita - Notificación de nueva cita
app.post('/api/notify/cita', async (req, res) => {
    try {
        const { nombre, email, disponibilidad, modalidad } = req.body;

        if (!nombre || !email) {
            return res.status(400).json({ error: 'Nombre y email requeridos' });
        }

        const adminEmail = process.env.ADMIN_EMAIL || 'licgonzalezcandela@gmail.com';
        const subject = '📅 Nueva cita para confirmar - Candela González';
        
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                    <h2 style="margin: 0;">📅 Nueva Cita Recibida</h2>
                </div>
                
                <div style="background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 8px 8px;">
                    <h3 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Detalles de la Cita:</h3>
                    
                    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                        <tr style="background: #f0f0f0;">
                            <td style="padding: 12px; font-weight: bold; width: 30%;">Nombre:</td>
                            <td style="padding: 12px;">${nombre}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px; font-weight: bold;">Email:</td>
                            <td style="padding: 12px;"><a href="mailto:${email}">${email}</a></td>
                        </tr>
                        <tr style="background: #f0f0f0;">
                            <td style="padding: 12px; font-weight: bold;">Disponibilidad:</td>
                            <td style="padding: 12px;">${disponibilidad || 'No especificada'}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px; font-weight: bold;">Modalidad:</td>
                            <td style="padding: 12px;">${modalidad || 'No especificada'}</td>
                        </tr>
                    </table>

                    <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #ddd;">
                        <p style="color: #666; font-size: 14px;">
                            Accede al dashboard de administración para confirmar o rechazar la cita:
                        </p>
                        <a href="https://licgonzalezcandela.github.io/templates/portfolio-1/admin.html" 
                           style="display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 10px 0;">
                            Ir al Panel de Admin
                        </a>
                    </div>

                    <p style="color: #999; font-size: 12px; margin-top: 30px;">
                        Este email fue generado automáticamente. Por favor no responder directamente.
                    </p>
                </div>
            </div>
        `;

        const filepath = saveEmailToFile('cita', adminEmail, subject, htmlContent, {
            nombre,
            email,
            disponibilidad: disponibilidad || 'No especificada',
            modalidad: modalidad || 'No especificada'
        });

        // Intentar enviar email con MailerSend
        const emailSent = await sendEmailWithMailerSend(adminEmail, subject, htmlContent);

        if (filepath) {
            console.log(`✓ Email de cita guardado: logs/${path.basename(filepath)}`);
        } else {
            console.log(`✓ Email de cita enviado vía MailerSend (modo producción)`);
        }

        res.json({ 
            success: true, 
            message: emailSent.success ? '✓ Cita registrada - Email enviado' : '✓ Cita registrada (email notificado)',
            file: filepath ? path.basename(filepath) : 'N/A',
            emailSent: emailSent.success,
            emailError: emailSent.success ? null : (emailSent.error || emailSent.reason || 'unknown'),
            data: { nombre, email, disponibilidad, modalidad }
        });
    } catch (error) {
        console.error('❌ Error en /api/notify/cita:', error);
        res.status(500).json({ 
            error: 'No se pudo guardar la notificación',
            details: error.message 
        });
    }
});

// POST /api/notify/resena - Notificación de nueva reseña
app.post('/api/notify/resena', async (req, res) => {
    try {
        const { apodo, texto } = req.body;

        if (!apodo || !texto) {
            return res.status(400).json({ error: 'Apodo y texto requeridos' });
        }

        const adminEmail = process.env.ADMIN_EMAIL || 'licgonzalezcandela@gmail.com';
        const subject = '⭐ Nueva reseña para revisar - Candela González';
        
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                    <h2 style="margin: 0;">⭐ Nueva Reseña Recibida</h2>
                </div>
                
                <div style="background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 8px 8px;">
                    <h3 style="color: #333; border-bottom: 2px solid #f5576c; padding-bottom: 10px;">Detalles de la Reseña:</h3>
                    
                    <div style="background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #f5576c; border-radius: 4px;">
                        <p style="color: #666; font-weight: bold; margin: 0 0 10px 0;">De: ${apodo}</p>
                        <p style="color: #333; line-height: 1.6; margin: 0;">${texto}</p>
                    </div>

                    <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #ddd;">
                        <p style="color: #666; font-size: 14px;">
                            Accede al dashboard para aprobar o rechazar esta reseña:
                        </p>
                        <a href="https://licgonzalezcandela.github.io/templates/portfolio-1/admin.html" 
                           style="display: inline-block; background: #f5576c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 10px 0;">
                            Ir al Panel de Admin
                        </a>
                    </div>

                    <p style="color: #999; font-size: 12px; margin-top: 30px;">
                        Este email fue generado automáticamente. Por favor no responder directamente.
                    </p>
                </div>
            </div>
        `;

        const filepath = saveEmailToFile('resena', adminEmail, subject, htmlContent, {
            apodo,
            texto
        });

        // Intentar enviar email con MailerSend
        const emailSent = await sendEmailWithMailerSend(adminEmail, subject, htmlContent);

        if (filepath) {
            console.log(`✓ Email de reseña guardado: logs/${path.basename(filepath)}`);
        } else {
            console.log(`✓ Email de reseña enviado vía MailerSend (modo producción)`);
        }

        res.json({ 
            success: true, 
            message: emailSent.success ? '✓ Reseña registrada - Email enviado' : '✓ Reseña registrada (email notificado)',
            file: filepath ? path.basename(filepath) : 'N/A',
            emailSent: emailSent.success,
            data: { apodo, texto }
        });
    } catch (error) {
        console.error('❌ Error en /api/notify/resena:', error);
        res.status(500).json({ 
            error: 'No se pudo guardar la notificación',
            details: error.message 
        });
    }
});

// GET / - Root health check (para Railway y navegadores)
app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running', mode: NODE_ENV });
});

// GET /api/health - Health check (simple y rápido)
app.get('/api/health', (req, res) => {
    try {
        res.json({ status: 'ok', message: 'Server is running', mode: NODE_ENV });
    } catch (err) {
        console.error('Error en health check:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/emails - Ver emails guardados (solo en desarrollo)
app.get('/api/emails', (req, res) => {
    if (NODE_ENV === 'production') {
        return res.status(403).json({ error: 'No disponible en producción' });
    }
    
    try {
        const files = fs.readdirSync(logsDir)
            .filter(f => f.endsWith('.html'))
            .sort()
            .reverse();
        res.json({ 
            total: files.length,
            emails: files,
            location: `${path.resolve(logsDir)}/`
        });
    } catch (error) {
        res.status(500).json({ error: 'No se pudieron leer los emails' });
    }
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error('❌ Error no capturado:', err);
    res.status(500).json({ error: 'Internal server error', message: err.message });
});

// Inicializar servidor
const server = app.listen(PORT, "0.0.0.0", () => {
    console.log('\n' + '='.repeat(60));
    console.log(`✓ Servidor escuchando en 0.0.0.0:${PORT}`);
    console.log(`✓ MODO: ${NODE_ENV.toUpperCase()} ${NODE_ENV === 'production' ? '- Emails enviados vía MailerSend' : '- Emails guardados en archivos HTML'}`);
    console.log('✓ Endpoints disponibles:');
    console.log('  - POST /api/notify/cita     (enviar notificación de cita)');
    console.log('  - POST /api/notify/resena   (enviar notificación de reseña)');
    console.log('  - GET  /api/health          (verificar estado)');
    console.log('  - GET  /api/emails          (ver emails guardados - solo desarrollo)');
    if (NODE_ENV === 'development') {
        console.log(`✓ Carpeta de logs: ${path.resolve(logsDir)}/`);
    }
    console.log('='.repeat(60) + '\n');
});

// Manejo de errores de servidor
server.on('error', (err) => {
    console.error('❌ Error en el servidor:', err);
    console.error('   Código de error:', err.code);
    if (err.code === 'EADDRINUSE') {
        console.error(`   Puerto ${PORT} ya está en uso`);
    }
    process.exit(1);
});

// Listener para cierre inesperado
server.on('close', () => {
    console.error('❌ El servidor se ha cerrado inesperadamente');
    process.exit(1);
});

// Gracias explícitamente para mantener el proceso activo
setInterval(() => {
    // Este interval mantiene el proceso activo indefinidamente
}, 60000);

console.log('✅ Sistema de mantenimiento activo');
