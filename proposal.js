/*
 * proposal.js - Funcionalidad para la propuesta "¿Quieres ser mi novia?"
 * Versión reutilizable que permite múltiples celebraciones
 */

// Módulo para la propuesta
const proposalManager = (function() {
    // Referencias a elementos DOM
    let proposalContainer;
    let proposalCard;
    let yesBtn;
    let noBtn;
    let proposalMessage;
    let celebrationActive = false;
    
    // Inicializar módulo
    function init() {
        // Obtener referencias a elementos DOM
        proposalContainer = document.getElementById('proposal-container');
        proposalCard = document.querySelector('.proposal-card');
        yesBtn = document.getElementById('yes-btn');
        noBtn = document.getElementById('no-btn');
        proposalMessage = document.getElementById('proposal-message');
        
        if (!proposalContainer || !proposalCard || !yesBtn || !noBtn || !proposalMessage) {
            console.error('No se pudieron encontrar los elementos necesarios para la propuesta');
            return;
        }
        
        // Configurar la propuesta
        setupProposal();
    }
    
    // Configurar la propuesta con la fecha actual
    function setupProposal() {
        // Obtener la fecha actual para mostrarla en la pregunta
        const today = new Date();
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        const formattedDate = today.toLocaleDateString('es-ES', options);
        
        // Actualizar el título de la propuesta con la fecha actual
        const proposalTitle = document.querySelector('.proposal-card h3');
        if (proposalTitle) {
            proposalTitle.innerHTML = `¿Quieres ser mi novia hoy, ${formattedDate}?`;
        }
        
        // Mostrar la propuesta
        proposalContainer.style.display = 'block';
        
        // IMPORTANTE: Desactivar el efecto hover del recuadro de la propuesta
        proposalCard.classList.add('no-hover');
        
        // Configurar los botones
        setupProposalButtons();
    }
    
    // Configurar los botones de la propuesta
    function setupProposalButtons() {
        let noButtonClicks = 0;
        const maxNoClicks = 100; // Número grande para que nunca desaparezca
        
        // Limpiar eventos previos si los hay
        yesBtn.replaceWith(yesBtn.cloneNode(true));
        noBtn.replaceWith(noBtn.cloneNode(true));
        
        // Obtener las nuevas referencias después de clonar
        yesBtn = document.getElementById('yes-btn');
        noBtn = document.getElementById('no-btn');
        
        // Evento para el botón "SÍ"
        yesBtn.addEventListener('click', function() {
            // Evitar múltiples activaciones simultáneas
            if (celebrationActive) return;
            
            // Marcar celebración como activa
            celebrationActive = true;
            
            // Mostrar mensaje feliz
            proposalMessage.innerHTML = "¡Me haces la persona más feliz del mundo! ❤️";
            proposalMessage.style.fontSize = "1.3rem";
            proposalMessage.style.fontWeight = "bold";
            
            // Cambiar estilos
            yesBtn.style.transform = "scale(1.2)";
            noBtn.style.opacity = "0.5";
            
            // Deshabilitar temporalmente los botones
            yesBtn.disabled = true;
            noBtn.disabled = true;
            
            // Crear efecto de confeti
            createConfetti();
            
            // Crear pantalla de celebración después de un breve retraso
            setTimeout(function() {
                createYesScreen(function() {
                    // Este callback se ejecuta cuando se cierra la pantalla de celebración
                    
                    // Restaurar el estado inicial
                    yesBtn.style.transform = "";
                    noBtn.style.opacity = "1";
                    
                    // Habilitar los botones nuevamente
                    yesBtn.disabled = false;
                    noBtn.disabled = false;
                    
                    // Resetear el mensaje
                    proposalMessage.innerHTML = "";
                    
                    // Marcar celebración como inactiva
                    celebrationActive = false;
                });
            }, 1500);
        });
        
        // Inicializar el botón NO
        noBtn.style.position = "relative";
        noBtn.style.transition = "transform 0.3s ease";
        
        // Evento para el botón "NO" - mouseenter
        noBtn.addEventListener('mouseenter', function(e) {
            if (celebrationActive) return; // No mover durante celebración
            
            moveNoButton(this);
            noButtonClicks++;
            proposalMessage.innerHTML = getNoButtonMessage(noButtonClicks % 5);
        });
        
        // Evento para el botón "NO" - click
        noBtn.addEventListener('click', function(e) {
            if (celebrationActive) return; // No mover durante celebración
            
            moveNoButton(this);
            noButtonClicks++;
            proposalMessage.innerHTML = getNoButtonMessage(noButtonClicks % 5);
        });
        
        // Inicialmente, mueve el botón NO para que esté en una posición aleatoria
        setTimeout(() => moveNoButton(noBtn), 500);
    }
    
    // Función para obtener un mensaje según el número de clics en NO
    function getNoButtonMessage(index) {
        const messages = [
            "¿Estás segura? Inténtalo de nuevo...",
            "Mmm, creo que ese botón no funciona bien",
            "Parece que el destino no quiere que presiones 'NO'",
            "El universo dice que deberías presionar 'SÍ'",
            "¿No te rindes? ¡Me encantas por persistente! 😊"
        ];
        
        return messages[index];
    }
    
    // Función simplificada para mover el botón "NO"
    function moveNoButton(button) {
        // Calculamos 4 posiciones posibles (arriba, abajo, izquierda, derecha)
        const positions = [
            { transform: "translate(100px, -50px)" },  // Derecha arriba
            { transform: "translate(-100px, -50px)" }, // Izquierda arriba
            { transform: "translate(100px, 50px)" },   // Derecha abajo
            { transform: "translate(-100px, 50px)" }   // Izquierda abajo
        ];
        
        // Seleccionamos una posición aleatoria diferente a la actual
        let newPos;
        do {
            newPos = Math.floor(Math.random() * positions.length);
        } while (button.style.transform === positions[newPos].transform);
        
        // Aplicamos la nueva posición
        button.style.transform = positions[newPos].transform;
    }
    
    // Función para crear confeti con letras "W & H" responsivas
    function createConfetti() {
        // Eliminar confeti existente si hay
        const existingConfetti = document.querySelector('.confetti-container');
        if (existingConfetti) {
            existingConfetti.remove();
        }
        
        // Crear contenedor de confeti
        const confettiContainer = document.createElement('div');
        confettiContainer.className = 'confetti-container';
        document.body.appendChild(confettiContainer);
        
        // Colores del confeti
        const colors = ['#ff6b95', '#7e57c2', '#00bcd4', '#ffd700', '#ff4081', '#9575cd'];
        
        // Primera explosión de confeti normal
        createRegularConfetti(40);
        
        // Secuencia de letras
        // Primero vamos a mostrar "W", luego "&", y finalmente "H"
        
        // Mostrar la "W" después de 1 segundo
        setTimeout(() => {
            // Limpiar cualquier letra anterior
            const existingLetters = confettiContainer.querySelectorAll('.letter-container');
            existingLetters.forEach(letter => letter.remove());
            
            // Crear la W
            createLetterW();
        }, 1000);
        
        // Mostrar el "&" después de la "W"
        setTimeout(() => {
            // Limpiar cualquier letra anterior
            const existingLetters = confettiContainer.querySelectorAll('.letter-container');
            existingLetters.forEach(letter => letter.remove());
            
            // Crear el &
            createAmpersand();
        }, 3000);
        
        // Mostrar la "H" después del "&"
        setTimeout(() => {
            // Limpiar cualquier letra anterior
            const existingLetters = confettiContainer.querySelectorAll('.letter-container');
            existingLetters.forEach(letter => letter.remove());
            
            // Crear la H
            createLetterH();
        }, 5000);
        
        // Explosión final de confeti
        setTimeout(() => {
            createRegularConfetti(80);
        }, 6500);
        
        // Función para crear confeti normal (corazones y formas)
        function createRegularConfetti(count) {
            for (let i = 0; i < count; i++) {
                setTimeout(() => {
                    // Decidir si crear un corazón o una forma simple
                    const isHeart = Math.random() > 0.4; // 60% de probabilidad de ser corazón
                    
                    if (isHeart) {
                        // Crear un corazón SVG
                        const heart = document.createElement('div');
                        heart.className = 'confetti-heart';
                        
                        // Tamaño aleatorio
                        const size = Math.random() * 20 + 10;
                        
                        // Color aleatorio
                        const color = colors[Math.floor(Math.random() * colors.length)];
                        
                        // Crear SVG
                        heart.innerHTML = `
                            <svg viewBox="0 0 24 24" width="${size}" height="${size}">
                                <path fill="${color}" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                        `;
                        
                        // Posición inicial aleatoria
                        const posX = Math.random() * window.innerWidth;
                        heart.style.left = `${posX}px`;
                        heart.style.top = '-20px';
                        
                        // Brillo
                        heart.style.filter = `drop-shadow(0 0 8px ${color})`;
                        
                        // Velocidad y rotación aleatoria
                        const duration = Math.random() * 4 + 3;
                        const rotation = Math.random() * 360;
                        
                        // Animación personalizada
                        heart.animate(
                            [
                                { transform: `translateY(0) rotate(${rotation}deg) scale(1)`, opacity: 1 },
                                { transform: `translateY(${window.innerHeight + 100}px) rotate(${rotation + 720}deg) scale(0.5)`, opacity: 0.3 }
                            ],
                            {
                                duration: duration * 1000,
                                easing: 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
                                fill: 'forwards'
                            }
                        );
                        
                        // Añadir al contenedor
                        confettiContainer.appendChild(heart);
                        
                        // Eliminar después de la animación
                        setTimeout(() => {
                            heart.remove();
                        }, duration * 1000);
                        
                    } else {
                        // Crear una forma simple (círculo, cuadrado, etc.)
                        const confetti = document.createElement('div');
                        confetti.className = 'confetti';
                        
                        // Tamaño aleatorio
                        const size = Math.random() * 12 + 8;
                        confetti.style.width = `${size}px`;
                        confetti.style.height = `${size}px`;
                        
                        // Posición inicial aleatoria
                        const posX = Math.random() * window.innerWidth;
                        confetti.style.left = `${posX}px`;
                        confetti.style.top = '-10px';
                        
                        // Color aleatorio
                        const color = colors[Math.floor(Math.random() * colors.length)];
                        confetti.style.backgroundColor = color;
                        confetti.style.boxShadow = `0 0 ${size/2}px ${color}`;
                        
                        // Forma aleatoria
                        const shapes = ['circle', 'square', 'triangle'];
                        const shape = shapes[Math.floor(Math.random() * shapes.length)];
                        
                        if (shape === 'circle') {
                            confetti.style.borderRadius = '50%';
                        } else if (shape === 'triangle') {
                            confetti.style.width = '0';
                            confetti.style.height = '0';
                            confetti.style.backgroundColor = 'transparent';
                            confetti.style.borderLeft = `${size/2}px solid transparent`;
                            confetti.style.borderRight = `${size/2}px solid transparent`;
                            confetti.style.borderBottom = `${size}px solid ${color}`;
                            confetti.style.boxShadow = `0 0 ${size/2}px ${color}`;
                        }
                        
                        // Velocidad y rotación aleatoria
                        const duration = Math.random() * 3 + 2;
                        const rotation = Math.random() * 360;
                        
                        // Animación personalizada
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
                        
                        // Añadir al contenedor
                        confettiContainer.appendChild(confetti);
                        
                        // Eliminar después de la animación
                        setTimeout(() => {
                            confetti.remove();
                        }, duration * 1000);
                    }
                }, Math.random() * 1000); // Dispersar la creación en 1 segundo
            }
        }
        
        // Función para crear la letra "W" responsiva
        function createLetterW() {
            // Crear contenedor para la letra
            const letterContainer = document.createElement('div');
            letterContainer.className = 'letter-container letter-w';
            
            // Posicionar en el centro de la pantalla
            letterContainer.style.position = 'absolute';
            letterContainer.style.left = '50%';
            letterContainer.style.top = '50%';
            letterContainer.style.transform = 'translate(-50%, -50%)';
            letterContainer.style.width = isSmallScreen() ? '60vw' : '300px';
            letterContainer.style.height = isSmallScreen() ? '60vw' : '300px';
            
            // Añadir al contenedor principal
            confettiContainer.appendChild(letterContainer);
            
            // Tamaño de partícula basado en el tamaño de pantalla
            const particleSize = isSmallScreen() ? 6 : 10;
            
            // Color para la W
            const wColor = '#ff6b95';
            
            // Crear partículas para formar la W
            const wPositions = [
                // Primera línea diagonal descendente
                {x: '10%', y: '20%'}, {x: '15%', y: '30%'}, {x: '20%', y: '40%'}, {x: '25%', y: '50%'}, {x: '30%', y: '60%'}, {x: '35%', y: '70%'}, {x: '40%', y: '80%'},
                // Segunda línea diagonal ascendente
                {x: '45%', y: '70%'}, {x: '50%', y: '60%'}, {x: '55%', y: '50%'}, {x: '60%', y: '40%'},
                // Tercera línea diagonal descendente
                {x: '65%', y: '50%'}, {x: '70%', y: '60%'}, {x: '75%', y: '70%'}, {x: '80%', y: '80%'},
                // Cuarta línea diagonal ascendente
                {x: '85%', y: '70%'}, {x: '90%', y: '60%'}, {x: '95%', y: '50%'}, {x: '100%', y: '40%'}
            ];
            
            // Crear partículas con un retraso para efecto de "escritura"
            wPositions.forEach((pos, index) => {
                setTimeout(() => {
                    const particle = createParticle(pos.x, pos.y, particleSize, wColor);
                    letterContainer.appendChild(particle);
                }, index * 50); // Retraso incremental para cada partícula
            });
            
            // Animar la entrada y salida de la letra completa
            letterContainer.animate(
                [
                    { opacity: 0, transform: 'translate(-50%, -50%) scale(0.8)' },
                    { opacity: 1, transform: 'translate(-50%, -50%) scale(1.1)' },
                    { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' }
                ],
                {
                    duration: 800,
                    easing: 'ease-out',
                    fill: 'forwards'
                }
            );
        }
        
        // Función para crear el símbolo "&" responsivo
        function createAmpersand() {
            // Crear contenedor para el símbolo
            const letterContainer = document.createElement('div');
            letterContainer.className = 'letter-container letter-ampersand';
            
            // Posicionar en el centro de la pantalla
            letterContainer.style.position = 'absolute';
            letterContainer.style.left = '50%';
            letterContainer.style.top = '50%';
            letterContainer.style.transform = 'translate(-50%, -50%)';
            letterContainer.style.width = isSmallScreen() ? '60vw' : '300px';
            letterContainer.style.height = isSmallScreen() ? '60vw' : '300px';
            
            // Añadir al contenedor principal
            confettiContainer.appendChild(letterContainer);
            
            // Tamaño de partícula basado en el tamaño de pantalla
            const particleSize = isSmallScreen() ? 6 : 10;
            
            // Color para el &
            const ampColor = '#7e57c2';
            
            // Crear partículas para formar el &
            const ampPositions = [
                // Círculo superior
                {x: '40%', y: '20%'}, {x: '30%', y: '25%'}, {x: '30%', y: '35%'}, {x: '40%', y: '40%'}, {x: '50%', y: '35%'}, {x: '50%', y: '25%'},
                // Línea diagonal
                {x: '45%', y: '45%'}, {x: '50%', y: '50%'}, {x: '55%', y: '55%'}, {x: '60%', y: '60%'}, {x: '65%', y: '65%'}, {x: '70%', y: '70%'},
                // Bucle inferior
                {x: '60%', y: '75%'}, {x: '50%', y: '80%'}, {x: '40%', y: '75%'}, {x: '35%', y: '70%'}, {x: '40%', y: '65%'}, {x: '50%', y: '60%'}, {x: '60%', y: '65%'}
            ];
            
            // Crear partículas con un retraso para efecto de "escritura"
            ampPositions.forEach((pos, index) => {
                setTimeout(() => {
                    const particle = createParticle(pos.x, pos.y, particleSize, ampColor);
                    letterContainer.appendChild(particle);
                }, index * 50); // Retraso incremental para cada partícula
            });
            
            // Animar la entrada y salida de la letra completa
            letterContainer.animate(
                [
                    { opacity: 0, transform: 'translate(-50%, -50%) scale(0.8)' },
                    { opacity: 1, transform: 'translate(-50%, -50%) scale(1.1)' },
                    { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' }
                ],
                {
                    duration: 800,
                    easing: 'ease-out',
                    fill: 'forwards'
                }
            );
        }
        
        // Función para crear la letra "H" responsiva
        function createLetterH() {
            // Crear contenedor para la letra
            const letterContainer = document.createElement('div');
            letterContainer.className = 'letter-container letter-h';
            
            // Posicionar en el centro de la pantalla
            letterContainer.style.position = 'absolute';
            letterContainer.style.left = '50%';
            letterContainer.style.top = '50%';
            letterContainer.style.transform = 'translate(-50%, -50%)';
            letterContainer.style.width = isSmallScreen() ? '60vw' : '300px';
            letterContainer.style.height = isSmallScreen() ? '60vw' : '300px';
            
            // Añadir al contenedor principal
            confettiContainer.appendChild(letterContainer);
            
            // Tamaño de partícula basado en el tamaño de pantalla
            const particleSize = isSmallScreen() ? 6 : 10;
            
            // Color para la H
            const hColor = '#00bcd4';
            
            // Crear partículas para formar la H
            const hPositions = [
                // Línea vertical izquierda
                {x: '20%', y: '20%'}, {x: '20%', y: '30%'}, {x: '20%', y: '40%'}, {x: '20%', y: '50%'}, {x: '20%', y: '60%'}, {x: '20%', y: '70%'}, {x: '20%', y: '80%'},
                // Línea horizontal
                {x: '30%', y: '50%'}, {x: '40%', y: '50%'}, {x: '50%', y: '50%'}, {x: '60%', y: '50%'}, {x: '70%', y: '50%'},
                // Línea vertical derecha
                {x: '80%', y: '20%'}, {x: '80%', y: '30%'}, {x: '80%', y: '40%'}, {x: '80%', y: '50%'}, {x: '80%', y: '60%'}, {x: '80%', y: '70%'}, {x: '80%', y: '80%'}
            ];
            
            // Crear partículas con un retraso para efecto de "escritura"
            hPositions.forEach((pos, index) => {
                setTimeout(() => {
                    const particle = createParticle(pos.x, pos.y, particleSize, hColor);
                    letterContainer.appendChild(particle);
                }, index * 50); // Retraso incremental para cada partícula
            });
            
            // Animar la entrada y salida de la letra completa
            letterContainer.animate(
                [
                    { opacity: 0, transform: 'translate(-50%, -50%) scale(0.8)' },
                    { opacity: 1, transform: 'translate(-50%, -50%) scale(1.1)' },
                    { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' }
                ],
                {
                    duration: 800,
                    easing: 'ease-out',
                    fill: 'forwards'
                }
            );
        }
        
        // Función para crear una partícula
        function createParticle(x, y, size, color) {
            const particle = document.createElement('div');
            particle.className = 'letter-particle';
            
            // Configurar estilos
            particle.style.position = 'absolute';
            particle.style.left = x;
            particle.style.top = y;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.backgroundColor = color;
            particle.style.borderRadius = '50%';
            particle.style.boxShadow = `0 0 ${size}px ${color}`;
            particle.style.transform = 'translate(-50%, -50%)';
            particle.style.opacity = '0';
            
            // Animar la aparición
            particle.animate(
                [
                    { opacity: 0, transform: 'translate(-50%, -50%) scale(0.5)' },
                    { opacity: 1, transform: 'translate(-50%, -50%) scale(1.5)' },
                    { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' }
                ],
                {
                    duration: 300,
                    easing: 'ease-out',
                    fill: 'forwards'
                }
            );
            
            // Añadir animación de pulso
            particle.style.animation = 'pulse-letter 1.5s infinite ease-in-out';
            
            return particle;
        }
        
        // Función auxiliar para detectar pantallas pequeñas
        function isSmallScreen() {
            return window.innerWidth < 768;
        }
        
        // Eliminar el contenedor después de un tiempo
        setTimeout(() => {
            // Función de eliminación suave
            const fadeOut = () => {
                confettiContainer.style.transition = 'opacity 1s ease';
                confettiContainer.style.opacity = '0';
                setTimeout(() => {
                    confettiContainer.remove();
                }, 1000);
            };
            
            // Eliminar después de 10 segundos
            setTimeout(fadeOut, 10000);
        }, 1000);
    }
    
    // Crear pantalla de celebración
    function createYesScreen(onCloseCallback) {
        // Verificar si ya existe
        let yesScreen = document.querySelector('.yes-screen');
        if (yesScreen) {
            yesScreen.remove();
        }
        
        // Obtener la fecha actual para mostrarla en el mensaje
        const today = new Date();
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        const formattedDate = today.toLocaleDateString('es-ES', options);
        
        // Crear pantalla
        yesScreen = document.createElement('div');
        yesScreen.className = 'yes-screen';
        
        // Contenido
        yesScreen.innerHTML = `
            <h2>¡Somos Novios!</h2>
            <p>Hoy, ${formattedDate}, comienza una nueva etapa en nuestra historia juntos.</p>
            <div class="big-heart">
                <i class="fas fa-heart"></i>
            </div>
            <p>Checa Whats App, te tengo un stiker que te va a gustar. jijiji</p>
            <p>TE AMO ❤️</p>
            <p class="close-hint">Toca en cualquier lugar para continuar...</p>
        `;
        
        // Añadir al cuerpo
        document.body.appendChild(yesScreen);
        
        // Mostrar con animación
        setTimeout(function() {
            yesScreen.classList.add('show');
        }, 100);
        
        // Evento para cerrar al hacer clic
        yesScreen.addEventListener('click', function() {
            yesScreen.style.opacity = '0';
            setTimeout(function() {
                yesScreen.remove();
                // Ejecutar callback después de cerrar
                if (typeof onCloseCallback === 'function') {
                    onCloseCallback();
                }
            }, 500);
        });
    }
    
    // Exponer funciones públicas
    return {
        init: init
    };
})();

// Exponer el módulo globalmente
window.proposalManager = proposalManager;