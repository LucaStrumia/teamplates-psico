/**
 * BACKEND - Servidor Express para envío de emails
 * Maneja notificaciones de citas y reseñas
 */

require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: ['https://licgonzalezcandela.github.io', 'http://localhost:5500', 'http://localhost:3000'],
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

// Configurar transporte de correo
let transporter;

function initTransporter() {
    if (process.env.SMTP_SERVICE === 'gmail') {
        transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });
    } else {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }
}

// Verificar conexión a servidor SMTP
async function verifyConnection() {
    try {
        await transporter.verify();
        console.log('✓ Conexión SMTP verificada correctamente');
        return true;
    } catch (error) {
        console.error('✗ Error en conexión SMTP:', error.message);
        return false;
    }
}

// Ruta: Enviar notificación de cita
app.post('/api/notify/cita', async (req, res) => {
    try {
        const { nombre, email, disponibilidad, modalidad } = req.body;

        if (!nombre || !email || !disponibilidad || !modalidad) {
            return res.status(400).json({ error: 'Faltan datos requeridos' });
        }

        const mailOptions = {
            from: `"Candela González" <${process.env.SMTP_USER}>`,
            to: process.env.ADMIN_EMAIL,
            subject: '📅 Nueva cita para confirmar',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #92400e; border-bottom: 3px solid #92400e; padding-bottom: 10px;">
                        📅 Nueva Cita Recibida
                    </h2>
                    
                    <div style="background-color: #fdf8f3; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>Nombre:</strong> ${nombre}</p>
                        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                        <p><strong>Disponibilidad:</strong> ${disponibilidad}</p>
                        <p><strong>Modalidad:</strong> ${modalidad}</p>
                        <p style="color: #666; font-size: 12px; margin-top: 10px;">
                            Fecha: ${new Date().toLocaleString('es-AR')}
                        </p>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <a href="https://licgonzalezcandela.github.io/templates/portfolio-1/admin.html" 
                           style="background-color: #92400e; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                            Ir al Panel Admin
                        </a>
                    </div>
                    
                    <p style="color: #999; font-size: 12px; margin-top: 30px; text-align: center;">
                        Este es un email automático del sistema de la página web.
                    </p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Notificación de cita enviada' });
    } catch (error) {
        console.error('Error enviando cita:', error);
        res.status(500).json({ error: 'Error al enviar notificación' });
    }
});

// Ruta: Enviar notificación de reseña
app.post('/api/notify/resena', async (req, res) => {
    try {
        const { apodo, texto } = req.body;

        if (!texto) {
            return res.status(400).json({ error: 'Falta el texto de la reseña' });
        }

        const mailOptions = {
            from: `"Candela González" <${process.env.SMTP_USER}>`,
            to: process.env.ADMIN_EMAIL,
            subject: '⭐ Nueva reseña para revisar',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #92400e; border-bottom: 3px solid #92400e; padding-bottom: 10px;">
                        ⭐ Nueva Reseña Recibida
                    </h2>
                    
                    <div style="background-color: #fdf8f3; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>De:</strong> ${apodo || 'Anónimo'}</p>
                        <p><strong>Reseña:</strong></p>
                        <p style="font-style: italic; color: #555; padding: 10px; background-color: white; border-left: 4px solid #d4af37; margin: 10px 0;">
                            "${texto}"
                        </p>
                        <p style="color: #666; font-size: 12px; margin-top: 10px;">
                            Fecha: ${new Date().toLocaleString('es-AR')}
                        </p>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <a href="https://licgonzalezcandela.github.io/templates/portfolio-1/admin.html" 
                           style="background-color: #92400e; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                            Ir al Panel Admin
                        </a>
                    </div>
                    
                    <p style="color: #999; font-size: 12px; margin-top: 30px; text-align: center;">
                        Este es un email automático del sistema de la página web.
                    </p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Notificación de reseña enviada' });
    } catch (error) {
        console.error('Error enviando reseña:', error);
        res.status(500).json({ error: 'Error al enviar notificación' });
    }
});

// Ruta de salud
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo global de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: err.message || 'Error interno del servidor',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Iniciar servidor
async function startServer() {
    try {
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.error('❌ Error: Configura las variables SMTP_USER y SMTP_PASS en .env');
            process.exit(1);
        }

        initTransporter();
        const isConnected = await verifyConnection();
        if (!isConnected) {
            console.error('❌ No se pudo verificar la conexión SMTP');
            process.exit(1);
        }

        app.listen(PORT, () => {
            console.log(`\n✓ Servidor corriendo en puerto ${PORT}`);
            console.log(`  → Health check: http://localhost:${PORT}/api/health`);
            console.log(`  → Notificación de cita: POST http://localhost:${PORT}/api/notify/cita`);
            console.log(`  → Notificación de reseña: POST http://localhost:${PORT}/api/notify/resena\n`);
        });
    } catch (error) {
        console.error('Error al iniciar servidor:', error);
        process.exit(1);
    }
}

startServer();
