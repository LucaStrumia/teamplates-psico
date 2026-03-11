/**
 * ADMIN.JS — Lógica del panel de administración
 * Gestiona la carga, edición y guardado de artículos y frases
 */

// =============================================
// TABS
// =============================================
function showTab(tab) {
    // Ocultar todos los paneles
    ['articulos','frases','citas','agenda','manual'].forEach(t => {
        const panel = document.getElementById('panel-' + t);
        if (panel) panel.classList.add('hidden');
    });

    // Desactivar todos los botones tab
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('tab-active');
    });

    // Mostrar panel seleccionado y activar su botón
    const panel = document.getElementById('panel-' + tab);
    if (panel) panel.classList.remove('hidden');
    const activeBtn = document.getElementById('tab-' + tab);
    if (activeBtn) activeBtn.classList.add('tab-active');

    // Refrescar al abrir cada tab
    if (tab === 'citas') renderCitas();
    if (tab === 'manual') initManualTab();
}

// =============================================
// RENDERIZAR ARTÍCULOS
// =============================================
const COLORES_OPCIONES = [
    { label: '🌿 Verde',    desde: 'from-green-600',  via: 'via-green-700',  hasta: 'to-stone-700',   avatar: 'from-green-600 to-stone-600',   boton: 'from-green-700 to-stone-600'  },
    { label: '💙 Azul',     desde: 'from-blue-500',   via: 'via-blue-600',   hasta: 'to-indigo-700',  avatar: 'from-blue-500 to-indigo-600',   boton: 'from-blue-600 to-indigo-600'  },
    { label: '🟠 Ámbar',    desde: 'from-amber-500',  via: 'via-amber-600',  hasta: 'to-orange-700',  avatar: 'from-amber-500 to-orange-600',  boton: 'from-amber-600 to-orange-600' },
    { label: '🌹 Rosa',     desde: 'from-rose-500',   via: 'via-rose-600',   hasta: 'to-pink-700',    avatar: 'from-rose-500 to-pink-600',     boton: 'from-rose-600 to-pink-600'    },
    { label: '🌸 Violeta',  desde: 'from-violet-500', via: 'via-violet-600', hasta: 'to-purple-700',  avatar: 'from-violet-500 to-purple-600', boton: 'from-violet-600 to-purple-600'},
    { label: '🍂 Tierra',   desde: 'from-stone-600',  via: 'via-amber-800',  hasta: 'to-stone-900',   avatar: 'from-stone-600 to-amber-800',   boton: 'from-stone-700 to-amber-800'  },
    { label: '🔴 Rojo',     desde: 'from-red-500',    via: 'via-red-600',    hasta: 'to-rose-800',    avatar: 'from-red-500 to-rose-700',      boton: 'from-red-600 to-rose-700'     },
    { label: '🌊 Teal',     desde: 'from-teal-500',   via: 'via-teal-600',   hasta: 'to-cyan-700',    avatar: 'from-teal-500 to-cyan-600',     boton: 'from-teal-600 to-cyan-600'    },
];

function renderArticulos() {
    const db = getDB();
    const container = document.getElementById('articulos-container');
    container.innerHTML = '';

    db.articulos.forEach((art, index) => {
        // Determinar color seleccionado actual
        const colorIdx = COLORES_OPCIONES.findIndex(c => c.desde === art.color_desde) ?? 0;

        const card = document.createElement('div');
        card.className = 'card-admin';
        card.innerHTML = `
            <div class="flex items-start justify-between mb-5">
                <div class="flex items-center gap-3">
                    <span class="emoji-preview" id="preview-emoji-${index}">${art.emoji}</span>
                    <div>
                        <p class="text-xs text-stone-400 font-medium uppercase tracking-wide">Artículo ${index + 1}</p>
                        <h3 class="font-semibold text-stone-900 text-lg" id="preview-titulo-${index}">${art.titulo}</h3>
                    </div>
                </div>
                <span class="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-medium">#${art.id}</span>
            </div>

            <div class="grid md:grid-cols-2 gap-4">
                <div>
                    <label class="label">Emoji / icono</label>
                    <input type="text" id="art-${index}-emoji" class="input-field" value="${art.emoji}"
                        oninput="document.getElementById('preview-emoji-${index}').textContent=this.value"
                        placeholder="💭">
                </div>
                <div>
                    <label class="label">Color del encabezado</label>
                    <select id="art-${index}-color" class="input-field">
                        ${COLORES_OPCIONES.map((c, i) => `
                            <option value="${i}" ${i === colorIdx ? 'selected' : ''}>${c.label}</option>
                        `).join('')}
                    </select>
                </div>
                <div class="md:col-span-2">
                    <label class="label">Título del artículo</label>
                    <input type="text" id="art-${index}-titulo" class="input-field" value="${art.titulo}"
                        oninput="document.getElementById('preview-titulo-${index}').textContent=this.value"
                        placeholder="Título...">
                </div>
                <div class="md:col-span-2">
                    <label class="label">Descripción (texto de la card)</label>
                    <textarea id="art-${index}-descripcion" class="input-field" rows="2" placeholder="Descripción...">${art.descripcion}</textarea>
                </div>
                <div>
                    <label class="label">Fecha de publicación</label>
                    <input type="text" id="art-${index}-fecha" class="input-field" value="${art.fecha}" placeholder="12 de Marzo, 2024">
                </div>
                <div>
                    <label class="label">Texto del botón</label>
                    <input type="text" id="art-${index}-boton" class="input-field" value="${art.boton_texto}" placeholder="Leer más">
                </div>
                <div>
                    <label class="label">Etiqueta 1</label>
                    <input type="text" id="art-${index}-tag1" class="input-field" value="${art.tag1}" placeholder="Tag 1">
                </div>
                <div>
                    <label class="label">Etiqueta 2</label>
                    <input type="text" id="art-${index}-tag2" class="input-field" value="${art.tag2}" placeholder="Tag 2">
                </div>
            </div>
            <div class="section-divider" style="margin-bottom:0;"></div>
        `;
        container.appendChild(card);
    });
}

