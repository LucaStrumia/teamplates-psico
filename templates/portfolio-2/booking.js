/**
 * BOOKING.JS - Sistema de agendamiento para el visitante
 * Maneja el formulario en index.html
 */

document.addEventListener('DOMContentLoaded', () => {
    initBookingForm();
});

function initBookingForm() {
    const agenda = getAgenda();

    // Cargar modalidades en el select
    const selModalidad = document.getElementById('b-modalidad');
    if (selModalidad) {
        agenda.modalidades.forEach(m => {
            const opt = document.createElement('option');
            opt.value = m;
            opt.textContent = m;
            selModalidad.appendChild(opt);
        });
    }

    // Configurar fecha minima = hoy
    const inputFecha = document.getElementById('b-fecha');
    if (inputFecha) {
        const hoy = new Date();
        inputFecha.min = hoy.toISOString().split('T')[0];
        // Maximo 3 meses hacia adelante
        const max = new Date(hoy);
        max.setMonth(max.getMonth() + 3);
        inputFecha.max = max.toISOString().split('T')[0];

        inputFecha.addEventListener('change', onFechaChange);
    }

    // Submit
    const form = document.getElementById('booking-form');
    if (form) form.addEventListener('submit', onSubmitBooking);
}

function onFechaChange(e) {
    const fecha = e.target.value;
    const selHora = document.getElementById('b-hora');
    if (!selHora) return;

    // Limpiar
    selHora.innerHTML = '';

    if (!fecha) {
        selHora.innerHTML = '<option value="">-- Elegi una fecha primero --</option>';
        return;
    }

    const horarios = getHorariosDisponibles(fecha);

    if (horarios.length === 0) {
        selHora.innerHTML = '<option value="">Sin horarios disponibles ese dia</option>';
        showBookingError('No hay horarios disponibles para esa fecha. Por favor elegi otro dia.');
        return;
    }

    hideBookingError();
    selHora.innerHTML = '<option value="">-- Selecciona un horario --</option>';
    horarios.forEach(h => {
        const opt = document.createElement('option');
        opt.value = h;
        opt.textContent = h + ' hs';
        selHora.appendChild(opt);
    });
}

function onSubmitBooking(e) {
    e.preventDefault();
    hideBookingError();

    const nombre    = document.getElementById('b-nombre').value.trim();
    const email     = document.getElementById('b-email').value.trim();
    const telefono  = document.getElementById('b-telefono').value.trim();
    const fecha     = document.getElementById('b-fecha').value;
    const hora      = document.getElementById('b-hora').value;
    const modalidad = document.getElementById('b-modalidad').value;
    const motivo    = document.getElementById('b-motivo').value.trim();

    // Validar
    if (!nombre)                     { showBookingError('Por favor ingresa tu nombre completo.'); return; }
    if (!email || !email.includes('@')) { showBookingError('Por favor ingresa un email valido.'); return; }
    if (!fecha)                      { showBookingError('Por favor selecciona una fecha.'); return; }
    if (!hora)                       { showBookingError('Por favor selecciona un horario.'); return; }
    if (!modalidad)                  { showBookingError('Por favor selecciona la modalidad.'); return; }

    // Verificar que el horario siga disponible (doble check)
    const disponibles = getHorariosDisponibles(fecha);
    if (!disponibles.includes(hora)) {
        showBookingError('Ese horario ya no esta disponible. Por favor recarga la pagina y elegi otro.');
        return;
    }

    // Guardar cita
    const cita = crearCita({ nombre, email, telefono, fecha, hora, modalidad, motivo });

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
            <p><span class="font-semibold text-stone-900">Fecha:</span> ${formatFecha(cita.fecha)}</p>
            <p><span class="font-semibold text-stone-900">Horario:</span> ${cita.hora} hs</p>
            <p><span class="font-semibold text-stone-900">Modalidad:</span> ${cita.modalidad}</p>
            <p class="text-xs text-stone-400 pt-1">ID de reserva: #${cita.id}</p>
        </div>
    `;
}

function resetBookingForm() {
    document.getElementById('booking-form').reset();
    document.getElementById('b-hora').innerHTML = '<option value="">-- Elegi una fecha primero --</option>';
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