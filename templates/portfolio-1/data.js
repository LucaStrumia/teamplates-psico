/**
 * BASE DE DATOS INICIAL - Portfolio Psicología
 * Este archivo define los datos por defecto.
 * Los cambios del admin se guardan en localStorage y tienen prioridad.
 */

const DB_KEY       = 'psico_portfolio_data';
const CITAS_KEY    = 'psico_citas';        // citas agendadas por usuarios
const AGENDA_KEY   = 'psico_agenda';       // disponibilidad cargada por el admin

// =============================================
// AGENDA DEFAULT — días y horarios disponibles
// =============================================
const DEFAULT_AGENDA = {
    // "1"=Lunes … "5"=Viernes, "0"=Dom, "6"=Sáb
    dias: {
        "1": { activo: true,  label: "Lunes",     horarios: ["09:00","10:00","11:00","15:00","16:00","17:00","18:00"] },
        "2": { activo: true,  label: "Martes",    horarios: ["09:00","10:00","11:00","15:00","16:00","17:00","18:00"] },
        "3": { activo: true,  label: "Miércoles", horarios: ["09:00","10:00","11:00","15:00","16:00","17:00","18:00"] },
        "4": { activo: true,  label: "Jueves",    horarios: ["09:00","10:00","11:00","15:00","16:00","17:00","18:00"] },
        "5": { activo: true,  label: "Viernes",   horarios: ["09:00","10:00","11:00","15:00","16:00"] },
        "6": { activo: false, label: "Sábado",    horarios: [] },
        "0": { activo: false, label: "Domingo",   horarios: [] }
    },
    // Fechas bloqueadas puntualmente (YYYY-MM-DD)
    bloqueadas: [],
    // Horarios extra para una fecha específica { "2026-03-15": ["08:00","19:00"] }
    extras: {},
    // Duración de sesión en minutos (solo informativo)
    duracion: 50,
    // Modalidades disponibles
    modalidades: ["Online", "Presencial"]
};

// =============================================
// HELPERS: AGENDA
// =============================================
function getAgenda() {
    try {
        const stored = localStorage.getItem(AGENDA_KEY);
        if (stored) return JSON.parse(stored);
    } catch(e) {}
    return JSON.parse(JSON.stringify(DEFAULT_AGENDA));
}
function saveAgenda(agenda) {
    try { localStorage.setItem(AGENDA_KEY, JSON.stringify(agenda)); return true; }
    catch(e) { console.error('Error guardando agenda:', e); return false; }
}

// =============================================
// HELPERS: CITAS
// =============================================
function getCitas() {
    try {
        const stored = localStorage.getItem(CITAS_KEY);
        if (stored) return JSON.parse(stored);
    } catch(e) {}
    return [];
}
function saveCitas(citas) {
    try { localStorage.setItem(CITAS_KEY, JSON.stringify(citas)); return true; }
    catch(e) { console.error('Error guardando citas:', e); return false; }
}
function crearCita(datos) {
    const citas = getCitas();
    const nueva = {
        id: Date.now(),
        nombre: datos.nombre,
        email: datos.email,
        telefono: datos.telefono || '',
        fecha: datos.fecha || '',   // YYYY-MM-DD
        hora: datos.hora || '',     // HH:MM
        disponibilidad: datos.disponibilidad || '',
        modalidad: datos.modalidad,
        motivo: datos.motivo || '',
        estado: 'pendiente',        // pendiente | confirmada | cancelada
        creadaEn: new Date().toISOString()
    };
    citas.push(nueva);
    saveCitas(citas);
    return nueva;
}
function actualizarEstadoCita(id, estado) {
    const citas = getCitas();
    const idx = citas.findIndex(c => c.id === id);
    if (idx !== -1) { citas[idx].estado = estado; saveCitas(citas); return true; }
    return false;
}
function eliminarCita(id) {
    const citas = getCitas().filter(c => c.id !== id);
    saveCitas(citas);
}

// =============================================
// UTILIDADES DE FECHA / HORARIOS
// =============================================
/**
 * Dado un YYYY-MM-DD, devuelve los horarios disponibles según la agenda
 * (descontando los ya ocupados por citas confirmadas/pendientes)
 */