// =============================================
// GUARDAR ARTÍCULOS
// =============================================
function saveArticulos() {
    const db = getDB();

    db.articulos.forEach((art, index) => {
        const colorIdx = parseInt(document.getElementById(`art-${index}-color`).value);
        const colorOpt = COLORES_OPCIONES[colorIdx] || COLORES_OPCIONES[0];

        art.emoji = document.getElementById(`art-${index}-emoji`).value.trim() || art.emoji;
        art.titulo = document.getElementById(`art-${index}-titulo`).value.trim() || art.titulo;
        art.descripcion = document.getElementById(`art-${index}-descripcion`).value.trim() || art.descripcion;
        art.fecha = document.getElementById(`art-${index}-fecha`).value.trim() || art.fecha;
        art.boton_texto = document.getElementById(`art-${index}-boton`).value.trim() || art.boton_texto;
        art.tag1 = document.getElementById(`art-${index}-tag1`).value.trim() || art.tag1;
        art.tag2 = document.getElementById(`art-${index}-tag2`).value.trim() || art.tag2;

        // Aplicar colores del preset seleccionado
        art.color_desde = colorOpt.desde;
        art.color_via = colorOpt.via;
        art.color_hasta = colorOpt.hasta;
        art.color_avatar = colorOpt.avatar;
        art.color_boton = colorOpt.boton;
    });

    const ok = saveDB(db);
    showToast(ok ? '✓ Artículos guardados correctamente' : '✗ Error al guardar', !ok);
}

function resetArticulos() {
    if (!confirm('¿Restaurar los artículos a los valores por defecto? Se perderán los cambios.')) return;
    const db = getDB();
    db.articulos = JSON.parse(JSON.stringify(DEFAULT_DATA.articulos));
    saveDB(db);
    renderArticulos();
    showToast('✓ Artículos restaurados');
}

// =============================================
// RENDERIZAR FRASES
// =============================================
function renderFrases() {
    const db = getDB();
    const f = db.frases;

    document.getElementById('f_hero_badge').value      = f.hero_badge      || '';
    document.getElementById('f_hero_titulo').value     = f.hero_titulo     || '';
    document.getElementById('f_sobre_mi_quote').value  = f.sobre_mi_quote  || '';
    document.getElementById('f_blog_subtitulo').value  = f.blog_subtitulo  || '';
    document.getElementById('f_enfoque_subtitulo').value = f.enfoque_subtitulo || '';
}

// =============================================
// GUARDAR FRASES
// =============================================
function saveFrases() {
    const db = getDB();

    db.frases.hero_badge       = document.getElementById('f_hero_badge').value.trim();
    db.frases.hero_titulo      = document.getElementById('f_hero_titulo').value.trim();
    db.frases.sobre_mi_quote   = document.getElementById('f_sobre_mi_quote').value.trim();
    db.frases.blog_subtitulo   = document.getElementById('f_blog_subtitulo').value.trim();
    db.frases.enfoque_subtitulo = document.getElementById('f_enfoque_subtitulo').value.trim();

    const ok = saveDB(db);
    showToast(ok ? '✓ Frases guardadas correctamente' : '✗ Error al guardar', !ok);
}

function resetFrases() {
    if (!confirm('¿Restaurar las frases a los valores por defecto? Se perderán los cambios.')) return;
    const db = getDB();
    db.frases = JSON.parse(JSON.stringify(DEFAULT_DATA.frases));
    saveDB(db);
    renderFrases();
    showToast('✓ Frases restauradas');
}

// =============================================
// TOAST NOTIFICATIONS
// =============================================
function showToast(msg, isError = false) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.toggle('error', isError);
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// =============================================
// INIT
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    renderArticulos();
    renderFrases();
    initCitasAgenda();
    // Activar tab inicial
    showTab('articulos');
});
