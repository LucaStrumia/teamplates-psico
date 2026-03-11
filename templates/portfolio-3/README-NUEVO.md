# Template Portfolio 1 - Diseño Profesional & Relajado

## 📋 Descripción

Template profesional para psicólogas y profesionales del bienestar. Diseño limpio, relajado y acogedor con colores inspirados en la naturaleza (verdes, azules y terrosos). Sin estructura de Instagram, sin reviews. 100% profesional y cálido.

### Características

✅ **Paleta de Naturaleza**
- Verdes salvia y bosque
- Azules suaves (cielo, agua)
- Tonos terrosos y ámbar
- Fondos degradados naturales

✅ **Diseño Profesional pero Relajado**
- Tipografía clara y legible
- Espacios amplios y respiro visual
- Sin sobrecargas visuales
- Estructura intuitiva y directa

✅ **Secciones Estratégicas**
- Hero con foto profesional a full width
- Sección "Sobre Mí" detallada con formación
- Servicios con precios (3 opciones)
- Reflexiones/Blog inspirador (4 posts)
- "Mi Enfoque" (3 pilares de trabajo)
- Contacto directo y accesible
- Footer minimalista

✅ **Responsive & Mobile-First**
- Adaptado a todos los dispositivos
- Menú hamburguesa para móvil
- Imágenes optimizadas

✅ **Interactivo**
- Scroll suave
- Animaciones sutiles
- Validación de formularios
- Efectos hover elegantes

---

## 🎨 Paleta de Colores Nuevos

```
Verde Principal:      #6B8E7F (Verde Salvia)
Verde Oscuro:        #4A6B5D (Verde Bosque)
Verde Claro:         #A8C5B8
Azul Suave:          #6B9DB8
Ámbar/Terroso:       #C4A576
Gris Texto:          #4A5568
Fondo Claro:         #F7FAFC
Blanco:              #FFFFFF
```

---

## 📁 Estructura de Archivos

```
portfolio-1/
├── index.html          # HTML principal
├── styles.css          # Estilos personalizados
├── script.js           # Funcionalidades JavaScript
├── README.md           # Este archivo
└── assets/             # (Crear carpeta para tus imágenes)
    └── images/
```

---

## 🚀 Cómo Usar

### 1. **Abrir el Template**

**Opción A - Doble click:**
1. Abre explorador: `c:\Users\luca_\Documents\projectos\Teamplates Psico\templates\portfolio-1\`
2. Doble click en `index.html`
3. ¡Abierto en tu navegador! 🎉

**Opción B - VS Code (Recomendado):**
1. Abre VS Code
2. Abre la carpeta del proyecto
3. Click derecho en `index.html`
4. Selecciona "Open with Live Server"

### 2. **Personalización**

#### A. Cambiar Nombre

```html
<!-- En navbar -->
<div class="text-xl font-semibold text-green-700">Tu Nombre</div>

<!-- En hero -->
<h1 class="text-5xl md:text-6xl font-light text-gray-900 mb-4">
    Tu Nombre<br>Apellido
</h1>
```

#### B. Cambiar Foto Principal

Primero, descarga o toma una foto profesional. Luego:

```html
<img src="tu-foto.jpg" alt="Tu Nombre">
```

O reemplaza la URL placeholder:
```html
<img src="https://via.placeholder.com/400x400/A8C5B8/ffffff" 
     alt="Tu Nombre">
```

#### C. Actualizar Especialización

```html
<p class="text-gray-700 text-lg leading-relaxed mb-8 max-w-lg">
    Acompañamiento profesional para mujeres que buscan 
    <strong>tu especialidad aquí</strong>
</p>
```

#### D. Datos Profesionales

```html
<p><strong>Matrícula:</strong> Tu número</p>
<p><strong>Modalidades:</strong> Presencial, Online</p>
<p><strong>Especialización:</strong> Tu especialización</p>
```

#### E. Servicios

Modifica en la sección "Mis Servicios":

```html
<div class="bg-white p-8 rounded-xl shadow-md">
    <div class="text-5xl mb-6">🌱</div>
    <h3 class="text-2xl font-semibold text-gray-900 mb-4">Tu Servicio</h3>
    <p class="text-gray-700 mb-6 leading-relaxed">
        Descripción del servicio aquí
    </p>
    <div class="space-y-2 text-sm text-gray-600 mb-6">
        <p>✓ Beneficio 1</p>
        <p>✓ Beneficio 2</p>
    </div>
    <p class="text-2xl font-semibold text-green-600">$XX USD</p>
</div>
```

#### F. Sección "Sobre Mí"

```html
<p class="text-gray-700 text-lg leading-relaxed">
    Soy [Tu Nombre], psicóloga especializada en...
</p>

<div class="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-xl">
    <p class="text-gray-800 italic text-lg font-light">
        "Tu frase inspiradora aquí"
    </p>
</div>

<div class="space-y-4">
    <h3>Formación</h3>
    <ul class="space-y-3">
        <li class="flex items-start gap-3">
            <span>📚</span>
            <span>Tu formación aquí</span>
        </li>
    </ul>
