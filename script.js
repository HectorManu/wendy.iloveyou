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

// Añadir esto al archivo script.js existente

// Configuración para el día de las flores amarillas
const yellowFlowersConfig = {
    month: 2,  // Marzo (0-indexed)
    day: 21
};

// Colores para el día de las flores amarillas
let yellowFlowerHeartColors = ['#ffcc00', '#ffd700', '#ffdf7f', '#ffe066', '#ffeb99'];

// Función para verificar si es el día de las flores amarillas (21 de marzo)
function isYellowFlowersDay() {
    const today = new Date();
    return today.getMonth() === yellowFlowersConfig.month && 
           today.getDate() === yellowFlowersConfig.day;
}

// Función para aplicar tema de flores amarillas
function applyYellowFlowersTheme() {
    if (isYellowFlowersDay()) {
        body.classList.add('yellow-flowers-theme');
        heartBtn.classList.add('pulse');
        
        // Cambiar el icono del corazón a una flor amarilla
        heartBtn.innerHTML = '<span class="yellow-flower-icon">🌻</span>';
        
        // Crear flores amarillas cayendo
        createFallingYellowFlowers();
        
        // Crear corazones especiales flotando
        createFloatingHearts();
        
        // Mostrar mensaje especial
        showYellowFlowersMessage();
    } else {
        body.classList.remove('yellow-flowers-theme');
        
        // Si no se está mostrando otro tema (como San Valentín), restaurar el icono del corazón
        if (!isValentineDay() && heartBtn.innerHTML.includes('yellow-flower-icon')) {
            heartBtn.innerHTML = '<i class="fas fa-heart"></i>';
            heartBtn.classList.remove('pulse');
        }
        
        // Remover flores si existen
        const fallingFlowers = document.querySelector('.falling-flowers');
        if (fallingFlowers) {
            fallingFlowers.remove();
        }
        
        // Remover corazones especiales si existen
        const specialHearts = document.querySelectorAll('.special-heart');
        specialHearts.forEach(heart => heart.remove());
        
        // Remover mensaje especial si existe
        const specialMessage = document.querySelector('.yellow-flowers-message');
        if (specialMessage) {
            specialMessage.remove();
        }
    }
}

// Crear flores amarillas animadas
function createFallingYellowFlowers() {
    // Remover flores existentes si hay
    const existingFlowers = document.querySelector('.falling-flowers');
    if (existingFlowers) {
        existingFlowers.remove();
    }
    
    const flowersContainer = document.createElement('div');
    flowersContainer.className = 'falling-flowers';
    
    // Crear múltiples flores
    for (let i = 0; i < 35; i++) {
        const flower = document.createElement('div');
        flower.className = 'flower';
        
        // Agregar pétalos
        for (let j = 0; j < 6; j++) {
            const petal = document.createElement('div');
            petal.className = 'petal';
            flower.appendChild(petal);
        }
        
        // Posición aleatoria horizontal
        const leftPos = Math.random() * 100;
        flower.style.left = `${leftPos}%`;
        
        // Tamaño aleatorio
        const size = Math.random() * 15 + 10;
        flower.style.width = `${size}px`;
        flower.style.height = `${size}px`;
        
        // Velocidad aleatoria (más lento que los corazones para que parezcan más livianas)
        const duration = Math.random() * 15 + 12;
        flower.style.animationDuration = `${duration}s`;
        
        // Retraso aleatorio
        const delay = Math.random() * 40;
        flower.style.animationDelay = `${delay}s`;
        
        flowersContainer.appendChild(flower);
    }
    
    body.appendChild(flowersContainer);
}

// Crear corazones especiales flotando
function createFloatingHearts() {
    // Crear corazones que flotan en diferentes posiciones
    for (let i = 0; i < 15; i++) {
        const heart = document.createElement('div');
        heart.className = 'special-heart';
        
        // Corazón SVG
        heart.innerHTML = `<svg width="${Math.random() * 25 + 15}" height="${Math.random() * 25 + 15}" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>`;
        
        // Posición aleatoria
        const leftPos = Math.random() * 90 + 5; // 5-95%
        const topPos = Math.random() * 90 + 5; // 5-95%
        heart.style.left = `${leftPos}%`;
        heart.style.top = `${topPos}%`;
        
        // Animación con duración aleatoria
        const duration = Math.random() * 6 + 4;
        heart.style.animationDuration = `${duration}s`;
        
        // Retraso aleatorio
        const delay = Math.random() * 2;
        heart.style.animationDelay = `${delay}s`;
        
        body.appendChild(heart);
    }
}

