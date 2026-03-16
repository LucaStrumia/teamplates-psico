/**
 * SITE-LOADER.JS — Carga dinámica de contenido desde localStorage
 * Se ejecuta en index.html para mostrar datos actualizados por el admin.
 */

document.addEventListener('DOMContentLoaded', () => {
    const db = getDB(); // función definida en data.js
    loadFrases(db.frases);
    const articulos = db.articulos.slice(-4).reverse(); // Últimos 4, nuevos primero
    renderArticulosGrid(articulos);
    renderResenas();
});

// =============================================
// CARGAR FRASES
// =============================================
function loadFrases(frases) {
    document.querySelectorAll('[data-psico]').forEach(el => {
        const key = el.getAttribute('data-psico');
        if (frases[key] !== undefined && frases[key] !== '') {
            el.textContent = frases[key];
        }
    });
}

// =============================================
// RENDERIZAR ARTÍCULOS
// =============================================
function renderArticulosGrid(articulos) {
    const grid = document.getElementById('articulos-grid');
    if (!grid) return;

    grid.innerHTML = articulos.map(art => {
        // Partir el título en dos partes si tiene espacio (para el formato de dos líneas)
        const tituloPartes = splitTitulo(art.titulo);

        return `
        <article class="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer border border-stone-200/50">
            <div class="relative h-64 bg-gradient-to-br ${art.color_desde} ${art.color_via} ${art.color_hasta} overflow-hidden">
                ${art.imagen_portada ? `<img src="${art.imagen_portada}" alt="${art.titulo}" class="w-full h-full object-cover">` : ''}
                <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
                <div class="absolute bottom-6 left-6">
                    <h3 class="text-2xl md:text-3xl font-light text-white leading-tight">
                        ${tituloPartes[0]}<br><span class="font-normal">${tituloPartes[1] || ''}</span>
                    </h3>
                </div>
            </div>
            <div class="p-8">
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-9 h-9 bg-gradient-to-r ${art.color_avatar} rounded-full flex items-center justify-center">
                        <span class="text-white font-bold text-xs">C</span>
                    </div>
                    <div>
                        <p class="text-sm font-semibold text-slate-900">Candela Gonzalez</p>
                        <p class="text-xs text-slate-400">${art.fecha}</p>
                    </div>
                </div>
                <p class="text-slate-600 leading-relaxed mb-5 text-sm">${art.descripcion}</p>
                <div class="flex flex-wrap gap-2 mb-5">
                    <span class="${art.color_tag1_bg} ${art.color_tag1_text} px-3 py-1 rounded-full text-xs font-medium">${art.tag1}</span>
                    <span class="${art.color_tag2_bg} ${art.color_tag2_text} px-3 py-1 rounded-full text-xs font-medium">${art.tag2}</span>
                </div>
                <a href="article.html?id=${art.id}" class="group/btn inline-flex items-center gap-2 bg-gradient-to-r ${art.color_boton} text-white px-5 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 text-sm">
                    ${art.boton_texto}
                    <svg class="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                    </svg>
                </a>
            </div>
        </article>`;
    }).join('');
}

/**
 * Divide el título en dos partes para el formato de dos líneas en el header de la card.
 * Ej: "Libertad Auténtica" → ["Libertad", "Auténtica"]
 * Si solo hay una palabra, la segunda parte queda vacía.
 */
function splitTitulo(titulo) {
    const idx = titulo.indexOf(' ');
    if (idx === -1) return [titulo, ''];
    return [titulo.substring(0, idx), titulo.substring(idx + 1)];
}

// =============================================
// RENDERIZAR RESEÑAS
// =============================================
function renderResenas() {
    const grid = document.getElementById('resenas-grid');
    if (!grid) return;
    const aprobadas = getResenas().filter(r => r.aprobada);
    const empty = document.getElementById('resenas-empty');
    if (aprobadas.length === 0) {
        if (empty) empty.classList.remove('hidden');
        return;
    }
    if (empty) empty.classList.add('hidden');
    grid.innerHTML = aprobadas.reverse().map(r => `
        <div class="bg-white rounded-2xl p-6 shadow-md border border-stone-100 hover:shadow-lg transition-all duration-300">
            <div class="flex items-center justify-between mb-3">
                <span class="text-yellow-400 text-lg tracking-tight">${'\u2605'.repeat(r.estrellas)}${'\u2606'.repeat(5 - r.estrellas)}</span>
            </div>
            <p class="text-stone-700 text-sm leading-relaxed mb-4 italic">&#8220;${escapeHtmlSafe(r.texto)}&#8221;</p>
            <div class="flex items-center gap-2 pt-3 border-t border-stone-100">
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-stone-400 to-stone-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">${escapeHtmlSafe(r.apodo.charAt(0).toUpperCase())}</div>
                <div>
                    <p class="text-xs font-semibold text-stone-800">${escapeHtmlSafe(r.apodo)}</p>
                    <p class="text-xs text-stone-400">${escapeHtmlSafe(r.fecha)}</p>
                </div>
            </div>
        </div>
    `).join('');
}

function escapeHtmlSafe(str) {
    const div = document.createElement('div');
    div.textContent = String(str);
    return div.innerHTML;
}
