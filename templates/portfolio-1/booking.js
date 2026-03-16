/**
 * BOOKING.JS - Sistema de agendamiento para el visitante
 * Maneja el formulario en index.html
 */

document.addEventListener('DOMContentLoaded', () => {
    initBookingForm();
});

function initBookingForm() {
    // Cargar modalidades en el select
    const selModalidad = document.getElementById('b-modalidad');
    if (selModalidad) {
        const modalidades = ['Online', 'Presencial'];
        modalidades.forEach(m => {
            const opt = document.createElement('option');
            opt.value = m;
            opt.textContent = m;
            selModalidad.appendChild(opt);
        });
    }

    // Submit
    const form = document.getElementById('booking-form');
    if (form) form.addEventListener('submit', onSubmitBooking);
}

function onSubmitBooking(e) {
    e.preventDefault();
    hideBookingError();

    const nombre    = document.getElementById('b-nombre').value.trim();
    const email     = document.getElementById('b-email').value.trim();
    const telefono  = document.getElementById('b-telefono').value.trim();
    const disponibilidad = document.getElementById('b-disponibilidad').value.trim();
    const modalidad = document.getElementById('b-modalidad').value;
    const motivo    = document.getElementById('b-motivo').value.trim();

    // Validar
    if (!nombre)                     { showBookingError('Por favor ingresa tu nombre completo.'); return; }
    if (!email || !email.includes('@')) { showBookingError('Por favor ingresa un email valido.'); return; }
    if (!disponibilidad)             { showBookingError('Por favor indica tus dias y horarios disponibles.'); return; }
    if (!modalidad)                  { showBookingError('Por favor selecciona la modalidad.'); return; }

    // Guardar cita
    const cita = crearCita({ nombre, email, telefono, disponibilidad, modalidad, motivo });

    // Enviar notificación por email
    enviarNotificacionCita(nombre, email, disponibilidad, modalidad);

    // Mostrar confirmacion
    showBookingSuccess(cita);
}

function showBookingSuccess(cita) {
    document.getElementById('booking-form-view').classList.add('hidden');
    const successView = document.getElementById('booking-success-view');
    successView.classList.remove('hidden');
    successView.classList.add('flex');

    const resumen = document.getElementById('booking-resumen');
    resumen.innerHTML = `
        <div class="space-y-1.5 text-stone-700">
            <p><span class="font-semibold text-stone-900">Nombre:</span> ${cita.nombre}</p>
            <p><span class="font-semibold text-stone-900">Disponibilidad:</span> ${cita.disponibilidad}</p>
            <p><span class="font-semibold text-stone-900">Modalidad:</span> ${cita.modalidad}</p>
            <p class="text-xs text-stone-400 pt-1">ID de reserva: #${cita.id}</p>
        </div>
    `;
}

function resetBookingForm() {
    document.getElementById('booking-form').reset();
    document.getElementById('booking-success-view').classList.add('hidden');
    document.getElementById('booking-success-view').classList.remove('flex');
    document.getElementById('booking-form-view').classList.remove('hidden');
    hideBookingError();
    initBookingForm();
}

function showBookingError(msg) {
    const el = document.getElementById('booking-error');
    if (el) { el.textContent = msg; el.classList.remove('hidden'); }
}
function hideBookingError() {
    const el = document.getElementById('booking-error');
    if (el) el.classList.add('hidden');
}

function enviarNotificacionCita(nombre, email, disponibilidad, modalidad) {
    // URL del backend - Detección automática: localhost (dev) o producción
    const backendURL = window.location.hostname === 'localhost' 
        ? 'http://localhost:3000'
        : 'https://tu-backend-produccion.com'; // ← REEMPLAZA CON TU URL DE BACKEND
    
    fetch(`${backendURL}/api/notify/cita`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            nombre: nombre,
            email: email,
            disponibilidad: disponibilidad,
            modalidad: modalidad
        })
    }).then(res => res.json())
      .then(data => console.log('✓ Notificación enviada', data))
      .catch(err => console.log('Notificación en cola (sin internet)'));
}