// Mostrar mensaje especial para el día de las flores amarillas
function showYellowFlowersMessage() {
    const existingMessage = document.querySelector('.yellow-flowers-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageContainer = document.createElement('div');
    messageContainer.className = 'counter-container yellow-flowers-message';
    messageContainer.style.marginTop = '2rem';
    
    messageContainer.innerHTML = `
        <h2>¡Día de las Flores Amarillas!</h2>
        <div class="counter" style="font-size: 1.1rem; margin: 1rem 0;">
            Hoy te regalo un campo de flores amarillas virtual, para celebrar nuestro amor 
            de una manera especial. Estas flores nunca se marchitarán, justo como mi amor por ti. ❤️🌻
        </div>
    `;
    
    // Insertar después del contador principal
    const counterContainer = document.querySelector('.counter-container');
    counterContainer.parentNode.insertBefore(messageContainer, counterContainer.nextSibling);
}

// Evento para el botón de corazón en el tema de flores amarillas
heartBtn.addEventListener('click', () => {
    if (isYellowFlowersDay()) {
        currentColorIndex = (currentColorIndex + 1) % yellowFlowerHeartColors.length;
        heartBtn.style.color = yellowFlowerHeartColors[currentColorIndex];
        
        // Crear efecto de explosión de flores amarillas
        createFlowerExplosion();
    } else if (isValentineDay()) {
        const colorsArray = valentineHeartColors;
        currentColorIndex = (currentColorIndex + 1) % colorsArray.length;
        heartBtn.style.color = colorsArray[currentColorIndex];
    } else {
        const colorsArray = heartColors;
        currentColorIndex = (currentColorIndex + 1) % colorsArray.length;
        heartBtn.style.color = colorsArray[currentColorIndex];
    }
});

// Crear efecto de explosión de flores amarillas al hacer clic en el botón
function createFlowerExplosion() {
    const explosionContainer = document.createElement('div');
    explosionContainer.style.position = 'fixed';
    explosionContainer.style.left = '50%';
    explosionContainer.style.top = '50%';
    explosionContainer.style.transform = 'translate(-50%, -50%)';
    explosionContainer.style.zIndex = '100';
    explosionContainer.style.pointerEvents = 'none';
    
    // Crear múltiples partículas para la explosión
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        
        // Estilo de la partícula
        particle.style.position = 'absolute';
        particle.style.width = '10px';
        particle.style.height = '10px';
        particle.style.backgroundColor = yellowFlowerHeartColors[Math.floor(Math.random() * yellowFlowerHeartColors.length)];
        particle.style.borderRadius = '50%';
        
        // Posición inicial en el centro
        particle.style.left = '0px';
        particle.style.top = '0px';
        
        // Animación
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 150 + 50;
        const duration = Math.random() * 1 + 0.5;
        
        // Calcular la posición final
        const endX = Math.cos(angle) * distance;
        const endY = Math.sin(angle) * distance;
        
        // Configurar la animación
        particle.animate(
            [
                { transform: 'translate(0, 0) scale(0.5)', opacity: 1 },
                { transform: `translate(${endX}px, ${endY}px) scale(${Math.random() * 0.5 + 0.5})`, opacity: 0 }
            ],
            {
                duration: duration * 1000,
                easing: 'cubic-bezier(0,.9,.57,1)'
            }
        );
        
        explosionContainer.appendChild(particle);
    }
    
    body.appendChild(explosionContainer);
    
    // Eliminar el contenedor después de la animación
    setTimeout(() => {
        explosionContainer.remove();
    }, 2000);
}

// Modificar la función de inicialización para incluir la verificación del día de las flores amarillas
window.addEventListener('DOMContentLoaded', () => {
    loadPhotosData();
    updateCounter();
    setInterval(updateCounter, 1000);
    
    // Aplicar temas especiales si es necesario
    if (isYellowFlowersDay()) {
        applyYellowFlowersTheme();
    } else if (isValentineDay()) {
        applyValentineTheme();
    }
    
    // Verificar fechas especiales a medianoche
    function checkSpecialDaysAtMidnight() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 10, 0); // 10 segundos después de medianoche
        
        const timeUntilMidnight = tomorrow - now;
        
        setTimeout(() => {
            // Comprobar ambos días especiales
            if (isYellowFlowersDay()) {
                applyYellowFlowersTheme();
            } else if (isValentineDay()) {
                applyValentineTheme();
            } else {
                // Remover ambos temas si no es ninguna fecha especial
                body.classList.remove('yellow-flowers-theme');
                body.classList.remove('valentine-theme');
                
                // Restaurar el icono del corazón
                heartBtn.innerHTML = '<i class="fas fa-heart"></i>';
                heartBtn.classList.remove('pulse');
            }
            
            // Configurar el próximo chequeo
            checkSpecialDaysAtMidnight();
        }, timeUntilMidnight);
    }
    
    checkSpecialDaysAtMidnight();
});

