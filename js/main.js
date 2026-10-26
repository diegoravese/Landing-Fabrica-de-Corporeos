const raiz = document.documentElement;
raiz.classList.add('js');

// Aparición al hacer scroll
const io = new IntersectionObserver((entradas) => {
    for (const e of entradas) {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            io.unobserve(e.target);
        }
    }
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

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
