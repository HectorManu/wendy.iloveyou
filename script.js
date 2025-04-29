// Configuración principal
const config = {
    startDate: '2024-11-24T00:00:00',
    photoBasePath: '/img/',
    photosJsonUrl: 'photos.json',
    stardustOptions: {
        enabled: true,
        particleCount: 30, // Reducido para mejor rendimiento
        colors: ['#ff6b95', '#7e57c2', '#00bcd4']
    }
};

// Estado de la aplicación
let photosData = [];
let currentSlide = 0;
let heartColors = ['#ff6b95', '#7e57c2', '#00bcd4', '#ff4081', '#9575cd'];
let currentColorIndex = 0;
let confettiAnimationId;

// Actualizar CSS dinámicamente para evitar caché
const link = document.querySelector("link[rel='stylesheet']");
if (link) {
    link.href = link.href.split("?")[0] + "?" + new Date().getTime();
}

// Elementos del DOM
const carouselInner = document.getElementById('carousel-inner');
const heartBtn = document.getElementById('heart-btn');
const body = document.body;
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

// Evento para el botón de corazón
heartBtn.addEventListener('click', () => {
    currentColorIndex = (currentColorIndex + 1) % heartColors.length;
    heartBtn.style.color = heartColors[currentColorIndex];
});

// Función para cargar JSON de fotos
async function loadPhotosData() {
    try {
        const response = await fetch(config.photosJsonUrl);
        if (!response.ok) {
            throw new Error('No se pudo cargar el JSON de fotos');
        }
        photosData = await response.json();
        renderCarousel();
    } catch (error) {
        console.error('Error cargando las fotos:', error);
        // Cargar datos de fallback
        photosData = [
            {
                id: 1,
                filename: "1_foto.webp",
                caption: "Cada segundo a tu lado es un tesoro que guardo en mi corazón"
            },
            {
                id: 2,
                filename: "PXL_20241225_232128125.MP.webp",
                caption: "Tu sonrisa ilumina mi mundo y me hace la persona más feliz"
            },
            {
                id: 3,
                filename: "PXL_20250118_125154609.webp",
                caption: "Contigo, cada momento se convierte en un recuerdo inolvidable"
            }
        ];
        renderCarousel();
    }
}

// Función para renderizar el carrusel con los datos del JSON
function renderCarousel() {
    carouselInner.innerHTML = '';
    
    photosData.forEach((photo, index) => {
        const item = document.createElement('div');
        item.className = 'carousel-item';
        
        const img = document.createElement('img');
        img.src = `${config.photoBasePath}${photo.filename}`;
        img.alt = `Foto ${photo.id}`;
        img.loading = 'lazy';
        
        const caption = document.createElement('div');
        caption.className = 'carousel-caption';
        caption.textContent = `"${photo.caption}"`;
        
        item.appendChild(img);
        item.appendChild(caption);
        carouselInner.appendChild(item);
    });
    
    moveCarousel(0); // Inicializar la posición del carrusel
}

// Contador de tiempo juntos
const startDate = new Date(config.startDate);

function updateCounter() {
    const now = new Date();
    const diff = now - startDate;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const counterElement = document.getElementById('counter');
    
    if (window.innerWidth < 480) {
        counterElement.innerHTML = 
            `${days}d ${hours}h<br>${minutes}m ${seconds}s<br>juntos ❤️`;
    } else {
        counterElement.innerHTML = 
            `${days} días, ${hours} horas, ${minutes} minutos y ${seconds} segundos juntos ❤️`;
    }
}

// Función para manejar el carrusel
function moveCarousel(direction) {
    if (!photosData.length) return;
    
    currentSlide = (currentSlide + direction + photosData.length) % photosData.length;
    carouselInner.style.transform = `translateX(-${currentSlide * 100}%)`;
}

// Event listeners para swipe en el carrusel
let touchStartX = 0;
let touchEndX = 0;

carouselInner.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
}, false);

carouselInner.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, false);

function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
        moveCarousel(1);
    }
    if (touchEndX > touchStartX + swipeThreshold) {
        moveCarousel(-1);
    }
}

// Event listeners para los botones del carrusel
prevBtn.addEventListener('click', () => moveCarousel(-1));
nextBtn.addEventListener('click', () => moveCarousel(1));

// Manejar cambio de orientación
window.addEventListener('orientationchange', () => {
    setTimeout(updateCounter, 100);
});

