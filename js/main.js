const raiz = document.documentElement;
raiz.classList.add('js');

// Elementos que aparecen escalonados dentro de su grupo
document.querySelectorAll('.galeria-imagenes li, .tarjeta, .paso, .dudas-contenedor details').forEach((el) => {
    el.style.setProperty('--i', [...el.parentElement.children].indexOf(el) % 6);
    el.classList.add('escalon');
});

// Aparición al hacer scroll
const io = new IntersectionObserver((entradas) => {
    for (const e of entradas) {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            io.unobserve(e.target);
        }
    }
}, { threshold: 0.1 });
document.querySelectorAll('h2').forEach((h) => h.classList.add('titulo'));
document.querySelectorAll('.reveal, .escalon, .titulo').forEach((el) => io.observe(el));

// Enlace activo en la navegación
const enlaces = document.querySelectorAll('.navegacion-principal a');
const nav = new IntersectionObserver((entradas) => {
    for (const e of entradas) {
        if (e.isIntersecting) {
            enlaces.forEach((a) => a.classList.toggle('activo', a.hash === `#${e.target.id}`));
        }
    }
}, { rootMargin: '-40% 0px -55% 0px' });
document.querySelectorAll('main section[id]').forEach((s) => nav.observe(s));

// Visor de imágenes: sin JS cada miniatura abre la imagen grande
const visor = document.querySelector('.visor');
const fuentes = visor.querySelectorAll('source');
const imagen = visor.querySelector('img');
const miniaturas = [...document.querySelectorAll('.galeria-imagenes a')];
let actual = 0;

function mostrar(i) {
    actual = (i + miniaturas.length) % miniaturas.length;
    const a = miniaturas[actual];
    const base = a.dataset.grande;
    fuentes[0].srcset = `${base}.avif`;
    fuentes[1].srcset = `${base}.webp`;
    imagen.src = `${base}.jpg`;
    imagen.alt = a.querySelector('img').alt;
}

miniaturas.forEach((a, i) => a.addEventListener('click', (e) => {
    e.preventDefault();
    mostrar(i);
    visor.showModal();
}));
visor.querySelector('.ant').addEventListener('click', () => mostrar(actual - 1));
visor.querySelector('.sig').addEventListener('click', () => mostrar(actual + 1));
visor.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') mostrar(actual - 1);
    if (e.key === 'ArrowRight') mostrar(actual + 1);
});
visor.addEventListener('click', (e) => { if (e.target === visor) visor.close(); });

// Presupuesto: arma el mensaje y lo envía por WhatsApp o email (sin backend)
const formulario = document.getElementById('form-presupuesto');
formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    const d = new FormData(formulario);
    const linea = (t, v) => (v ? `${t}: ${v}` : '');
    const mensaje = [
        'Hola, quiero pedir un presupuesto.',
        linea('Nombre', d.get('nombre')),
        linea('Pedido', d.get('tipo')),
        linea('Texto/diseño', d.get('texto')),
        linea('Medidas', d.get('medidas')),
        linea('Cantidad', d.get('cantidad')),
        linea('Ciudad', d.get('ciudad')),
        d.get('vector') ? 'Necesito vectorizado del logo.' : '',
        linea('Comentarios', d.get('comentarios')),
    ].filter(Boolean).join('\n');
    if (e.submitter.dataset.via === 'wa') {
        window.open(`https://wa.me/5491134687692?text=${encodeURIComponent(mensaje)}`, '_blank', 'noopener');
    } else {
        location.href = `mailto:fabricadecorporeos@gmail.com?subject=${encodeURIComponent('Pedido de presupuesto')}&body=${encodeURIComponent(mensaje)}`;
    }
});

// Efectos de scroll: barra de progreso, header compacto y parallax del hero
const cabecera = document.querySelector('.header');
const progreso = document.querySelector('.progreso');
const hero = document.querySelector('.hero');
const sinMovimiento = matchMedia('(prefers-reduced-motion: reduce)').matches;
let pendiente = false;

const paralaje = [...document.querySelectorAll('.pasos, .atencion-personalizada picture')];

function alScroll() {
    pendiente = false;
    const y = window.scrollY;
    const total = raiz.scrollHeight - innerHeight;
    progreso.style.setProperty('--p', total > 0 ? y / total : 0);
    cabecera.classList.toggle('compacto', y > 40);
    if (sinMovimiento) return;
    if (y < innerHeight * 1.5) hero.style.setProperty('--py', y);
    for (const el of paralaje) {
        const r = el.getBoundingClientRect();
        if (r.bottom > 0 && r.top < innerHeight) {
            const dy = (r.top + r.height / 2 - innerHeight / 2) * -0.08;
            el.style.setProperty('--dy', Math.max(-40, Math.min(40, dy)).toFixed(1));
        }
    }
}
addEventListener('scroll', () => {
    if (!pendiente) {
        pendiente = true;
        requestAnimationFrame(alScroll);
    }
}, { passive: true });
alScroll();

// Luz que sigue al puntero en el hero y en los pasos (solo con mouse)
if (matchMedia('(hover: hover)').matches && !sinMovimiento) {
    hero.addEventListener('pointermove', (e) => {
        const r = hero.getBoundingClientRect();
        hero.style.setProperty('--mx', `${e.clientX - r.left}px`);
        hero.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
    document.querySelectorAll('.paso').forEach((p) => p.addEventListener('pointermove', (e) => {
        const r = p.getBoundingClientRect();
        p.style.setProperty('--mx', `${e.clientX - r.left}px`);
        p.style.setProperty('--my', `${e.clientY - r.top}px`);
    }));
}
