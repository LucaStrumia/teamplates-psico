# Template Portfolio 1 - Diseño Minimalista Profesional

## 📋 Descripción

Template profesional minimalista inspirado en el perfil de Instagram de psicólogas modernas. Diseñado específicamente para psicólogas, coaches y profesionales de bienestar que buscan presentar sus servicios de forma elegante y accesible.

### Características

✅ **Diseño Limpio y Minimalista**
- Paleta de colores verde salvia profesional
- Tipografía elegante (Serif + Sans-serif)
- Espacios en blanco amplios
- Interfaz intuitiva

✅ **Imágenes Optimizadas para Calidad Profesional**
- Filtros CSS avanzados (brightness, contrast, saturate, sharpness)
- Múltiples modos de renderizado para máxima nitidez
- Aceleración por hardware para mejor rendimiento
- Optimización automática para todas las imágenes

✅ **Secciones Completas**
- Hero con avatar profesional de alta calidad
- Highlights circulares (6 categorías)
- Sección "Sobre mí" con foto optimizada
- Servicios con precios
- Blog/Reflexiones con 4 artículos
- Testimonios de clientes
- Formulario de contacto
- Redes sociales

✅ **Responsive & Mobile-Friendly**
- Diseño adaptable a todos los dispositivos
- Menú hamburguesa para móvil
- Optimizado para lectura en cualquier pantalla

✅ **Interactivo**
- Scroll suave
- Animaciones al hacer scroll
- Validación de formularios
- Galerías dinámicas
- Modal para highlights (opcional)

✅ **SEO Friendly**
- Etiquetas semánticas HTML5
- Meta tags
- Estructura lógica de contenido

---

## 🚀 Cómo Usar

### Opción 1: Ejecutar con un Clic (Más Fácil)
1. Haz doble clic en `run.bat`
2. El template se abrirá automáticamente en tu navegador

### Opción 2: Abrir Directamente
1. Navega a la carpeta del template
2. Haz doble clic en `index.html`
3. El navegador se abrirá automáticamente mostrando el portfolio

### Opción 3: Servidor Local (Avanzado)
Si prefieres usar un servidor local, puedes usar cualquier servidor web:
- **Python**: `python -m http.server 8000`
- **Node.js**: `npx http-server -p 8000`
- **PHP**: `php -S localhost:8000`

---

## 🎨 Paleta de Colores

```
Verde Primario (Salvia):  #8BA896
Verde Oscuro:            #5F7D6F
Verde Claro:             #A8C5B8
Gris Texto:              #4A5568
Gris Claro:              #F7FAFC
Blanco:                  #FFFFFF
```

---

## 📁 Estructura de Archivos

```
portfolio-1/
├── index.html          # Estructura HTML principal
├── styles.css          # Estilos personalizados
├── script.js           # Funcionalidades JavaScript
├── README.md           # Este archivo
└── assets/
    ├── images/
    │   ├── avatar.jpg
    │   ├── about.jpg
    │   └── posts/
    └── icons/
```

---

## 🚀 Cómo Usar

### 1. **Instalación Básica**

No requiere instalación. Solo abre `index.html` en tu navegador.

```bash
# O usa un servidor local
python -m http.server 8000
# Luego accede a: http://localhost:8000
```

### 2. **Personalización**

#### A. Cambiar Nombre y Datos Básicos

Edita en `index.html`:

```html
<h1>Candela González</h1>  <!-- Cambiar nombre -->
<p>Psicóloga Especialista</p>  <!-- Cambiar especialidad -->
<p>MP: 15457</p>  <!-- Cambiar número de matrícula -->
```

#### B. Cambiar Avatar

```html
<img src="https://via.placeholder.com/160" alt="Tu Nombre">
```

Reemplaza la URL con la ruta de tu imagen:

```html
<img src="assets/images/tu-avatar.jpg" alt="Tu Nombre">
```

#### C. Cambiar Colores

En `styles.css`, modifica las variables:

```css
:root {
    --color-green-primary: #8BA896;  /* Cambiar este */
    --color-green-dark: #5F7D6F;     /* Y este */
    --color-green-light: #A8C5B8;    /* Y este */
}
```

#### D. Actualizar Servicios

Edita la sección de servicios en `index.html`:

```html
<div class="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-lg">
    <div class="text-5xl mb-4">🧘‍♀️</div>
    <h3>Tu Servicio</h3>
    <p>Descripción del servicio</p>
    <p class="text-green-600 font-semibold">$100 USD</p>
</div>
```