</div>
```

#### G. Blog/Reflexiones

```html
<article class="bg-white rounded-xl overflow-hidden shadow-md">
    <div class="h-48 bg-gradient-to-br from-green-500 to-green-600 flex items-center p-6">
        <h3 class="text-2xl font-light text-white">Tu Título</h3>
    </div>
    <div class="p-6">
        <p class="text-gray-600 text-sm mb-4 font-medium">Mes DD, YYYY</p>
        <p class="text-gray-700 leading-relaxed">
            Tu contenido o descripción corta
        </p>
        <button class="mt-6 text-green-600 font-semibold">Leer más →</button>
    </div>
</article>
```

#### H. Mi Enfoque

```html
<div class="bg-gradient-to-br from-green-50 to-green-100/50 p-8 rounded-xl">
    <div class="text-5xl mb-4">🌱</div>
    <h3>Tu Pilar 1</h3>
    <p>Descripción de qué es y cómo lo aplicas</p>
</div>
```

#### I. Contacto

```html
<a href="mailto:tu@email.com">tu@email.com</a>
<a href="https://wa.me/+54934123456">+54 9 34 123456</a>
```

---

## 🎯 Secciones Principales

### 1. **Hero/Header** (Primera impresión)
- Foto profesional grande
- Nombre destacado
- Subtítulo profesional
- Info clave (matrícula, modalidades, especialización)
- 2 botones CTA

### 2. **Sobre Mí** (Construir confianza)
- Foto + Texto
- Historia profesional
- Frase inspiradora
- Credenciales/Formación

### 3. **Servicios** (Soluciones claras)
- 3 servicios principales
- Descripción + beneficios
- Precios transparentes

### 4. **Mi Enfoque** (Diferenciación)
- 3 pilares de tu trabajo
- Crecimiento Natural
- Bienestar Integral
- Autenticidad

### 5. **Reflexiones** (Valor agregado)
- 4 artículos inspiradores
- Colores degradados
- Fechas de publicación

### 6. **Contacto** (Conversión)
- Información clara
- Formulario simple
- Ubicación y horarios
- Redes sociales

---

## 🔄 Cambiar Colores

En `styles.css`:

```css
:root {
    --color-green-primary: #6B8E7F;    /* Verde primario */
    --color-green-dark: #4A6B5D;       /* Verde oscuro */
    --color-blue-soft: #6B9DB8;        /* Azul suave */
    --color-amber-soft: #C4A576;       /* Ámbar/terroso */
}
```

O busca y reemplaza directamente los colores en HTML.

---

## 📱 Responsive Breakpoints

- **Mobile**: < 768px (2 columnas → 1 columna)
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px (layout óptimo)

Todo se adapta automáticamente.

---

## 🔌 Integración con Backend

Cuando tengas backend listo, en `script.js`:

```javascript
const API_URL = 'http://localhost:3000/api';

// Enviar formulario
async function submitForm(data) {
    const response = await fetch(`${API_URL}/contact-messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
}
```

---

## 💡 Mejores Prácticas

1. **Fotos**: Alta calidad, profesionales, pero con calidez humana
2. **Contenido**: Claro, conciso, enfocado en beneficios (no features)
3. **Colores**: Los degradados naturales van de arriba a abajo
4. **Espacios**: Márgenes generosos para respirar visualmente
5. **Tipografía**: Títulos en `font-light`, cuerpo en `font-normal`
6. **Formulario**: Mantén simple (solo nombre, email, mensaje)

---

## ✅ Checklist de Personalización

- [ ] Cambiar nombre y apellido
- [ ] Actualizar foto profesional
- [ ] Escribir "Sobre mí" personalizado
- [ ] Agregar servicios reales con precios
- [ ] Escribir frase inspiradora
- [ ] Listar formación académica
- [ ] Escribir "Mi Enfoque" (tus 3 pilares)
- [ ] Crear 3-4 reflexiones/artículos
- [ ] Actualizar email y WhatsApp
- [ ] Cambiar links a redes sociales
- [ ] Revisar en mobile
- [ ] Ir en vivo

---

## 🎨 Customizaciones Avanzadas

### Agregar Animaciones
```css
@keyframes slideIn {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}

section { animation: slideIn 0.6s ease-out; }
```

### Cambiar Fuentes
En `<head>` del HTML:
```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
```

### Agregar Favicon
```html
<link rel="icon" type="image/png" href="tu-icono.png">
```

---

## 🚀 Próximos Pasos

1. Personaliza todo el contenido
2. Agrega fotos de calidad
3. Prueba en mobile
4. Cuando estés lista, sube a hosting
5. Integra con backend para formularios

---

## 📊 Performance

- **Tamaño**: Ligero y rápido
- **Carga**: < 2 segundos
- **Optimizado**: Sin frameworks pesados
- **SEO Ready**: Estructura semántica HTML5

---

**Última actualización**: Marzo 2024  
**Versión**: 2.0.0 (Rediseño Profesional & Relajado)

¿Necesitas ayuda? Consulta `/docs/SETUP.md` o `/docs/ARCHITECTURE.md`