// Función para crear el ramo de flores amarillas
function createYellowFlowersBouquet() {
    // Crear el contenedor principal
    const bouquetContainer = document.createElement('div');
    bouquetContainer.className = 'bouquet-container';
    
    // Crear el wrapper del ramo
    const bouquetWrapper = document.createElement('div');
    bouquetWrapper.className = 'bouquet-wrapper';
    
    // Crear el ramo
    const bouquet = document.createElement('div');
    bouquet.className = 'bouquet';
    
    // Añadir tallo
    const stem = document.createElement('div');
    stem.className = 'stem';
    bouquet.appendChild(stem);
    
    // Añadir hojas
    for (let i = 0; i < 2; i++) {
        const leaf = document.createElement('div');
        leaf.className = 'leaf';
        bouquet.appendChild(leaf);
    }
    
    // Añadir cinta
    const ribbon = document.createElement('div');
    ribbon.className = 'ribbon';
    bouquet.appendChild(ribbon);
    
    // Añadir flores (8 flores)
    for (let i = 0; i < 8; i++) {
        const flower = document.createElement('div');
        flower.className = 'flower';
        
        // Añadir centro de la flor
        const flowerCenter = document.createElement('div');
        flowerCenter.className = 'flower-center';
        flower.appendChild(flowerCenter);
        
        // Añadir pétalos (8 pétalos por flor)
        for (let j = 0; j < 8; j++) {
            const petal = document.createElement('div');
            petal.className = 'petal';
            
            // Posicionar pétalos en círculo
            const angle = (j / 8) * Math.PI * 2;
            const distance = 30; // Aumentar la distancia de los pétalos desde el centro
            petal.style.transform = `translate(-50%, -50%) rotate(${angle}rad) translate(${distance}px, 0)`;
            
            // Animar pétalos con retraso basado en posición
            petal.style.animation = `petalWave 3s infinite ${j * 0.2}s`;
            
            // Variaciones sutiles de color para los pétalos
            const yellowHue = 50 + Math.floor(Math.random() * 10);
            const saturation = 90 + Math.floor(Math.random() * 10);
            petal.style.backgroundColor = `hsl(${yellowHue}, ${saturation}%, 55%)`;
            
            flower.appendChild(petal);
        }
        
        // Animación de brillo para las flores
        flower.style.animation = `flowerGlow 2s infinite ${i * 0.3}s`;
        
        bouquet.appendChild(flower);
    }
    
    // Añadir mensaje
    const message = document.createElement('div');
    message.className = 'bouquet-message';
    message.textContent = '¡Un ramo de flores amarillas para ti mi vida de mi vida! ❤️';
    
    // Añadir botón para cerrar
    const closeButton = document.createElement('div');
    closeButton.className = 'bouquet-close';
    closeButton.innerHTML = '✕';
    closeButton.addEventListener('click', () => {
        bouquetContainer.classList.remove('show');
        setTimeout(() => {
            bouquetContainer.remove();
        }, 500);
    });
    
    // Construir la estructura completa
    bouquetWrapper.appendChild(bouquet);
    bouquetWrapper.appendChild(message);
    bouquetContainer.appendChild(bouquetWrapper);
    bouquetContainer.appendChild(closeButton);
    
    // Añadir al body
    document.body.appendChild(bouquetContainer);
    
    // Mostrar con pequeño retraso para que la animación sea visible
    setTimeout(() => {
        bouquetContainer.classList.add('show');
    }, 100);
}

// Modificar la función que verifica si es el día de las flores amarillas
function showYellowFlowersContentOnLoad() {
    if (isYellowFlowersDay()) {
        // Pequeño retraso para asegurar que la página esté cargada
        setTimeout(() => {
            createYellowFlowersBouquet();
        }, 1000);
    }
}

// Añadir esta función a la carga inicial (agregar al final del DOMContentLoaded existente)
window.addEventListener('DOMContentLoaded', () => {
    // Mantener el código existente...
    loadPhotosData();
    updateCounter();
    setInterval(updateCounter, 1000);
    
    // Aplicar temas especiales si es necesario
    if (isYellowFlowersDay()) {
        applyYellowFlowersTheme();
        showYellowFlowersContentOnLoad(); // Añadir esta línea
    } else if (isValentineDay()) {
        applyValentineTheme();
    }
    
    // Resto del código existente...
});

// Para pruebas (eliminar en producción)
// Descomentar para forzar que aparezca el ramo sin importar la fecha
// setTimeout(() => {
//     createYellowFlowersBouquet();
// }, 1000);
