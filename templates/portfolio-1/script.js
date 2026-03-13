    /* =============================================
   JAVASCRIPT - TEMPLATE 1
   Funcionalidades interactivas con animaciones suaves
   ============================================= */

// =============================================
// INYECTAR ESTILOS DE ANIMACIÓN AL INICIO
// =============================================

const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInSection {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(25px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes fadeInDown {
        from {
            opacity: 0;
            transform: translateY(-25px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes scaleInGentle {
        from {
            opacity: 0;
            transform: scale(0.95);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }

    @keyframes slideInFromLeft {
        from {
            opacity: 0;
            transform: translateX(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideInFromRight {
        from {
            opacity: 0;
            transform: translateX(20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    /* Evitar que los elementos parpadeen antes de la animación */
    section, article, .card, .grid {
        opacity: 1;
    }
`;
document.head.appendChild(style);

// =============================================
// ANIMACIONES AL SCROLLEAR - SUAVES Y TRANQUILAS
// =============================================

const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.hasAttribute('data-animated')) {
            entry.target.setAttribute('data-animated', 'true');
            
            // Aplicar animación según el tipo de elemento
            const el = entry.target;
            
            if (el.tagName === 'SECTION' || el.classList.contains('section')) {
                // Las secciones aparecen con fade suave
                el.style.animation = 'fadeInSection 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
            } else if (el.classList.contains('grid')) {
                // Los grids tienen un efecto de aparición escalonada
                el.style.animation = 'fadeInUp 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
                const children = el.children;
                Array.from(children).forEach((child, index) => {
                    child.style.animation = `fadeInUp 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) forwards`;
                    child.style.animationDelay = `${index * 0.12}s`;
                    child.style.opacity = '1'; // Asegurar que es visible
                });
            } else {
                // Elementos individuales
                el.style.animation = 'fadeInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
            }
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observar todas las secciones y elementos
document.querySelectorAll('section, .grid, article, .card, header').forEach(el => {
    el.setAttribute('data-animated', 'false');
    observer.observe(el);
});

// =============================================
// INYECTAR ESTILOS DE ANIMACIÓN
// =============================================

const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInSection {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(25px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes scaleInGentle {
        from {
            opacity: 0;
            transform: scale(0.95);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }

    @keyframes slideInFromLeft {
        from {
            opacity: 0;
            transform: translateX(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideInFromRight {
        from {
            opacity: 0;
            transform: translateX(20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    /* Evitar que los elementos parpadeen antes de la animación */
    section, article, .card, .grid {
        opacity: 1;
    }
`;
document.head.appendChild(style);

// =============================================
// EFECTO PARALLAX SUAVE AL SCROLL
// =============================================

let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            
            // Efecto parallax suave en el header
            const header = document.querySelector('header');
            if (header) {
                const offset = scrollY * 0.2; // Más sutil
                header.style.transform = `translateY(${offset}px)`;
            }
            
            // Efecto parallax muy sutil en la imagen del header
            const headerImage = document.querySelector('header img');
            if (headerImage && scrollY < 300) { // Solo en los primeros 300px
                const imageOffset = scrollY * 0.05; // Mucho más sutil
                headerImage.style.transform = `translateY(${imageOffset}px)`;
            }
            
            ticking = false;
        });
        ticking = true;
    }
});

// =============================================
// MOBILE MENU TOGGLE
// =============================================

const menuToggle = document.querySelector('button.md\\:hidden');
let menuOpen = false;

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        const navbar = document.querySelector('nav ul');
        menuOpen = !menuOpen;
        
        if (menuOpen) {
            navbar.classList.remove('hidden');
            navbar.style.animation = 'slideInFromTop 0.3s ease-out forwards';
        } else {
            navbar.style.animation = 'slideOutToTop 0.3s ease-out forwards';
            setTimeout(() => navbar.classList.add('hidden'), 300);
        }
    });

    // Cerrar menu al hacer click en un link
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', () => {
            if (menuOpen) {
                const navbar = document.querySelector('nav ul');
                navbar.style.animation = 'slideOutToTop 0.3s ease-out forwards';
                setTimeout(() => navbar.classList.add('hidden'), 300);
                menuOpen = false;
            }
        });
    });
}

// =============================================
// FORM VALIDATION & SUBMISSION
// =============================================

const contactForm = document.querySelector('form');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name') || document.querySelector('input[placeholder="Tu nombre"]').value,
            email: formData.get('email') || document.querySelector('input[placeholder="Tu email"]').value,
            message: formData.get('message') || document.querySelector('textarea').value
        };

        // Validación básica
        if (!data.name || !data.email || !data.message) {
            showNotification('Por favor, completa todos los campos', 'warning');
            return;
        }

        if (!isValidEmail(data.email)) {
            showNotification('Por favor, ingresa un email válido', 'warning');
            return;
        }

        console.log('Formulario válido:', data);
        showNotification('¡Mensaje enviado! Te contactaré pronto.', 'success');
        contactForm.reset();
    });
}

// Función para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// =============================================
// BOTONES DE REDES SOCIALES
// =============================================

const socialLinks = {
    instagram: 'https://www.instagram.com/psic.cande/',
    whatsapp: 'https://wa.me/543584397037',
    email: 'mailto:candela@example.com',
    linkedin: 'https://linkedin.com/in/candela-gonzalez'
};

document.querySelectorAll('a[href="#"]').forEach((link, index) => {
    const socialKeys = Object.keys(socialLinks);
    if (index < socialKeys.length) {
        link.href = socialLinks[socialKeys[index]];
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
    }
});

// =============================================
// FEEDBACK AL USUARIO
// =============================================

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg text-white text-sm font-medium z-50
        ${type === 'success' ? 'bg-green-600' : type === 'warning' ? 'bg-amber-600' : 'bg-red-600'}`;
    notification.textContent = message;
    notification.style.animation = 'slideInFromRight 0.4s ease-out forwards';
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutToRight 0.4s ease-out forwards';
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}

// =============================================
// SCROLL SUAVE A ANCLAS
// =============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// =============================================
// OPTIMIZACIÓN DE IMÁGENES
// =============================================

// Mejorar carga de imágenes con lazy loading mejorado
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // Agregar clase de carga
        img.classList.add('image-loading');
        
        // Si ya está cargada (cache)
        if (img.complete) {
            img.classList.remove('image-loading');
            img.classList.add('image-loaded');
        }
        
        // Cuando la imagen carga completamente
        img.addEventListener('load', function() {
            this.classList.remove('image-loading');
            this.classList.add('image-loaded');
        });
        
        // Si hay error en la carga
        img.addEventListener('error', function() {
            this.classList.remove('image-loading');
            this.classList.add('image-error');
            console.warn('Error cargando imagen:', this.src);
        });
    });
});

// =============================================
// LAZY LOADING DE IMÁGENES
// =============================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img.lazy').forEach(img => imageObserver.observe(img));
}

// =============================================
// INICIALIZACIÓN
// =============================================

console.log('✔ Portfolio Candela cargado con animaciones suaves');