// Crear animación de partículas brillantes (stardust) en forma de corazón
function createStardustAnimation() {
    if (!config.stardustOptions.enabled) return;
    
    // Eliminar si ya existe
    const existingStardust = document.querySelector('.stardust-container');
    if (existingStardust) {
        existingStardust.remove();
    }
    
    // Crear contenedor
    const stardustContainer = document.createElement('div');
    stardustContainer.className = 'stardust-container';
    
    body.appendChild(stardustContainer);
    
    // Crear partículas
    for (let i = 0; i < config.stardustOptions.particleCount; i++) {
        createStardustParticle(stardustContainer);
    }
}


/// Crear una partícula de stardust
function createStardustParticle(container) {
    // Decidir aleatoriamente si crear un corazón o una partícula circular
    const isHeart = Math.random() > 0.3; // 70% de probabilidad de ser corazón
    
    const particle = document.createElement('div');
    
    // Estilos base comunes
    particle.style.position = 'absolute';
    particle.style.pointerEvents = 'none';
    
    // Posición aleatoria
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    particle.style.left = `${posX}%`;
    particle.style.top = `${posY}%`;
    
    // Color aleatorio
    const colorIndex = Math.floor(Math.random() * config.stardustOptions.colors.length);
    const color = config.stardustOptions.colors[colorIndex];
    
    if (isHeart) {
        // Crear un corazón
        particle.className = 'stardust-heart';
        
        // Tamaño aleatorio para el corazón
        const size = Math.random() * 15 + 5; // 5-20px
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Configurar el color y el brillo
        particle.style.backgroundColor = 'transparent'; // El fondo debe ser transparente
        particle.innerHTML = `
            <svg viewBox="0 0 24 24" width="${size}px" height="${size}px">
                <path fill="${color}" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
        `;
        
        // Aplicar filtro de brillo
        const glow = Math.random() * 5 + 3; // 3-8px de brillo
        particle.style.filter = `drop-shadow(0 0 ${glow}px ${color})`;
    } else {
        // Crear una partícula circular
        particle.className = 'stardust-particle';
        const size = Math.random() * 4 + 2; // 2-6px
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.borderRadius = '50%';
        particle.style.backgroundColor = color;
        
        // Añadir brillo más intenso
        const glow = size * 2;
        particle.style.boxShadow = `0 0 ${glow}px ${glow/2}px ${color}`;
    }
    
    // Animación de parpadeo
    const duration = Math.random() * 5 + 3; // 3-8s
    particle.style.animation = `twinkle ${duration}s infinite ease-in-out`;
    particle.style.animationDelay = `${Math.random() * 5}s`;
    
    // Añadir al contenedor
    container.appendChild(particle);
}

// Inicialización
window.addEventListener('DOMContentLoaded', () => {
    loadPhotosData();
    updateCounter();
    setInterval(updateCounter, 1000);
    
    // Crear animación de stardust
    createStardustAnimation();
    
    // Inicializar propuesta
    if (window.proposalManager) {
        window.proposalManager.init();
    }
    
    // Inicializar eventos especiales si están disponibles
    if (window.specialEvents) {
        window.specialEvents.initializeSpecialEvents();
    }
    
    // Añadir interacción para el movimiento de partículas con el mouse (reducido para mejorar rendimiento)
    document.addEventListener('mousemove', (e) => {
        if (!config.stardustOptions.enabled) return;
        
        // Crear una partícula adicional ocasionalmente con el movimiento del mouse
        if (Math.random() > 0.98) { // Reducido para mejor rendimiento
            const stardustContainer = document.querySelector('.stardust-container');
            if (stardustContainer) {
                const particle = document.createElement('div');
                
                particle.style.position = 'absolute';
                particle.style.borderRadius = '50%';
                particle.style.pointerEvents = 'none';
                
                const size = Math.random() * 4 + 2;
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                
                particle.style.left = `${e.clientX}px`;
                particle.style.top = `${e.clientY}px`;
                
                const colorIndex = Math.floor(Math.random() * config.stardustOptions.colors.length);
                particle.style.backgroundColor = config.stardustOptions.colors[colorIndex];
                particle.style.boxShadow = `0 0 ${size + 5}px ${config.stardustOptions.colors[colorIndex]}`;
                
                particle.style.opacity = '0.8';
                particle.style.transition = 'all 2s ease-out';
                
                stardustContainer.appendChild(particle);
                
                setTimeout(() => {
                    const dirX = Math.random() * 100 - 50;
                    const dirY = Math.random() * 100 - 50;
                    particle.style.transform = `translate(${dirX}px, ${dirY}px)`;
                    particle.style.opacity = '0';
                }, 10);
                
                setTimeout(() => {
                    particle.remove();
                }, 2000);
            }
        }
    });
});