/*
 * gsap-animations.js
 * Animaciones GSAP para hacer el sitio más dinámico y bonito
 * Mantiene los colores y estructura original
 */

// Registrar plugins de GSAP
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// Configuración de animaciones
const animationConfig = {
    duration: {
        fast: 0.3,
        normal: 0.8,
        slow: 1.2,
        verySlow: 2
    },
    ease: {
        smooth: "power2.out",
        bounce: "back.out(1.7)",
        elastic: "elastic.out(1, 0.5)"
    },
    colors: ['#ff6b95', '#7e57c2', '#00bcd4', '#ff4081', '#9575cd']
};

// Módulo de animaciones GSAP
const GSAPAnimations = (function() {
    
    // Variables para partículas
    let mouseParticles = [];
    let floatingElements = [];
    
    // Función para inicializar todas las animaciones
    function init() {
        // Esperar a que GSAP y el DOM estén listos
        gsap.set("body", {autoAlpha: 1});
        
        // Inicializar animaciones básicas
        initBasicAnimations();
        
        // Inicializar partículas flotantes
        initFloatingParticles();
        
        // Inicializar efectos de mouse
        initMouseEffects();
        
        // Inicializar animaciones de scroll
        initScrollAnimations();
        
        // Inicializar animaciones de hover
        initHoverAnimations();
        
        // Inicializar efectos especiales
        initSpecialEffects();
        
        console.log('🎨 GSAP Animations initialized successfully!');
    }
    
    // Animaciones básicas de entrada
    function initBasicAnimations() {
        // Timeline principal de entrada
        const tl = gsap.timeline();
        
        // Animar título principal
        tl.from("#main-title", {
            duration: animationConfig.duration.slow,
            y: 100,
            opacity: 0,
            ease: animationConfig.ease.smooth,
            onComplete: () => {
                // Añadir brillo al título
                gsap.to("#main-title", {
                    textShadow: "0 0 20px rgba(255, 107, 149, 0.3)",
                    duration: 2,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut"
                });
            }
        })
        // Animar contador
        .to("#counter-container", {
            duration: animationConfig.duration.normal,
            y: 0,
            opacity: 1,
            ease: animationConfig.ease.bounce
        }, "-=0.5")
        // Animar carrusel
        .to("#carousel-container", {
            duration: animationConfig.duration.normal,
            y: 0,
            opacity: 1,
            ease: animationConfig.ease.smooth
        }, "-=0.3")
        // Animar corazón
        .to("#heart-container", {
            duration: animationConfig.duration.normal,
            scale: 1,
            opacity: 1,
            ease: animationConfig.ease.bounce
        }, "-=0.2")
        // Animar badge de versión
        .to("#version-badge", {
            duration: animationConfig.duration.normal,
            x: 0,
            opacity: 1,
            ease: animationConfig.ease.elastic
        }, "-=0.5");
    }
    
    // Crear partículas flotantes de fondo
    function initFloatingParticles() {
        const particlesContainer = document.getElementById('dynamic-particles');
        const particleCount = window.innerWidth < 768 ? 8 : 15;
        
        for (let i = 0; i < particleCount; i++) {
            createFloatingParticle(particlesContainer, i);
        }
        
        // Recrear partículas cada 30 segundos
        setInterval(() => {
            createRandomFloatingParticle(particlesContainer);
        }, 3000);
    }
    
    // Crear una partícula flotante
    function createFloatingParticle(container, index) {
        const isHeart = Math.random() > 0.6;
        const particle = document.createElement('div');
        
        if (isHeart) {
            particle.className = 'floating-heart';
            particle.innerHTML = '<i class="fas fa-heart"></i>';
        } else {
            particle.className = 'floating-star';
            particle.innerHTML = '<i class="fas fa-star"></i>';
        }
        
        // Posición inicial aleatoria
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight;
        
        gsap.set(particle, {
            x: startX,
            y: startY,
            scale: Math.random() * 0.5 + 0.5
        });
        
        container.appendChild(particle);
        floatingElements.push(particle);
        
        // Animación de flotación
        const floatTl = gsap.timeline({repeat: -1});
        floatTl.to(particle, {
            duration: Math.random() * 20 + 15,
            x: `+=${Math.random() * 200 - 100}`,
            y: `+=${Math.random() * 200 - 100}`,
            ease: "sine.inOut"
        })
        .to(particle, {
            duration: Math.random() * 20 + 15,
            x: `+=${Math.random() * 200 - 100}`,
            y: `+=${Math.random() * 200 - 100}`,
            ease: "sine.inOut"
        });
        
        // Animación de parpadeo
        gsap.to(particle, {
            opacity: Math.random() * 0.5 + 0.3,
            duration: Math.random() * 3 + 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: Math.random() * 2
        });
        
        // Eliminar partícula después de un tiempo
        setTimeout(() => {
            gsap.to(particle, {
                opacity: 0,
                duration: 2,
                onComplete: () => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                    floatingElements = floatingElements.filter(el => el !== particle);
                }
            });
        }, (Math.random() * 60 + 30) * 1000); // 30-90 segundos
    }
    
    // Crear partícula flotante aleatoria
    function createRandomFloatingParticle(container) {
        if (floatingElements.length < 20) {
            createFloatingParticle(container, floatingElements.length);
        }
    }
    
    // Efectos de mouse
    function initMouseEffects() {
        let mouseX = 0;
        let mouseY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Crear partículas del mouse ocasionalmente
            if (Math.random() > 0.97) {
                createMouseParticle(mouseX, mouseY);
            }
            
            // Efecto parallax en partículas flotantes
            floatingElements.forEach(particle => {
                const rect = particle.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const deltaX = (mouseX - centerX) * 0.02;
                const deltaY = (mouseY - centerY) * 0.02;
                
                gsap.to(particle, {
                    x: `+=${deltaX}`,
                    y: `+=${deltaY}`,
                    duration: 2,
                    ease: "power2.out"
                });
            });
        });
        
        // Limpiar partículas del mouse cada 5 segundos
        setInterval(cleanupMouseParticles, 5000);
    }
    
    // Crear partícula del mouse
    function createMouseParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'mouse-particle';
        
        const color = animationConfig.colors[Math.floor(Math.random() * animationConfig.colors.length)];
        particle.style.backgroundColor = color;
        particle.style.boxShadow = `0 0 10px ${color}`;
        
        gsap.set(particle, {
            x: x,
            y: y,
            scale: 0
        });
        
        document.body.appendChild(particle);
        mouseParticles.push(particle);
        
        // Animación de la partícula
        const tl = gsap.timeline({
            onComplete: () => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
                mouseParticles = mouseParticles.filter(p => p !== particle);
            }
        });
        
        tl.to(particle, {
            scale: 1,
            duration: 0.2,
            ease: "back.out(1.7)"
        })
        .to(particle, {
            x: `+=${(Math.random() - 0.5) * 100}`,
            y: `+=${(Math.random() - 0.5) * 100}`,
            opacity: 0,
            duration: 1.5,
            ease: "power2.out"
        });
    }
    
    // Limpiar partículas del mouse
    function cleanupMouseParticles() {
        mouseParticles.forEach(particle => {
            if (particle.parentNode) {
                gsap.to(particle, {
                    opacity: 0,
                    duration: 0.5,
                    onComplete: () => {
                        if (particle.parentNode) {
                            particle.parentNode.removeChild(particle);
                        }
                    }
                });
            }
        });
        mouseParticles = [];
    }
    
    // Animaciones de scroll
    function initScrollAnimations() {
        // Animación para la sección de próximas características
        gsap.to("#coming-soon", {
            scrollTrigger: {
                trigger: "#coming-soon",
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse"
            },
            y: 0,
            opacity: 1,
            duration: animationConfig.duration.normal,
            ease: animationConfig.ease.smooth
        });
        
        // Animación para el footer
        gsap.to("#footer", {
            scrollTrigger: {
                trigger: "#footer",
                start: "top 90%",
                toggleActions: "play none none reverse"
            },
            y: 0,
            opacity: 1,
            duration: animationConfig.duration.normal,
            ease: animationConfig.ease.smooth
        });
        
        // Parallax para el fondo
        gsap.to("#flowers", {
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "bottom top",
                scrub: true
            },
            y: -50,
            ease: "none"
        });
    }
    
    // Animaciones de hover
    function initHoverAnimations() {
        // Efecto hover para botones del carrusel
        document.querySelectorAll('.carousel-control').forEach(button => {
            button.addEventListener('mouseenter', () => {
                gsap.to(button, {
                    scale: 1.1,
                    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                    duration: animationConfig.duration.fast,
                    ease: animationConfig.ease.smooth
                });
            });
            
            button.addEventListener('mouseleave', () => {
                gsap.to(button, {
                    scale: 1,
                    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                    duration: animationConfig.duration.fast,
                    ease: animationConfig.ease.smooth
                });
            });
        });
        
        // Efecto hover para el corazón principal
        const heartBtn = document.getElementById('heart-btn');
        if (heartBtn) {
            heartBtn.addEventListener('mouseenter', () => {
                gsap.to(heartBtn, {
                    scale: 1.2,
                    rotation: 15,
                    duration: animationConfig.duration.fast,
                    ease: animationConfig.ease.bounce
                });
                
                // Crear partículas alrededor del corazón
                createHeartParticles(heartBtn);
            });
            
            heartBtn.addEventListener('mouseleave', () => {
                gsap.to(heartBtn, {
                    scale: 1,
                    rotation: 0,
                    duration: animationConfig.duration.fast,
                    ease: animationConfig.ease.smooth
                });
            });
        }
    }
    
    // Crear partículas alrededor del corazón
    function createHeartParticles(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            particle.innerHTML = '<i class="fas fa-heart"></i>';
            particle.style.position = 'fixed';
            particle.style.color = animationConfig.colors[i % animationConfig.colors.length];
            particle.style.fontSize = '12px';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '1000';
            
            gsap.set(particle, {
                x: centerX,
                y: centerY,
                scale: 0
            });
            
            document.body.appendChild(particle);
            
            const angle = (360 / 6) * i;
            const distance = 50;
            const endX = centerX + Math.cos(angle * Math.PI / 180) * distance;
            const endY = centerY + Math.sin(angle * Math.PI / 180) * distance;
            
            const tl = gsap.timeline({
                onComplete: () => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }
            });
            
            tl.to(particle, {
                scale: 1,
                duration: 0.2,
                ease: "back.out(1.7)"
            })
            .to(particle, {
                x: endX,
                y: endY,
                opacity: 0,
                duration: 1,
                ease: "power2.out"
            });
        }
    }
    
    // Efectos especiales
    function initSpecialEffects() {
        // Pulso suave en el contador
        gsap.to("#counter", {
            scale: 1.02,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
        
        // Rotación suave del icono de regalo
        const giftIcon = document.querySelector('.preview-image i');
        if (giftIcon) {
            gsap.to(giftIcon, {
                rotation: 5,
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        }
        
        // Efecto de respiración en las tarjetas
        gsap.to(".counter-container, .carousel-container, .coming-soon", {
            boxShadow: "0 15px 45px rgba(255, 107, 149, 0.15)",
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }
    
    // Función para animar el cambio de color del corazón
    function animateHeartColorChange(element, newColor) {
        // Crear efecto de onda
        const wave = document.createElement('div');
        wave.style.position = 'absolute';
        wave.style.top = '50%';
        wave.style.left = '50%';
        wave.style.width = '0px';
        wave.style.height = '0px';
        wave.style.borderRadius = '50%';
        wave.style.border = `2px solid ${newColor}`;
        wave.style.transform = 'translate(-50%, -50%)';
        wave.style.pointerEvents = 'none';
        wave.style.zIndex = '1000';
        
        element.style.position = 'relative';
        element.appendChild(wave);
        
        gsap.to(wave, {
            width: '100px',
            height: '100px',
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            onComplete: () => {
                if (wave.parentNode) {
                    wave.parentNode.removeChild(wave);
                }
            }
        });
        
        // Cambiar color con animación
        gsap.to(element, {
            color: newColor,
            duration: 0.3,
            ease: "power2.out"
        });
    }
    
    // Función para crear confeti mejorado con GSAP
    function createGSAPConfetti() {
        const colors = animationConfig.colors;
        const confettiCount = 80;
        const confettiElements = [];
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            const isHeart = Math.random() > 0.5;
            
            if (isHeart) {
                confetti.innerHTML = '<i class="fas fa-heart"></i>';
                confetti.style.fontSize = (Math.random() * 15 + 10) + 'px';
            } else {
                confetti.style.width = (Math.random() * 8 + 4) + 'px';
                confetti.style.height = confetti.style.width;
                confetti.style.borderRadius = '50%';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            }
            
            confetti.style.position = 'fixed';
            confetti.style.color = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '1000';
            
            gsap.set(confetti, {
                x: Math.random() * window.innerWidth,
                y: -20,
                rotation: Math.random() * 360
            });
            
            document.body.appendChild(confetti);
            confettiElements.push(confetti);
            
            // Animación de caída
            gsap.to(confetti, {
                y: window.innerHeight + 20,
                rotation: `+=${Math.random() * 720 + 360}`,
                duration: Math.random() * 4 + 3,
                ease: "power2.in",
                delay: Math.random() * 2,
                onComplete: () => {
                    if (confetti.parentNode) {
                        confetti.parentNode.removeChild(confetti);
                    }
                }
            });
        }
        
        // Limpiar confeti después de 10 segundos
        setTimeout(() => {
            confettiElements.forEach(confetti => {
                if (confetti.parentNode) {
                    gsap.to(confetti, {
                        opacity: 0,
                        duration: 1,
                        onComplete: () => {
                            if (confetti.parentNode) {
                                confetti.parentNode.removeChild(confetti);
                            }
                        }
                    });
                }
            });
        }, 10000);
    }
    
    // Función para animar la propuesta
    function animateProposal() {
        const proposalTl = gsap.timeline();
        
        proposalTl.from("#proposal-card", {
            scale: 0.8,
            opacity: 0,
            duration: animationConfig.duration.normal,
            ease: animationConfig.ease.bounce
        })
        .from("#proposal-image", {
            scale: 0,
            rotation: 180,
            duration: animationConfig.duration.normal,
            ease: animationConfig.ease.bounce
        }, "-=0.3")
        .from("#proposal-title", {
            y: 30,
            opacity: 0,
            duration: animationConfig.duration.normal,
            ease: animationConfig.ease.smooth
        }, "-=0.2")
        .from("#proposal-buttons", {
            y: 30,
            opacity: 0,
            duration: animationConfig.duration.normal,
            ease: animationConfig.ease.smooth
        }, "-=0.1");
        
        // Efecto de pulso en los botones
        gsap.to("#yes-btn", {
            boxShadow: "0 0 20px rgba(255, 107, 149, 0.5)",
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }
    
    // Exponer funciones públicas
    return {
        init: init,
        animateHeartColorChange: animateHeartColorChange,
        createGSAPConfetti: createGSAPConfetti,
        animateProposal: animateProposal
    };
})();

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Esperar un poco para que los otros scripts se carguen
    setTimeout(() => {
        GSAPAnimations.init();
    }, 100);
});

// Exponer el módulo globalmente para que otros scripts puedan usarlo
window.GSAPAnimations = GSAPAnimations;