// Configuración
const config = {
    startDate: '2024-11-24T00:00:00',
    photoBasePath: '/img/',
    photosJsonUrl: 'photos.json',
    valentineDay: {
        month: 1,  // Febrero (0-indexed)
        day: 14
    }
};

// Estado de la aplicación
let photosData = [];
let currentSlide = 0;
let heartColors = ['#ff69b4', '#da70d6', '#9370db', '#ff1493', '#ff69b4'];
let valentineHeartColors = ['#ff1a5e', '#ff0042', '#ff4775', '#ff6666', '#ff1a5e'];
let currentColorIndex = 0;

// Elementos del DOM
const carouselInner = document.getElementById('carousel-inner');
const heartBtn = document.getElementById('heart-btn');
const body = document.body;
const flowers = document.querySelector('.flowers');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

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

// Evento para el botón de corazón
heartBtn.addEventListener('click', () => {
    const colorsArray = isValentineDay() ? valentineHeartColors : heartColors;
    currentColorIndex = (currentColorIndex + 1) % colorsArray.length;
    heartBtn.style.color = colorsArray[currentColorIndex];
});

// Función para verificar si es San Valentín
function isValentineDay() {
    const today = new Date();
    return today.getMonth() === config.valentineDay.month && 
           today.getDate() === config.valentineDay.day;
}

// Función para aplicar tema de San Valentín
function applyValentineTheme() {
    if (isValentineDay()) {
        body.classList.add('valentine-theme');
        flowers.classList.add('valentine-flowers');
        heartBtn.classList.add('pulse');
        
        // Crear corazones cayendo
        createFallingHearts();
    } else {
        body.classList.remove('valentine-theme');
        flowers.classList.remove('valentine-flowers');
        heartBtn.classList.remove('pulse');
        
        // Remover corazones si existen
        const fallingHearts = document.querySelector('.falling-hearts');
        if (fallingHearts) {
            fallingHearts.remove();
        }
    }
}

// Crear corazones animados para San Valentín
function createFallingHearts() {
    // Remover corazones existentes si hay
    const existingHearts = document.querySelector('.falling-hearts');
    if (existingHearts) {
        existingHearts.remove();
    }
    
    const heartsContainer = document.createElement('div');
    heartsContainer.className = 'falling-hearts';
    
    // Crear múltiples corazones
    for (let i = 0; i < 30; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        
        // Posición aleatoria horizontal
        const leftPos = Math.random() * 100;
        heart.style.left = `${leftPos}%`;
        
        // Tamaño aleatorio
        const size = Math.random() * 10 + 5;
        heart.style.width = `${size}px`;
        heart.style.height = `${size}px`;
        
        // Ajustar los pseudoelementos al tamaño
        heart.style.setProperty('--heart-size', `${size}px`);
        
        // Velocidad aleatoria
        const duration = Math.random() * 10 + 10;
        heart.style.animationDuration = `${duration}s`;
        
        // Retraso aleatorio
        const delay = Math.random() * 10;
        heart.style.animationDelay = `${delay}s`;
        
        // Posición inicial aleatoria
        heart.style.top = `${-size}px`;
        
        heartsContainer.appendChild(heart);
    }
    
    body.appendChild(heartsContainer);
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

// Inicialización
window.addEventListener('DOMContentLoaded', () => {
    loadPhotosData();
    updateCounter();
    setInterval(updateCounter, 1000);
    
    // Aplicar tema de San Valentín si es necesario
    applyValentineTheme();
    
    // Verificar San Valentín a medianoche
    function checkValentineAtMidnight() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 10, 0); // 10 segundos después de medianoche
        
        const timeUntilMidnight = tomorrow - now;
        
        setTimeout(() => {
            applyValentineTheme();
            // Configurar el próximo chequeo
            checkValentineAtMidnight();
        }, timeUntilMidnight);
    }
    
    checkValentineAtMidnight();
});

// Manejar cambio de orientación
window.addEventListener('orientationchange', () => {
    setTimeout(updateCounter, 100);
});