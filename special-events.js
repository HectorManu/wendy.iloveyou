/* 
 * special-events.js
 * Este archivo contiene las funciones para los eventos especiales como 
 * San Valentín y el Día de las Flores Amarillas.
 * Se incluye como archivo separado para mantener el código principal más ligero.
 */

// Módulo para eventos especiales
const specialEvents = (function() {
    // Configuración para eventos especiales
    const config = {
        valentineDay: {
            month: 1,  // Febrero (0-indexed)
            day: 14
        } else {
            document.body.classList.remove('yellow-flowers-theme');
            
            // Si no se está mostrando otro tema (como San Valentín), restaurar el icono del corazón
            if (!isValentineDay() && document.getElementById('heart-btn').innerHTML.includes('yellow-flower-icon')) {
                document.getElementById('heart-btn').innerHTML = '<i class="fas fa-heart"></i>';
                document.getElementById('heart-btn').classList.remove('pulse');
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
        },
        yellowFlowersDay: {
            month: 2,  // Marzo (0-indexed)
            day: 21
        }
    };

    // Colores para los eventos especiales
    const valentineHeartColors = ['#ff1a5e', '#ff0042', '#ff4775', '#ff6666', '#ff1a5e'];
    const yellowFlowerHeartColors = ['#ffcc00', '#ffd700', '#ffdf7f', '#ffe066', '#ffeb99'];
    
    // Variables para almacenar estado
    let currentColorIndex = 0;

    // Función para verificar si es San Valentín
    function isValentineDay() {
        const today = new Date();
        return today.getMonth() === config.valentineDay.month && 
               today.getDate() === config.valentineDay.day;
    }

    // Función para aplicar tema de San Valentín
    function applyValentineTheme() {
        if (isValentineDay()) {
            document.body.classList.add('valentine-theme');
            document.querySelector('.flowers').classList.add('valentine-flowers');
            document.getElementById('heart-btn').classList.add('pulse');
            
            // Crear corazones cayendo
            createFallingHearts();
        } else {
            document.body.classList.remove('valentine-theme');
            document.querySelector('.flowers').classList.remove('valentine-flowers');
            document.getElementById('heart-btn').classList.remove('pulse');
            
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
        
        // Crear múltiples corazones (reducido para mejor rendimiento)
        for (let i = 0; i < 20; i++) {
            const heart = document.createElement('div');
            heart.className = 'heart';
            
            // Posición aleatoria horizontal
            const leftPos = Math.random() * 100;
            heart.style.left = `${leftPos}%`;
            
            // Tamaño aleatorio
            const size = Math.random() * 10 + 5;
            heart.style.width = `${size}px`;
            heart.style.height = `${size}px`;
            
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
        
        document.body.appendChild(heartsContainer);
    }

    // Función para verificar si es el día de las flores amarillas
    function isYellowFlowersDay() {
        const today = new Date();
        return today.getMonth() === config.yellowFlowersDay.month && 
               today.getDate() === config.yellowFlowersDay.day;
    }

    // Función para aplicar tema de flores amarillas
    function applyYellowFlowersTheme() {
        if (isYellowFlowersDay()) {
            document.body.classList.add('yellow-flowers-theme');
            document.getElementById('heart-btn').classList.add('pulse');
            
            // Cambiar el icono del corazón a una flor amarilla
            document.getElementById('heart-btn').innerHTML = '<span class="yellow-flower-icon">🌻</span>';
            
            // Crear flores amarillas cayendo
            createFallingYellowFlowers();
            
            // Crear corazones especiales flotando
            createFloatingHearts();
            
            // Mostrar mensaje especial
            showYellowFlowersMessage();