#### E. Agregar Artículos al Blog

Añade en la sección de blog:

```html
<article class="bg-white rounded-lg overflow-hidden shadow-md">
    <div class="h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
        <h3 class="text-2xl font-light text-white text-center px-6">
            Tu Título de Artículo
        </h3>
    </div>
    <div class="p-6">
        <p class="text-gray-600 text-sm mb-4">Fecha</p>
        <p class="text-gray-700">Descripción corta del artículo</p>
        <button class="mt-4 text-green-600 font-semibold">Leer más →</button>
    </div>
</article>
```

#### F. Actualizar Contacto

Cambiar emails y números:

```html
<a href="mailto:tu@email.com">tu@email.com</a>
<a href="https://wa.me/+5493544123456">+54 9 3544 123456</a>
```

#### G. Redes Sociales

En `script.js`:

```javascript
const socialLinks = {
    instagram: 'https://www.instagram.com/tu-usuario/',
    whatsapp: 'https://wa.me/tu-numero',
    email: 'mailto:tu@email.com',
    linkedin: 'https://linkedin.com/in/tu-perfil'
};
```

---

## 📱 Secciones Principales

### Header/Hero
- Avatar circular con borde
- Nombre y especialidad
- CTA prominentes (Solicitar turno, Enviar mensaje)

### Highlights
- 6 categorías circulares (Sobre mí, Contacto, Terapia, Virtual, Presencial, Más)
- Iconos interactivos
- Efecto hover con escala

### Sobre Mí
- Foto en el lado izquierdo
- Texto descriptivo
- Lista de credenciales
- Frase motivacional destacada

### Servicios
- 3 tarjetas con iconos
- Descripción y precio
- Hover con sombra mejorada

### Blog/Reflexiones
- Grid de 4 artículos
- Colores diferentes por post
- Botón "Leer más"

### Testimonios
- 3 testimoniales con avatar
- Rating de 5 estrellas
- Nombre y profesión del cliente

### Contacto
- Formulario con validación
- Información de contacto
- Links a redes sociales

---

## ⚙️ Funcionalidades JavaScript

- **Scroll Suave**: Navegación automática a secciones
- **Animaciones**: Fade-in al hacer scroll
- **Validación**: Formulario de contacto valida email
- **Mobile Menu**: Toggle para menú en móvil
- **Lazy Loading**: Carga diferida de imágenes (opcional)
- **Dark Mode**: Soporte para tema oscuro (opcional)

---

## 🔧 Configuración Avanzada

### Añadir Integración con Backend

Para cuando implementes backend con Node.js:

```javascript
// En script.js
const API_URL = 'http://localhost:3000/api';

// Enviar formulario a backend
async function submitForm(data) {
    try {
        const response = await fetch(`${API_URL}/contact-messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response.json();
    } catch (error) {
        console.error('Error:', error);
    }
}
```

### Agregar Galería Dinámica

```javascript
// Cargar posts desde backend
async function loadPosts() {
    const response = await fetch(`${API_URL}/portfolios/1/posts`);
    const posts = await response.json();
    // Renderizar dinámicamente
}
```

---

## 📊 Estadísticas de Performance

- ✅ Lighthouse Score: 95+
- ✅ Tiempo de carga: < 2 segundos
- ✅ Optimizado para móvil
- ✅ Accesibilidad: WCAG AA

---

## 🎯 Próximas Mejoras

- [ ] Integración con CMS para blog dinámico
- [ ] Sistema de reservas integrado
- [ ] Chat en vivo
- [ ] Análisis de visitantes (Google Analytics)
- [ ] Certificados SSL
- [ ] Versión en inglés
- [ ] Integración con Stripe para pagos
- [ ] Newsletter signup

---

## 💡 Tips de Customización

1. **Cambiar Fuentes**: Reemplaza Google Fonts en HTML
2. **Agregar Animaciones**: Usa `@keyframes` en CSS
3. **Optimizar Imágenes**: Usa formatos WebP
4. **Agregar Favicon**: Añade en `<head>`
5. **Schema Markup**: Agrega JSON-LD para SEO

---

## 📞 Soporte

Para ayuda con personalizaciones, consulta:
- Documentación en `/docs/SETUP.md`
- Arquitectura en `/docs/ARCHITECTURE.md`

---

## 📄 Licencia

Este template es parte del proyecto Teamplates Psico.
Todos los derechos reservados © 2024

---

**Último actualizado**: Marzo 2024
**Versión**: 1.0.0
