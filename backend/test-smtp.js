require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('🔍 Credenciales cargadas:');
console.log('SMTP_USER:', process.env.SMTP_USER);
console.log('SMTP_PASS:', process.env.SMTP_PASS);
console.log('SMTP_PASS length:', process.env.SMTP_PASS.length);
console.log('');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

console.log('📧 Verificando conexión SMTP...\n');
transporter.verify(function(error, success) {
    if (error) {
        console.log('❌ ERROR:', error.message);
        console.log('\n⚠️  SOLUCIONES POSIBLES:');
        console.log('1. Verifica que hayas copiado la contraseña SIN ESPACIOS');
        console.log('2. Intenta generar una NUEVA contraseña');
        console.log('3. Asegúrate de que 2FA esté activo en tu cuenta Google');
        process.exit(1);
    } else {
        console.log('✓ Conexión SMTP verificada correctamente!');
        console.log('✓ El servidor está listo para enviar emails');
        process.exit(0);
    }
});