function getHorariosDisponibles(fechaStr) {
    const agenda = getAgenda();
    const fecha  = new Date(fechaStr + 'T12:00:00');
    const diaSemana = String(fecha.getDay()); // 0=Dom…6=Sáb

    // Verificar si está bloqueada
    if (agenda.bloqueadas.includes(fechaStr)) return [];

    const diaConfig = agenda.dias[diaSemana];
    if (!diaConfig || !diaConfig.activo) return [];

    let horarios = [...diaConfig.horarios];

    // Agregar extras para esa fecha
    if (agenda.extras[fechaStr]) {
        horarios = [...new Set([...horarios, ...agenda.extras[fechaStr]])].sort();
    }

    // Restar los ya ocupados (citas pendientes o confirmadas)
    const citas = getCitas();
    const ocupados = citas
        .filter(c => c.fecha === fechaStr && (c.estado === 'pendiente' || c.estado === 'confirmada'))
        .map(c => c.hora);

    return horarios.filter(h => !ocupados.includes(h));
}

/**
 * Devuelve true si una fecha (YYYY-MM-DD) tiene al menos un horario disponible
 */
function fechaTieneDisponibilidad(fechaStr) {
    return getHorariosDisponibles(fechaStr).length > 0;
}

/**
 * Formatea fecha YYYY-MM-DD → "Lunes 15 de Marzo, 2026"
 */
function formatFecha(fechaStr) {
    const dias   = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
    const meses  = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    const d = new Date(fechaStr + 'T12:00:00');
    return `${dias[d.getDay()]} ${d.getDate()} de ${meses[d.getMonth()]}, ${d.getFullYear()}`;
}


const DEFAULT_DATA = {
    // === FRASES DE LA PÁGINA ===
    frases: {
        hero_badge: "Psicología y Bienestar",
        hero_titulo: "Acompaño a personas que quieren dejar de sentirse sus propios enemigos y vivir una vida consciente.",
        sobre_mi_quote: "",
        blog_subtitulo: "Explorando la psicología moderna, el bienestar emocional y el crecimiento personal a través de reflexiones profundas.",
        enfoque_subtitulo: "Trabajo desde la Terapia Gestáltica, un enfoque holístico explorando la psicología moderna, el bienestar emocional y el crecimiento personal a través de reflexiones profundas."
    },

    // === ARTÍCULOS / REFLEXIONES ===
    articulos: [
        {
            id: 1,
            color_desde: "from-green-600",
            color_via: "via-green-700",
            color_hasta: "to-stone-700",
            color_avatar: "from-green-600 to-stone-600",
            color_boton: "from-green-700 to-stone-600",
            color_tag1_bg: "bg-green-100",
            color_tag1_text: "text-green-700",
            titulo: "Libertad Auténtica",
            descripcion: "Reflexión sobre la importancia de ser auténtica en el mundo profesional, sin temor al juzgamiento.",
            contenido: "",
            imagen_portada: "",
            imagen: "",
            video: "",
            fecha: "12 de Marzo, 2024",
            tag1: "Autenticidad",
            tag2: "Libertad",
            color_tag2_bg: "bg-teal-100",
            color_tag2_text: "text-teal-700",
            boton_texto: "Leer reflexión"
        },
        {
            id: 2,
            color_desde: "from-blue-500",
            color_via: "via-blue-600",
            color_hasta: "to-indigo-700",
            color_avatar: "from-blue-500 to-indigo-600",
            color_boton: "from-blue-600 to-indigo-600",
            color_tag1_bg: "bg-blue-100",
            color_tag1_text: "text-blue-700",
            titulo: "Estrés vs Ansiedad",
            descripcion: "Guía práctica para entender las diferencias y cómo abordar cada una de estas emociones en tu vida diaria.",
            contenido: "",
            imagen_portada: "",
            imagen: "",
            video: "",
            fecha: "8 de Marzo, 2024",
            tag1: "Estrés",
            tag2: "Ansiedad",
            color_tag2_bg: "bg-indigo-100",
            color_tag2_text: "text-indigo-700",
            boton_texto: "Leer artículo"
        },
        {
            id: 3,
            color_desde: "from-amber-500",
            color_via: "via-amber-600",
            color_hasta: "to-orange-700",
            color_avatar: "from-amber-500 to-orange-600",
            color_boton: "from-amber-600 to-orange-600",
            color_tag1_bg: "bg-amber-100",
            color_tag1_text: "text-amber-700",
            titulo: "Mindfulness Diario",
            descripcion: "5 técnicas simples pero efectivas para reducir el estrés y mejorar tu bienestar diario.",
            contenido: "",
            imagen_portada: "",
            imagen: "",
            video: "",
            fecha: "1 de Marzo, 2024",
            tag1: "Mindfulness",
            tag2: "Bienestar",
            color_tag2_bg: "bg-amber-100",
            color_tag2_text: "text-amber-600",
            boton_texto: "Descubrir técnicas"
        },
        {
            id: 4,
            color_desde: "from-rose-500",
            color_via: "via-rose-600",
            color_hasta: "to-pink-700",
            color_avatar: "from-rose-500 to-pink-600",
            color_boton: "from-rose-600 to-pink-600",
            color_tag1_bg: "bg-rose-100",
            color_tag1_text: "text-rose-700",
            titulo: "Autoexigencia Transformada",
            descripcion: "Cómo convertir la autoexigencia de enemiga en aliada. Estrategias para un crecimiento saludable.",
            contenido: "",
            imagen_portada: "",
            imagen: "",
            video: "",
            fecha: "25 de Febrero, 2024",
            tag1: "Autoexigencia",
            tag2: "Crecimiento",
            color_tag2_bg: "bg-pink-100",
            color_tag2_text: "text-pink-700",
            boton_texto: "Leer más"
        }
    ]
};

