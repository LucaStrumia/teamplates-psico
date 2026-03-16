/**
 * ADMIN.JS — Lógica del panel de administración
 * Gestiona la carga, edición y guardado de artículos y frases
 */

// =============================================
// TABS
// =============================================
function showTab(tab) {
    // Ocultar todos los paneles
    ['articulos','frases','citas','agenda','manual','resenas'].forEach(t => {
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
    if (tab === 'resenas') initResenasTab();
}

// =============================================
// FUNCIONES PARA MANEJO DE ARCHIVOS
// =============================================
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

async function handleImagenSelect(artIndex, tipo, event) {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
        const base64 = await fileToBase64(file);
        const fieldId = tipo === 'portada' ? `art-${artIndex}-imagen-portada` : `art-${artIndex}-imagen`;
        document.getElementById(fieldId).value = base64;
        // Trigger preview
        document.getElementById(fieldId).dispatchEvent(new Event('input'));
    } catch (err) {
        alert('Error al cargar la imagen: ' + err.message);
    }
}

async function handleVideoSelect(artIndex, event) {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
        const base64 = await fileToBase64(file);
        document.getElementById(`art-${artIndex}-video`).value = base64;
        // Trigger preview
        document.getElementById(`art-${artIndex}-video`).dispatchEvent(new Event('input'));
    } catch (err) {
        alert('Error al cargar el video: ' + err.message);
    }
}

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

    // Llenar dropdown de artículos
    const dropdown = document.getElementById('articulos-dropdown');
    if (dropdown) {
        dropdown.innerHTML = '<option value="">Elige uno...</option>';
        db.articulos.forEach((art, idx) => {
            const option = document.createElement('option');
            option.value = idx;
            option.textContent = `${art.titulo} (#${art.id})`;
            dropdown.appendChild(option);
        });
    }

    db.articulos.forEach((art, index) => {
        // Determinar color seleccionado actual
        const colorIdx = COLORES_OPCIONES.findIndex(c => c.desde === art.color_desde) ?? 0;

        const card = document.createElement('div');
        card.className = 'card-admin border-2 border-stone-200 rounded-2xl p-8 bg-white hover:shadow-lg transition mb-8';
        card.id = `card-admin-${index}`;
        card.innerHTML = `
            <!-- HEADER -->
            <div class="flex items-start justify-between mb-8 pb-6 border-b-2 border-stone-200">
                <div>
                    <p class="text-xs text-stone-400 font-bold uppercase tracking-widest">Artículo #${art.id}</p>
                    <h3 class="font-bold text-stone-900 text-2xl" id="preview-titulo-${index}">${art.titulo}</h3>
                    <p class="text-sm text-stone-500 mt-1">${art.fecha}</p>
                </div>
                <button type="button" onclick="eliminarArticulo(${index})" class="btn-reset px-3 py-1 text-sm">🗑 Eliminar</button>
            </div>

            <!-- GRID DE EDICIÓN -->
            <div class="space-y-6">
                <!-- FILA 1: Color -->
                <div class="grid md:grid-cols-3 gap-6">
                    <div class="md:col-span-3">
                        <label class="label">Color del encabezado</label>
                        <select id="art-${index}-color" class="input-field">
                            ${COLORES_OPCIONES.map((c, i) => `
                                <option value="${i}" ${i === colorIdx ? 'selected' : ''}>${c.label}</option>
                            `).join('')}
                        </select>
                    </div>
                </div>

                <!-- FILA 2: Título y Fecha -->
                <div class="grid md:grid-cols-2 gap-6">
                    <div>
                        <label class="label">Título del artículo</label>
                        <input type="text" id="art-${index}-titulo" class="input-field text-lg" value="${art.titulo}"
                            oninput="document.getElementById('preview-titulo-${index}').textContent=this.value"
                            placeholder="Título...">
                    </div>
                    <div>
                        <label class="label">Fecha de publicación</label>
                        <input type="text" id="art-${index}-fecha" class="input-field" value="${art.fecha}" placeholder="12 de Marzo, 2024">
                    </div>
                </div>

                <!-- FILA 3: Descripción -->
                <div>
                    <label class="label">Descripción (texto de la card)</label>
                    <textarea id="art-${index}-descripcion" class="input-field" rows="3" placeholder="Descripción...">${art.descripcion}</textarea>
                </div>

                <!-- FILA 4: Contenido -->
                <div>
                    <label class="label">Contenido completo (artículo)</label>
                    <textarea id="art-${index}-contenido" class="input-field" rows="6" placeholder="Aquí va el contenido completo del artículo...">${art.contenido || ''}</textarea>
                </div>

                <!-- FILA 5: Tags y Botón -->
                <div class="grid md:grid-cols-3 gap-6">
                    <div>
                        <label class="label">Etiqueta 1</label>
                        <input type="text" id="art-${index}-tag1" class="input-field" value="${art.tag1}" placeholder="Tag 1">
                    </div>
                    <div>
                        <label class="label">Etiqueta 2</label>
                        <input type="text" id="art-${index}-tag2" class="input-field" value="${art.tag2}" placeholder="Tag 2">
                    </div>
                    <div>
                        <label class="label">Texto del botón</label>
                        <input type="text" id="art-${index}-boton" class="input-field" value="${art.boton_texto}" placeholder="Leer más">
                    </div>
                </div>

                <!-- FILA 6: Imágenes y Video -->
                <div class="grid md:grid-cols-3 gap-6">
                    <div>
                        <label class="label">Imagen PORTADA (para cards)</label>
                        <input type="file" id="art-${index}-imagen-portada-file" class="input-field" accept="image/*" 
                            onchange="handleImagenSelect(${index}, 'portada', event)">
                        ${art.imagen_portada && art.imagen_portada.startsWith('data:') ? `<div style="margin-top:8px;"><small>✓ Cargada</small></div>` : ''}
                        <input type="hidden" id="art-${index}-imagen-portada" value="${art.imagen_portada || ''}">
                    </div>
                    <div>
                        <label class="label">Imagen DENTRO del artículo</label>
                        <input type="file" id="art-${index}-imagen-file" class="input-field" accept="image/*" 
                            onchange="handleImagenSelect(${index}, 'contenido', event)">
                        ${art.imagen && art.imagen.startsWith('data:') ? `<div style="margin-top:8px;"><small>✓ Cargada</small></div>` : ''}
                        <input type="hidden" id="art-${index}-imagen" value="${art.imagen || ''}">
                    </div>
                    <div>
                        <label class="label">Video del artículo</label>
                        <input type="file" id="art-${index}-video-file" class="input-field" accept="video/*" 
                            onchange="handleVideoSelect(${index}, event)">
                        ${art.video && art.video.startsWith('data:') ? `<div style="margin-top:8px;"><small>✓ Cargado</small></div>` : ''}
                        <input type="hidden" id="art-${index}-video" value="${art.video || ''}">
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// =============================================
// SALTAR A UN ARTÍCULO ESPECÍFICO
// =============================================
function saltarArticulo() {
    const dropdown = document.getElementById('articulos-dropdown');
    const container = document.getElementById('articulos-container');
    const index = parseInt(dropdown.value);
    
    // Si no hay selección, ocultamos el container
    if (isNaN(index) || dropdown.value === '') {
        container.classList.add('hidden');
        return;
    }
    
    // Mostrar el container
    container.classList.remove('hidden');
    
    // Ocultar todas las cards
    const allCards = document.querySelectorAll('.card-admin');
    allCards.forEach(card => card.classList.add('hidden'));
    
    // Mostrar solo la card seleccionada
    const selectedCard = document.getElementById(`card-admin-${index}`);
    if (selectedCard) {
        selectedCard.classList.remove('hidden');
        selectedCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        selectedCard.classList.add('ring-2');
        selectedCard.style.boxShadow = '0 0 0 4px rgba(217, 119, 6, 0.5)';
        setTimeout(() => {
            selectedCard.classList.remove('ring-2');
            selectedCard.style.boxShadow = '';
        }, 2000);
    }
}

// =============================================
// CREAR NUEVO ARTÍCULO
// =============================================
function crearArticulo() {
    const titulo = document.getElementById('nuevo-titulo')?.value?.trim() || '';
    const descripcion = document.getElementById('nuevo-descripcion')?.value?.trim() || '';
    
    if (!titulo || !descripcion) {
        alert('Por favor rellena título y descripción');
        return;
    }

    const db = getDB();
    const colorIdx = parseInt(document.getElementById('nuevo-color')?.value) || 0;
    const colorOpt = COLORES_OPCIONES[colorIdx] || COLORES_OPCIONES[0];
    
    const nuevoArticulo = {
        id: Math.max(...db.articulos.map(a => a.id || 0), 0) + 1,
        titulo: titulo,
        descripcion: descripcion,
        contenido: document.getElementById('nuevo-contenido')?.value?.trim() || '',
        fecha: document.getElementById('nuevo-fecha')?.value?.trim() || new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }),
        boton_texto: document.getElementById('nuevo-boton')?.value?.trim() || 'Leer más',
        tag1: document.getElementById('nuevo-tag1')?.value?.trim() || '',
        tag2: document.getElementById('nuevo-tag2')?.value?.trim() || '',
        imagen_portada: document.getElementById('nuevo-imagen-portada')?.value?.trim() || '',
        imagen: document.getElementById('nuevo-imagen')?.value?.trim() || '',
        video: document.getElementById('nuevo-video')?.value?.trim() || '',
        color_desde: colorOpt.desde,
        color_via: colorOpt.via,
        color_hasta: colorOpt.hasta,
        color_avatar: colorOpt.avatar,
        color_boton: colorOpt.boton,
        subtitulo: ''
    };
    
    db.articulos.push(nuevoArticulo);
    
    if (saveDB(db)) {
        showToast(`✓ Artículo "${titulo}" creado correctamente`);
        // Limpiar formulario
        document.getElementById('nuevo-color').value = '0';
        document.getElementById('nuevo-titulo').value = '';
        document.getElementById('nuevo-descripcion').value = '';
        document.getElementById('nuevo-contenido').value = '';
        document.getElementById('nuevo-fecha').value = '';
        document.getElementById('nuevo-boton').value = 'Leer más';
        document.getElementById('nuevo-tag1').value = '';
        document.getElementById('nuevo-tag2').value = '';
        document.getElementById('nuevo-imagen-portada').value = '';
        document.getElementById('nuevo-imagen').value = '';
        document.getElementById('nuevo-video').value = '';
        document.getElementById('nuevo-imagen-portada-file').value = '';
        document.getElementById('nuevo-imagen-file').value = '';
        document.getElementById('nuevo-video-file').value = '';
        
        // Renderizar artículos nuevamente
        renderArticulos();
    } else {
        showToast('✗ Error al crear artículo', true);
    }
}

// =============================================
// GUARDAR ARTÍCULOS
// =============================================
function saveArticulos() {
    const db = getDB();

    db.articulos.forEach((art, index) => {
        const colorIdx = parseInt(document.getElementById(`art-${index}-color`).value);
        const colorOpt = COLORES_OPCIONES[colorIdx] || COLORES_OPCIONES[0];

        art.titulo = document.getElementById(`art-${index}-titulo`).value.trim() || art.titulo;
        art.descripcion = document.getElementById(`art-${index}-descripcion`).value.trim() || art.descripcion;
        art.fecha = document.getElementById(`art-${index}-fecha`).value.trim() || art.fecha;
        art.boton_texto = document.getElementById(`art-${index}-boton`).value.trim() || art.boton_texto;
        art.tag1 = document.getElementById(`art-${index}-tag1`).value.trim() || art.tag1;
        art.tag2 = document.getElementById(`art-${index}-tag2`).value.trim() || art.tag2;
        art.contenido = document.getElementById(`art-${index}-contenido`).value.trim() || '';
        art.imagen_portada = document.getElementById(`art-${index}-imagen-portada`).value.trim() || '';
        art.imagen = document.getElementById(`art-${index}-imagen`).value.trim() || '';
        art.video = document.getElementById(`art-${index}-video`).value.trim() || '';

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

function eliminarArticulo(index) {
    const db = getDB();
    const articulo = db.articulos[index];
    if (!confirm(`¿Eliminar el artículo "${articulo.titulo}"? Esta acción no se puede deshacer.`)) return;
    
    db.articulos.splice(index, 1);
    saveDB(db);
    renderArticulos();
    showToast('✓ Artículo eliminado');
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
