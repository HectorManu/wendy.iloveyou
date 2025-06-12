/*
 * proposal.js - Funcionalidad para la propuesta "¿Quieres ser mi novia?"
 * Versión reutilizable que permite múltiples celebraciones
 * Mejorado con animaciones GSAP
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
        
        console.log('💖 Proposal Manager initialized with GSAP enhancements!');
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
        
        // Mostrar la propuesta con animación GSAP si está disponible
        if (window.gsap) {
            gsap.set(proposalContainer, { display: 'block', opacity: 0 });
            gsap.to(proposalContainer, {
                opacity: 1,
                duration: 0.5,
                ease: "power2.out"
            });
        } else {
            proposalContainer.style.display = 'block';
        }
        
        // IMPORTANTE: Desactivar el efecto hover del recuadro de la propuesta
        proposalCard.classList.add('no-hover');
        
        // Configurar los botones
        setupProposalButtons();
        
        // Animar la propuesta si GSAP está disponible
        if (window.GSAPAnimations && window.GSAPAnimations.animateProposal) {
            setTimeout(() => {
                window.GSAPAnimations.animateProposal();
            }, 500);
        }
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
            
            // Mostrar mensaje feliz con animación
            showMessage("¡Me haces la persona más feliz del mundo! ❤️", 'success');
            
            // Animar botón SÍ con GSAP si está disponible
            if (window.gsap) {
                gsap.to(yesBtn, {
                    scale: 1.3,
                    duration: 0.3,
                    ease: "back.out(1.7)",
                    yoyo: true,
                    repeat: 1
                });
                
                gsap.to(noBtn, {
                    opacity: 0.5,
                    duration: 0.3,
                    ease: "power2.out"
                });
            } else {
                // Fallback CSS
                yesBtn.style.transform = "scale(1.2)";
                noBtn.style.opacity = "0.5";
            }
            
            // Deshabilitar temporalmente los botones
            yesBtn.disabled = true;
            noBtn.disabled = true;
            
            // Crear efecto de confeti mejorado
            createEnhancedConfetti();
            
            // Crear pantalla de celebración después de un breve retraso
            setTimeout(function() {
                createYesScreen(function() {
                    // Este callback se ejecuta cuando se cierra la pantalla de celebración
                    resetProposalState();
                });
            }, 1500);
        });
        
        // Inicializar el botón NO con GSAP si está disponible
        if (window.gsap) {
            gsap.set(noBtn, { 
                position: "relative",
                x: 0,
                y: 0
            });
        } else {
            noBtn.style.position = "relative";
            noBtn.style.transition = "transform 0.3s ease";
        }
        
        // Evento para el botón "NO" - mouseenter
        noBtn.addEventListener('mouseenter', function(e) {
            if (celebrationActive) return; // No mover durante celebración
            
            moveNoButtonGSAP(this);
            noButtonClicks++;
            showMessage(getNoButtonMessage(noButtonClicks % 5), 'playful');
        });
        
        // Evento para el botón "NO" - click
        noBtn.addEventListener('click', function(e) {
            if (celebrationActive) return; // No mover durante celebración
            
            moveNoButtonGSAP(this);
            noButtonClicks++;
            showMessage(getNoButtonMessage(noButtonClicks % 5), 'playful');
        });
        
        // Inicialmente, mueve el botón NO para que esté en una posición aleatoria
        setTimeout(() => moveNoButtonGSAP(noBtn), 500);
    }
    
    // Función para mostrar mensajes con animación
    function showMessage(text, type = 'normal') {
        proposalMessage.innerHTML = text;
        
        if (window.gsap) {
            gsap.fromTo(proposalMessage, 
                { 
                    opacity: 0, 
                    y: 20,
                    scale: 0.9
                },
                { 
                    opacity: 1, 
                    y: 0,
                    scale: 1,
                    duration: 0.5,
                    ease: "back.out(1.7)"
                }
            );
            
            // Efecto especial para mensajes de éxito
            if (type === 'success') {
                gsap.to(proposalMessage, {
                    fontSize: "1.3rem",
                    fontWeight: "bold",
                    color: "#ff6b95",
                    duration: 0.3,
                    ease: "power2.out"
                });
            } else if (type === 'playful') {
                // Efecto de rebote para mensajes juguetones
                gsap.fromTo(proposalMessage,
                    { scale: 0.8 },
                    { 
                        scale: 1.1,
                        duration: 0.2,
                        ease: "back.out(1.7)",
                        yoyo: true,
                        repeat: 1
                    }
                );
            }
        } else {
            // Fallback CSS
            proposalMessage.style.opacity = '1';
            if (type === 'success') {
                proposalMessage.style.fontSize = "1.3rem";
                proposalMessage.style.fontWeight = "bold";
            }
        }
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
    
    // Función mejorada para mover el botón "NO" con GSAP
    function moveNoButtonGSAP(button) {
        // Calculamos 4 posiciones posibles (arriba, abajo, izquierda, derecha)
        const positions = [
            { x: 100, y: -50 },  // Derecha arriba
            { x: -100, y: -50 }, // Izquierda arriba
            { x: 100, y: 50 },   // Derecha abajo
            { x: -100, y: 50 }   // Izquierda abajo
        ];
        
        // Seleccionamos una posición aleatoria
        const newPos = positions[Math.floor(Math.random() * positions.length)];
        
        if (window.gsap) {
            // Animación con GSAP más suave y divertida
            gsap.to(button, {
                x: newPos.x,
                y: newPos.y,
                duration: 0.4,
                ease: "back.out(1.7)",
                onStart: () => {
                    // Efecto de "escape" del botón
                    gsap.to(button, {
                        scale: 0.9,
                        duration: 0.1,
                        yoyo: true,
                        repeat: 1,
                        ease: "power2.inOut"
                    });
                }
            });
            
            // Efecto de partículas cuando el botón se mueve
            createButtonEscapeParticles(button);
        } else {
            // Fallback CSS
            button.style.transform = `translate(${newPos.x}px, ${newPos.y}px)`;
        }
    }
    
    // Crear partículas cuando el botón NO "escapa"
    function createButtonEscapeParticles(button) {
        if (!window.gsap) return;
        
        const rect = button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.innerHTML = '💨';
            particle.style.position = 'fixed';
            particle.style.fontSize = '16px';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '1000';
            
            gsap.set(particle, {
                x: centerX,
                y: centerY,
                opacity: 0.8
            });
            
            document.body.appendChild(particle);
            
            const angle = (360 / 5) * i;
            const distance = 30;
            const endX = centerX + Math.cos(angle * Math.PI / 180) * distance;
            const endY = centerY + Math.sin(angle * Math.PI / 180) * distance;
            
            gsap.to(particle, {
                x: endX,
                y: endY,
                opacity: 0,
                scale: 0.5,
                duration: 0.8,
                ease: "power2.out",
                onComplete: () => particle.remove()
            });
        }
    }
    
    // Función para crear confeti mejorado
    function createEnhancedConfetti() {
        // Usar la función GSAP si está disponible
        if (window.GSAPAnimations && window.GSAPAnimations.createGSAPConfetti) {
            window.GSAPAnimations.createGSAPConfetti();
        } else if (window.createEnhancedConfetti) {
            window.createEnhancedConfetti();
        } else {
            // Fallback básico
            createBasicConfetti();
        }
    }
    
    // Confeti básico como último recurso
    function createBasicConfetti() {
        const colors = ['#ff6b95', '#7e57c2', '#00bcd4', '#ff4081', '#9575cd'];
        
        for (let i = 0; i < 40; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.position = 'fixed';
                confetti.style.width = '10px';
                confetti.style.height = '10px';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.borderRadius = '50%';
                confetti.style.left = Math.random() * window.innerWidth + 'px';
                confetti.style.top = '-10px';
                confetti.style.pointerEvents = 'none';
                confetti.style.zIndex = '1000';
                
                document.body.appendChild(confetti);
                
                if (window.gsap) {
                    gsap.to(confetti, {
                        y: window.innerHeight + 20,
                        rotation: Math.random() * 720,
                        duration: Math.random() * 3 + 2,
                        ease: "power2.in",
                        onComplete: () => confetti.remove()
                    });
                } else {
                    setTimeout(() => confetti.remove(), 3000);
                }
            }, Math.random() * 1000);
        }
    }
    
    // Función para crear letras animadas (W & H)
    function createAnimatedLetters() {
        // Esta función mantiene la funcionalidad original pero con mejoras GSAP
        if (!window.gsap) {
            // Usar la implementación original si GSAP no está disponible
            createConfetti();
            return;
        }
        
        // Crear contenedor de letras
        const lettersContainer = document.createElement('div');
        lettersContainer.className = 'letters-container';
        lettersContainer.style.position = 'fixed';
        lettersContainer.style.top = '0';
        lettersContainer.style.left = '0';
        lettersContainer.style.width = '100%';
        lettersContainer.style.height = '100%';
        lettersContainer.style.pointerEvents = 'none';
        lettersContainer.style.zIndex = '999';
        
        document.body.appendChild(lettersContainer);
        
        // Secuencia de letras W, &, H
        const letters = ['W', '&', 'H'];
        const colors = ['#ff6b95', '#7e57c2', '#00bcd4'];
        
        letters.forEach((letter, index) => {
            setTimeout(() => {
                createAnimatedLetter(lettersContainer, letter, colors[index]);
            }, index * 2000);
        });
        
        // Eliminar contenedor después de la secuencia
        setTimeout(() => {
            gsap.to(lettersContainer, {
                opacity: 0,
                duration: 1,
                onComplete: () => lettersContainer.remove()
            });
        }, 8000);
    }
    
    // Crear una letra animada
    function createAnimatedLetter(container, letter, color) {
        const letterElement = document.createElement('div');
        letterElement.style.position = 'absolute';
        letterElement.style.left = '50%';
        letterElement.style.top = '50%';
        letterElement.style.transform = 'translate(-50%, -50%)';
        letterElement.style.fontSize = window.innerWidth < 768 ? '8rem' : '12rem';
        letterElement.style.fontWeight = 'bold';
        letterElement.style.color = color;
        letterElement.style.textShadow = `0 0 30px ${color}`;
        letterElement.textContent = letter;
        
        container.appendChild(letterElement);
        
        // Animación de entrada
        const tl = gsap.timeline();
        tl.fromTo(letterElement,
            { 
                scale: 0,
                rotation: -180,
                opacity: 0
            },
            {
                scale: 1.2,
                rotation: 0,
                opacity: 1,
                duration: 0.8,
                ease: "back.out(1.7)"
            }
        )
        .to(letterElement, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
        })
        .to(letterElement, {
            scale: 0,
            rotation: 180,
            opacity: 0,
            duration: 0.8,
            ease: "back.in(1.7)",
            delay: 1
        });
    }
    
    // Crear pantalla de celebración mejorada
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
            <p>Checa WhatsApp, te tengo un sticker que te va a gustar. jijiji</p>
            <p>TE AMO ❤️</p>
            <p class="close-hint">Toca en cualquier lugar para continuar...</p>
        `;
        
        // Añadir al cuerpo
        document.body.appendChild(yesScreen);
        
        // Animación de entrada con GSAP
        if (window.gsap) {
            gsap.fromTo(yesScreen,
                { 
                    opacity: 0,
                    scale: 0.8
                },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    ease: "back.out(1.7)"
                }
            );
            
            // Animar elementos internos
            gsap.from(yesScreen.children, {
                y: 50,
                opacity: 0,
                duration: 0.6,
                stagger: 0.2,
                ease: "power2.out",
                delay: 0.3
            });
            
            // Animación especial para el corazón
            const heart = yesScreen.querySelector('.big-heart i');
            if (heart) {
                gsap.to(heart, {
                    scale: 1.2,
                    duration: 1.5,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut"
                });
            }
            
            // Crear partículas de celebración continua
            createCelebrationParticles(yesScreen);
        } else {
            // Fallback CSS
            setTimeout(function() {
                yesScreen.classList.add('show');
            }, 100);
        }
        
        // Evento para cerrar al hacer clic
        yesScreen.addEventListener('click', function() {
            if (window.gsap) {
                gsap.to(yesScreen, {
                    opacity: 0,
                    scale: 0.8,
                    duration: 0.5,
                    ease: "back.in(1.7)",
                    onComplete: () => {
                        yesScreen.remove();
                        if (typeof onCloseCallback === 'function') {
                            onCloseCallback();
                        }
                    }
                });
            } else {
                // Fallback CSS
                yesScreen.style.opacity = '0';
                setTimeout(function() {
                    yesScreen.remove();
                    if (typeof onCloseCallback === 'function') {
                        onCloseCallback();
                    }
                }, 500);
            }
        });
    }
    
    // Crear partículas de celebración continua
    function createCelebrationParticles(container) {
        if (!window.gsap) return;
        
        const colors = ['#ff6b95', '#7e57c2', '#00bcd4', '#ff4081', '#9575cd'];
        
        function createParticle() {
            const particle = document.createElement('div');
            particle.innerHTML = Math.random() > 0.5 ? '❤️' : '✨';
            particle.style.position = 'absolute';
            particle.style.fontSize = (Math.random() * 20 + 15) + 'px';
            particle.style.pointerEvents = 'none';
            
            gsap.set(particle, {
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + 50,
                opacity: 0.8
            });
            
            container.appendChild(particle);
            
            gsap.to(particle, {
                y: -50,
                x: `+=${(Math.random() - 0.5) * 200}`,
                rotation: Math.random() * 720,
                opacity: 0,
                duration: Math.random() * 4 + 3,
                ease: "power2.out",
                onComplete: () => {
                    if (particle.parentNode) {
                        particle.remove();
                    }
                }
            });
        }
        
        // Crear partículas cada 200ms
        const particleInterval = setInterval(createParticle, 200);
        
        // Detener después de 10 segundos
        setTimeout(() => {
            clearInterval(particleInterval);
        }, 10000);
    }
    
    // Resetear estado de la propuesta
    function resetProposalState() {
        // Restaurar el estado inicial
        if (window.gsap) {
            gsap.to(yesBtn, { scale: 1, duration: 0.3 });
            gsap.to(noBtn, { opacity: 1, x: 0, y: 0, duration: 0.3 });
        } else {
            yesBtn.style.transform = "";
            noBtn.style.opacity = "1";
            noBtn.style.transform = "";
        }
        
        // Habilitar los botones nuevamente
        yesBtn.disabled = false;
        noBtn.disabled = false;
        
        // Resetear el mensaje
        proposalMessage.innerHTML = "";
        if (window.gsap) {
            gsap.set(proposalMessage, { opacity: 0 });
        }
        
        // Marcar celebración como inactiva
        celebrationActive = false;
    }
    
    // Exponer funciones públicas
    return {
        init: init,
        createEnhancedConfetti: createEnhancedConfetti
    };
})();

// Exponer el módulo globalmente
window.proposalManager = proposalManager;