/**
 * Obtiene los datos actuales (localStorage si existen, si no los defaults)
 */
function getDB() {
    try {
        const stored = localStorage.getItem(DB_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            // Siempre usar frases de DEFAULT_DATA para mantener actualizadas
            parsed.frases = DEFAULT_DATA.frases;
            if (!parsed.articulos || parsed.articulos.length === 0) parsed.articulos = DEFAULT_DATA.articulos;
            return parsed;
        }
    } catch (e) {
        console.warn('Error leyendo localStorage, usando datos por defecto.');
    }
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
}

/**
 * Guarda los datos en localStorage
 */
function saveDB(data) {
    try {
        localStorage.setItem(DB_KEY, JSON.stringify(data));
        return true;
    } catch (e) {
        console.error('Error guardando en localStorage:', e);
        return false;
    }
}

/**
 * Resetea todos los datos a los valores por defecto
 */
function resetDB() {
    localStorage.removeItem(DB_KEY);
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
}

// =============================================
// HELPERS: RESEÑAS ANÓNIMAS
// =============================================
const RESENAS_KEY = 'psico_resenas';

function getResenas() {
    try {
        const stored = localStorage.getItem(RESENAS_KEY);
        if (stored) return JSON.parse(stored);
    } catch(e) {}
    return [];
}
function saveResenas(resenas) {
    try { localStorage.setItem(RESENAS_KEY, JSON.stringify(resenas)); return true; }
    catch(e) { console.error('Error guardando reseñas:', e); return false; }
}
function agregarResena(datos) {
    const resenas = getResenas();
    const nueva = {
        id: Date.now(),
        texto: datos.texto,
        estrellas: datos.estrellas || 5,
        apodo: datos.apodo || 'Anónimo',
        fecha: new Date().toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' }),
        aprobada: false,
        creadaEn: new Date().toISOString()
    };
    resenas.push(nueva);
    saveResenas(resenas);
    return nueva;
}
function aprobarResena(id) {
    const resenas = getResenas();
    const idx = resenas.findIndex(r => r.id === id);
    if (idx !== -1) { resenas[idx].aprobada = true; saveResenas(resenas); return true; }
    return false;
}
function eliminarResena(id) {
    const resenas = getResenas().filter(r => r.id !== id);
    saveResenas(resenas);
}
