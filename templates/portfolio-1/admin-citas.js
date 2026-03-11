/**
 * ADMIN-CITAS.JS — Gestión de citas y agenda en el panel de administración
 */

// =============================================
// ESTADO GLOBAL AGENDA (edición en memoria)
// =============================================
let agendaEditing = null;
let filtroActivo  = 'todas';

// =============================================
// INIT — se llama desde admin.js después de DOMContentLoaded
// =============================================
function initCitasAgenda() {
    agendaEditing = getAgenda();
    renderCitas();
    renderAgendaDias();
    renderModalidades();
    renderBloqueadas();
    renderExtras();
    actualizarBadgePendientes();
}

// =============================================
// BADGE DE PENDIENTES EN EL TAB
// =============================================
function actualizarBadgePendientes() {
    const citas = getCitas();
    const pendientes = citas.filter(c => c.estado === 'pendiente').length;
    const badge = document.getElementById('badge-pendientes');
    if (!badge) return;
    if (pendientes > 0) {
        badge.textContent = pendientes;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}

// =============================================
// RENDER CITAS
// =============================================
function renderCitas(filtro) {
    if (filtro) filtroActivo = filtro;
    const allCitas = getCitas();
    const citas = filtroActivo === 'todas' ? allCitas : allCitas.filter(c => c.estado === filtroActivo);

    const container = document.getElementById('citas-container');
    if (!container) return;

    if (citas.length === 0) {
        container.innerHTML = `
            <div class="text-center py-16 text-stone-400">
                <div class="text-5xl mb-4">📭</div>
                <p class="font-medium">No hay citas ${filtroActivo !== 'todas' ? filtroActivo + 's' : ''}.</p>
            </div>`;
        return;
    }

    // Ordenar: más recientes primero
    const sorted = [...citas].sort((a, b) => new Date(b.creadaEn) - new Date(a.creadaEn));

    container.innerHTML = sorted.map(cita => {
        const fechaLegible = formatFecha(cita.fecha);
        const creadaEn = new Date(cita.creadaEn).toLocaleDateString('es-AR', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' });
        const esPendiente  = cita.estado === 'pendiente';
        const esConfirmada = cita.estado === 'confirmada';

        return `
        <div class="cita-card ${cita.estado}" id="cita-${cita.id}">
            <div class="flex items-start justify-between gap-4 flex-wrap">
                <div class="flex items-start gap-3">
                    <div class="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-lg shrink-0">👤</div>
                    <div>
                        <p class="font-semibold text-stone-900 text-sm">${cita.nombre}</p>
                        <p class="text-xs text-stone-400">${cita.email}${cita.telefono ? ' · ' + cita.telefono : ''}</p>
                    </div>
                </div>
                <span class="badge-estado badge-${cita.estado}">${cita.estado}</span>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-xs text-stone-600">
                <div><p class="text-stone-400 font-medium uppercase tracking-wide text-[10px] mb-0.5">Fecha</p><p class="font-semibold text-stone-800">${fechaLegible}</p></div>
                <div><p class="text-stone-400 font-medium uppercase tracking-wide text-[10px] mb-0.5">Horario</p><p class="font-semibold text-stone-800">${cita.hora} hs</p></div>
                <div><p class="text-stone-400 font-medium uppercase tracking-wide text-[10px] mb-0.5">Modalidad</p><p class="font-semibold text-stone-800">${cita.modalidad}</p></div>
                <div><p class="text-stone-400 font-medium uppercase tracking-wide text-[10px] mb-0.5">Solicitud</p><p class="text-stone-600">${creadaEn}</p></div>
            </div>

            ${cita.motivo ? `<div class="mt-3 bg-stone-50 rounded-xl px-4 py-2.5 text-xs text-stone-600 border border-stone-100">
                <span class="font-semibold text-stone-700">Motivo:</span> ${cita.motivo}
            </div>` : ''}

            <div class="flex gap-2 mt-4 flex-wrap">
                ${esPendiente  ? `<button class="btn-confirmar" onclick="cambiarEstadoCita(${cita.id}, 'confirmada')">✓ Confirmar</button>` : ''}
                ${esPendiente || esConfirmada ? `<button class="btn-cancelar" onclick="cambiarEstadoCita(${cita.id}, 'cancelada')">✕ Cancelar</button>` : ''}
                ${!esPendiente ? `<button class="btn-confirmar" onclick="cambiarEstadoCita(${cita.id}, 'pendiente')" style="background:#fef3c7;color:#92400e;border-color:#fde68a;">↺ Marcar pendiente</button>` : ''}
                <button class="btn-eliminar" onclick="borrarCita(${cita.id})">🗑 Eliminar</button>
            </div>
        </div>`;
    }).join('');
}

function filtrarCitas(filtro) {
    filtroActivo = filtro;
    // Actualizar estilo de botones
    ['todas','pendiente','confirmada','cancelada'].forEach(f => {
        const btn = document.getElementById('filtro-' + f);
        if (btn) btn.classList.toggle('active', f === filtro);
    });
    renderCitas();
}

function cambiarEstadoCita(id, estado) {
    actualizarEstadoCita(id, estado);
    renderCitas();
    actualizarBadgePendientes();
    showToast(`✓ Cita marcada como "${estado}"`);
}

function borrarCita(id) {
    if (!confirm('¿Eliminar esta cita permanentemente?')) return;
    eliminarCita(id);
    renderCitas();
    actualizarBadgePendientes();
    showToast('✓ Cita eliminada');
}

// =============================================
// RENDER AGENDA — DÍAS Y HORARIOS
// =============================================
function renderAgendaDias() {
    const container = document.getElementById('agenda-dias-container');
    if (!container) return;

    const ORDEN_DIAS = ['1','2','3','4','5','6','0'];
    container.innerHTML = ORDEN_DIAS.map(d => {
        const dia = agendaEditing.dias[d];
        if (!dia) return '';
        const horariosHTML = dia.horarios.map(h => `
            <span class="horario-tag">
                ${h}
                <button onclick="quitarHorario('${d}','${h}')" title="Quitar">×</button>
            </span>`).join('');

        return `
        <div class="dia-row">
            <div class="flex items-center justify-between mb-3">
                <label class="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" id="dia-activo-${d}" ${dia.activo ? 'checked' : ''}
                        onchange="toggleDia('${d}', this.checked)"
                        class="w-4 h-4 rounded accent-amber-700">
                    <span class="font-semibold text-stone-800 text-sm">${dia.label}</span>
                </label>
                ${dia.activo ? `<span class="text-xs text-stone-400">${dia.horarios.length} horario${dia.horarios.length !== 1 ? 's' : ''}</span>` : '<span class="text-xs text-stone-400 italic">Inactivo</span>'}
            </div>
            ${dia.activo ? `
            <div class="flex flex-wrap items-center gap-1 mb-3" id="horarios-${d}">
                ${horariosHTML || '<span class="text-xs text-stone-400 italic">Sin horarios</span>'}
            </div>
            <div class="flex gap-2 items-center">
                <input type="time" id="nuevo-horario-${d}" class="input-field" style="width:auto;"
                    step="1800" placeholder="HH:MM">
                <button onclick="agregarHorario('${d}')" class="btn-save" style="padding:0.4rem 0.9rem;font-size:0.75rem;">+ Agregar</button>
            </div>` : ''}
        </div>`;
    }).join('');
}

function toggleDia(d, activo) {
    agendaEditing.dias[d].activo = activo;
    renderAgendaDias();
}

function agregarHorario(d) {
    const input = document.getElementById(`nuevo-horario-${d}`);
    if (!input || !input.value) return;
    const hora = input.value.substring(0, 5); // HH:MM
    if (!agendaEditing.dias[d].horarios.includes(hora)) {
        agendaEditing.dias[d].horarios.push(hora);
        agendaEditing.dias[d].horarios.sort();
    }
    input.value = '';
    renderAgendaDias();
}

function quitarHorario(d, hora) {
    agendaEditing.dias[d].horarios = agendaEditing.dias[d].horarios.filter(h => h !== hora);
    renderAgendaDias();
}

// =============================================
// RENDER AGENDA — MODALIDADES
// =============================================
function renderModalidades() {
    const container = document.getElementById('agenda-modalidades');
    if (!container) return;
    container.innerHTML = agendaEditing.modalidades.map((m, i) => `
        <span class="horario-tag" style="background:#e0f2fe;color:#0369a1;border-color:#bae6fd;">
            ${m}
            <button onclick="quitarModalidad(${i})" title="Quitar">×</button>
        </span>`).join('');
}

function agregarModalidad() {
    const input = document.getElementById('nueva-modalidad');
    const val = input.value.trim();
    if (!val) return;
    if (!agendaEditing.modalidades.includes(val)) {
        agendaEditing.modalidades.push(val);
        renderModalidades();
    }
    input.value = '';
}

function quitarModalidad(idx) {
    agendaEditing.modalidades.splice(idx, 1);
    renderModalidades();
}

// =============================================
// RENDER AGENDA — FECHAS BLOQUEADAS
// =============================================
function renderBloqueadas() {
    const container = document.getElementById('agenda-bloqueadas');
    if (!container) return;
    if (agendaEditing.bloqueadas.length === 0) {
        container.innerHTML = '<span class="text-xs text-stone-400 italic">Sin fechas bloqueadas</span>';
        return;
    }
    container.innerHTML = agendaEditing.bloqueadas.map(f => `
        <span class="horario-tag" style="background:#fee2e2;color:#991b1b;border-color:#fca5a5;">
            ${formatFecha(f)}
            <button onclick="quitarBloqueada('${f}')" title="Desbloquear">×</button>
        </span>`).join('');
}

function agregarFechaBloqueada() {
    const input = document.getElementById('nueva-bloqueada');
    const val = input.value;
    if (!val) return;
    if (!agendaEditing.bloqueadas.includes(val)) {
        agendaEditing.bloqueadas.push(val);
        agendaEditing.bloqueadas.sort();
        renderBloqueadas();
    }
    input.value = '';
}

function quitarBloqueada(fecha) {
    agendaEditing.bloqueadas = agendaEditing.bloqueadas.filter(f => f !== fecha);
    renderBloqueadas();
}

// =============================================
// RENDER AGENDA — HORARIOS EXTRA
// =============================================
function renderExtras() {
    const container = document.getElementById('agenda-extras');
    if (!container) return;
    const keys = Object.keys(agendaEditing.extras).sort();
    if (keys.length === 0) {
        container.innerHTML = '<p class="text-xs text-stone-400 italic">Sin horarios extra configurados.</p>';
        return;
    }
    container.innerHTML = keys.map(fecha => {
        const horas = agendaEditing.extras[fecha];
        return `
        <div class="flex items-center gap-2 flex-wrap bg-stone-50 rounded-xl px-4 py-2.5 border border-stone-100">
            <span class="text-xs font-semibold text-stone-700 mr-2">${formatFecha(fecha)}:</span>
            ${horas.map(h => `
                <span class="horario-tag">
                    ${h}
                    <button onclick="quitarExtra('${fecha}','${h}')">×</button>
                </span>`).join('')}
        </div>`;
    }).join('');
}

function agregarHorarioExtra() {
    const fecha = document.getElementById('extra-fecha').value;
    const hora  = document.getElementById('extra-hora').value;
    if (!fecha || !hora) { showToast('Completá fecha y hora', true); return; }
    const h = hora.substring(0, 5);
    if (!agendaEditing.extras[fecha]) agendaEditing.extras[fecha] = [];
    if (!agendaEditing.extras[fecha].includes(h)) {
        agendaEditing.extras[fecha].push(h);
        agendaEditing.extras[fecha].sort();
    }
    document.getElementById('extra-fecha').value = '';
    document.getElementById('extra-hora').value  = '';
    renderExtras();
}

function quitarExtra(fecha, hora) {
    agendaEditing.extras[fecha] = agendaEditing.extras[fecha].filter(h => h !== hora);
    if (agendaEditing.extras[fecha].length === 0) delete agendaEditing.extras[fecha];
    renderExtras();
}

// =============================================
// GUARDAR / RESETEAR AGENDA
// =============================================
function saveAgendaAdmin() {
    const ok = saveAgenda(agendaEditing);
    showToast(ok ? '✓ Agenda guardada correctamente' : '✗ Error al guardar', !ok);
}

function resetAgendaAdmin() {
    if (!confirm('¿Restaurar la agenda a los valores por defecto? Se perderán todos los cambios.')) return;
    agendaEditing = JSON.parse(JSON.stringify(DEFAULT_AGENDA));
    saveAgenda(agendaEditing);
    renderAgendaDias();
    renderModalidades();
    renderBloqueadas();
    renderExtras();
    showToast('✓ Agenda restaurada');
}

// =============================================
// CITAS MANUALES — cargar turnos dados fuera de la web
// =============================================
function agregarCitaManual() {
    const nombre   = document.getElementById('m-nombre').value.trim();
    const email    = document.getElementById('m-email').value.trim();
    const telefono = document.getElementById('m-telefono').value.trim();
    const fecha    = document.getElementById('m-fecha').value;
    const hora     = document.getElementById('m-hora').value;
    const modalidad= document.getElementById('m-modalidad').value;
    const motivo   = document.getElementById('m-motivo').value.trim();
    const estado   = document.getElementById('m-estado').value;
    const errorEl  = document.getElementById('manual-error');

    // Validación básica
    if (!nombre || !fecha || !hora || !modalidad) {
        errorEl.textContent = 'Completá los campos obligatorios: Nombre, Fecha, Hora y Modalidad.';
        errorEl.classList.remove('hidden');
        return;
    }
    errorEl.classList.add('hidden');

    // Verificar si el horario ya está ocupado
    const citas = getCitas();
    const conflicto = citas.find(c =>
        c.fecha === fecha &&
        c.hora === hora.substring(0, 5) &&
        (c.estado === 'pendiente' || c.estado === 'confirmada')
    );
    if (conflicto) {
        errorEl.textContent = `⚠ Ya existe una cita ${conflicto.estado} para ese día y horario (${conflicto.nombre}).`;
        errorEl.classList.remove('hidden');
        return;
    }

    const nueva = {
        id: Date.now(),
        nombre,
        email: email || '(sin email)',
        telefono,
        fecha,
        hora: hora.substring(0, 5),
        modalidad,
        motivo,
        estado,
        origen: 'manual',
        creadaEn: new Date().toISOString()
    };

    citas.push(nueva);
    saveCitas(citas);

    // Limpiar formulario
    ['m-nombre','m-email','m-telefono','m-fecha','m-hora','m-motivo'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    document.getElementById('m-estado').value = 'confirmada';

    // Actualizar vista de citas si está visible
    renderCitas();
    actualizarBadgePendientes();
    renderManualRecientes();
    showToast('✓ Cita cargada manualmente');
}

function renderManualRecientes() {
    const container = document.getElementById('manual-recientes');
    if (!container) return;
    const citas = getCitas()
        .filter(c => c.origen === 'manual')
        .sort((a, b) => new Date(b.creadaEn) - new Date(a.creadaEn))
        .slice(0, 8);

    if (citas.length === 0) {
        container.innerHTML = '<p class="text-stone-400 text-sm text-center py-6">Aún no cargaste citas manualmente.</p>';
        return;
    }

    container.innerHTML = citas.map(c => {
        const esPendiente  = c.estado === 'pendiente';
        const esConfirmada = c.estado === 'confirmada';
        return `
        <div class="cita-card ${c.estado}" id="cita-${c.id}">
            <div class="flex items-start justify-between gap-3 flex-wrap">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 bg-stone-100 rounded-full flex items-center justify-center text-base shrink-0">✏️</div>
                    <div>
                        <p class="font-semibold text-stone-900 text-sm">${c.nombre}</p>
                        <p class="text-xs text-stone-400">${c.email}${c.telefono ? ' · ' + c.telefono : ''}</p>
                    </div>
                </div>
                <span class="badge-estado badge-${c.estado}">${c.estado}</span>
            </div>
            <div class="grid grid-cols-3 gap-2 mt-3 text-xs text-stone-600">
                <div><p class="text-stone-400 font-medium uppercase tracking-wide text-[10px] mb-0.5">Fecha</p><p class="font-semibold text-stone-800">${formatFecha(c.fecha)}</p></div>
                <div><p class="text-stone-400 font-medium uppercase tracking-wide text-[10px] mb-0.5">Hora</p><p class="font-semibold text-stone-800">${c.hora} hs</p></div>
                <div><p class="text-stone-400 font-medium uppercase tracking-wide text-[10px] mb-0.5">Modalidad</p><p class="font-semibold text-stone-800">${c.modalidad}</p></div>
            </div>
            ${c.motivo ? `<p class="mt-2 text-xs text-stone-500 bg-stone-50 rounded-lg px-3 py-1.5 border border-stone-100">${c.motivo}</p>` : ''}
            <div class="flex gap-2 mt-3 flex-wrap">
                ${esPendiente  ? `<button class="btn-confirmar" onclick="cambiarEstadoCita(${c.id},'confirmada');renderManualRecientes()">✓ Confirmar</button>` : ''}
                ${esPendiente || esConfirmada ? `<button class="btn-cancelar" onclick="cambiarEstadoCita(${c.id},'cancelada');renderManualRecientes()">✕ Cancelar</button>` : ''}
                <button class="btn-eliminar" onclick="borrarCita(${c.id});renderManualRecientes()">🗑 Eliminar</button>
            </div>
        </div>`;
    }).join('');
}

function initManualTab() {
    // Poblar select de modalidades desde la agenda
    const agenda = getAgenda();
    const sel = document.getElementById('m-modalidad');
    if (!sel) return;
    sel.innerHTML = '<option value="">— Seleccioná —</option>' +
        agenda.modalidades.map(m => `<option value="${m}">${m}</option>`).join('');
    renderManualRecientes();
}
