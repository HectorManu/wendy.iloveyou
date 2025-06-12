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

// Evento mejorado para el botón de corazón con GSAP
heartBtn.addEventListener('click', () => {
    currentColorIndex = (currentColorIndex + 1) % heartColors.length;
    const newColor = heartColors[currentColorIndex];
    
    // Usar animación GSAP si está disponible
    if (window.GSAPAnimations) {
        window.GSAPAnimations.animateHeartColorChange(heartBtn, newColor);
    } else {
        // Fallback para animación básica
        heartBtn.style.color = newColor;
    }
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

// Función para manejar el carrusel con animación GSAP mejorada
function moveCarousel(direction) {
    if (!photosData.length) return;
    
    currentSlide = (currentSlide + direction + photosData.length) % photosData.length;
    
    // Usar GSAP si está disponible para una animación más suave
    if (window.gsap) {
        gsap.to(carouselInner, {
            duration: 0.6,
            x: -currentSlide * 100 + '%',
            ease: "power2.out"
        });
    } else {
        // Fallback CSS
        carouselInner.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
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

// Crear una partícula de stardust con animación GSAP mejorada
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
        particle.style.backgroundColor = 'transparent';
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
    
    // Animación mejorada con GSAP si está disponible
    if (window.gsap) {
        gsap.set(particle, { opacity: 0, scale: 0 });
        
        const tl = gsap.timeline({ repeat: -1 });
        tl.to(particle, {
            opacity: Math.random() * 0.8 + 0.2,
            scale: Math.random() * 0.5 + 0.5,
            duration: Math.random() * 2 + 1,
            ease: "power2.out"
        })
        .to(particle, {
            opacity: Math.random() * 0.3 + 0.1,
            scale: Math.random() * 0.3 + 0.2,
            duration: Math.random() * 2 + 1,
            ease: "power2.inOut"
        });
        
        // Movimiento flotante
        gsap.to(particle, {
            x: `+=${Math.random() * 100 - 50}`,
            y: `+=${Math.random() * 100 - 50}`,
            duration: Math.random() * 20 + 10,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    } else {
        // Fallback CSS
        const duration = Math.random() * 5 + 3; // 3-8s
        particle.style.animation = `twinkle ${duration}s infinite ease-in-out`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
    }
    
    // Añadir al contenedor
    container.appendChild(particle);
}

// Función mejorada para crear confeti con GSAP
function createEnhancedConfetti() {
    // Usar la función GSAP si está disponible
    if (window.GSAPAnimations && window.GSAPAnimations.createGSAPConfetti) {
        window.GSAPAnimations.createGSAPConfetti();
        return;
    }
    
    // Fallback al confeti original
    createOriginalConfetti();
}

// Función de confeti original como fallback
function createOriginalConfetti() {
    const colors = ['#ff6b95', '#7e57c2', '#00bcd4', '#ff4081', '#9575cd'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            const size = Math.random() * 12 + 8;
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;
            
            const posX = Math.random() * window.innerWidth;
            confetti.style.left = `${posX}px`;
            confetti.style.top = '-10px';
            
            const color = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.backgroundColor = color;
            confetti.style.boxShadow = `0 0 ${size/2}px ${color}`;
            
            confetti.style.borderRadius = '50%';
            confetti.style.position = 'fixed';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '1000';
            
            document.body.appendChild(confetti);
            
            const duration = Math.random() * 3 + 2;
            const rotation = Math.random() * 360;
            
            if (window.gsap) {
                gsap.to(confetti, {
                    y: window.innerHeight + 100,
                    rotation: rotation + 720,
                    duration: duration,
                    ease: "power2.in",
                    onComplete: () => confetti.remove()
                });
            } else {
                // Fallback CSS
                confetti.animate(
                    [
                        { transform: `translateY(0) rotate(${rotation}deg)`, opacity: 1 },
                        { transform: `translateY(${window.innerHeight + 100}px) rotate(${rotation + 720}deg)`, opacity: 0.3 }
                    ],
                    {
                        duration: duration * 1000,
                        easing: 'linear',
                        fill: 'forwards'
                    }
                );
                
                setTimeout(() => confetti.remove(), duration * 1000);
            }
        }, Math.random() * 1000);
    }
}

// Inicialización mejorada
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
    
    // Añadir interacción mejorada para el movimiento de partículas con el mouse
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
                const color = config.stardustOptions.colors[colorIndex];
                particle.style.backgroundColor = color;
                particle.style.boxShadow = `0 0 ${size + 5}px ${color}`;
                
                stardustContainer.appendChild(particle);
                
                if (window.gsap) {
                    gsap.set(particle, { scale: 0, opacity: 0.8 });
                    
                    const tl = gsap.timeline({
                        onComplete: () => particle.remove()
                    });
                    
                    tl.to(particle, {
                        scale: 1,
                        duration: 0.2,
                        ease: "back.out(1.7)"
                    })
                    .to(particle, {
                        x: (Math.random() - 0.5) * 100,
                        y: (Math.random() - 0.5) * 100,
                        scale: 0,
                        opacity: 0,
                        duration: 2,
                        ease: "power2.out"
                    });
                } else {
                    // Fallback CSS
                    particle.style.opacity = '0.8';
                    particle.style.transition = 'all 2s ease-out';
                    
                    setTimeout(() => {
                        const dirX = Math.random() * 100 - 50;
                        const dirY = Math.random() * 100 - 50;
                        particle.style.transform = `translate(${dirX}px, ${dirY}px)`;
                        particle.style.opacity = '0';
                    }, 10);
                    
                    setTimeout(() => particle.remove(), 2000);
                }
            }
        }
    });
    
    console.log('✨ Script principal cargado con mejoras GSAP!');
});