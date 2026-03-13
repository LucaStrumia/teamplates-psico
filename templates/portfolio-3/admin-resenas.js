/**
 * ADMIN-RESENAS.JS — Gestión de reseñas anónimas
 * Permite aprobar, rechazar y eliminar reseñas desde el panel admin.
 */

function initResenasTab() {
    renderResenasPendientes();
    renderResenasAprobadas();
}

function renderResenasPendientes() {
    const container = document.getElementById('resenas-pendientes');
    if (!container) return;
    const pendientes = getResenas().filter(r => !r.aprobada);

    const badge = document.getElementById('badge-resenas-pendientes');
    if (badge) {
        badge.textContent = pendientes.length;
        badge.classList.toggle('hidden', pendientes.length === 0);
    }

    if (pendientes.length === 0) {
        container.innerHTML = '<p class="text-stone-400 text-sm text-center py-6">No hay reseñas pendientes de aprobación.</p>';
        return;
    }
    container.innerHTML = pendientes.map(r => `
        <div class="cita-card pendiente" id="resena-pend-${r.id}">
            <div class="flex items-start justify-between gap-4">
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1 flex-wrap">
                        <span class="text-yellow-500 tracking-tight">${'★'.repeat(r.estrellas)}${'☆'.repeat(5 - r.estrellas)}</span>
                        <span class="font-semibold text-stone-800 text-sm">${escapeHtml(r.apodo)}</span>
                        <span class="text-stone-400 text-xs">· ${r.fecha}</span>
                    </div>
                    <p class="text-stone-600 text-sm leading-relaxed">${escapeHtml(r.texto)}</p>
                </div>
                <div class="flex gap-2 shrink-0">
                    <button onclick="accionAprobar(${r.id})" class="btn-confirmar">✓ Aprobar</button>
                    <button onclick="accionRechazar(${r.id})" class="btn-cancelar">✕ Rechazar</button>
                </div>
            </div>
        </div>
    `).join('');
}

function renderResenasAprobadas() {
    const container = document.getElementById('resenas-aprobadas');
    if (!container) return;
    const aprobadas = getResenas().filter(r => r.aprobada).reverse();

    if (aprobadas.length === 0) {
        container.innerHTML = '<p class="text-stone-400 text-sm text-center py-6">Todavía no hay reseñas publicadas.</p>';
        return;
    }
    container.innerHTML = aprobadas.map(r => `
        <div class="cita-card confirmada" id="resena-apro-${r.id}">
            <div class="flex items-start justify-between gap-4">
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1 flex-wrap">
                        <span class="text-yellow-500 tracking-tight">${'★'.repeat(r.estrellas)}${'☆'.repeat(5 - r.estrellas)}</span>
                        <span class="font-semibold text-stone-800 text-sm">${escapeHtml(r.apodo)}</span>
                        <span class="text-stone-400 text-xs">· ${r.fecha}</span>
                    </div>
                    <p class="text-stone-600 text-sm leading-relaxed">${escapeHtml(r.texto)}</p>
                </div>
                <button onclick="accionEliminarResena(${r.id})" class="btn-eliminar shrink-0">🗑</button>
            </div>
        </div>
    `).join('');
}

function accionAprobar(id) {
    aprobarResena(id);
    initResenasTab();
    showToast('Reseña aprobada y publicada ✓');
}

function accionRechazar(id) {
    if (!confirm('¿Rechazar y eliminar esta reseña?')) return;
    eliminarResena(id);
    initResenasTab();
    showToast('Reseña eliminada');
}

function accionEliminarResena(id) {
    if (!confirm('¿Eliminar esta reseña publicada?')) return;
    eliminarResena(id);
    initResenasTab();
    showToast('Reseña eliminada');
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
