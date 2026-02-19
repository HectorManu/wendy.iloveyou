import { useEffect, useState } from 'preact/hooks';

export function useGsapAnimations() {
  const [isLoaded, setIsLoaded] = useState(false);

  const loadGsap = async () => {
    if (typeof gsap !== 'undefined') {
      initializeAnimations();
      setIsLoaded(true);
      return;
    }

    try {
      const gsapScript = document.createElement('script');
      gsapScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
      gsapScript.async = true;
      document.body.appendChild(gsapScript);

      gsapScript.onload = () => {
        const scrollTriggerScript = document.createElement('script');
        scrollTriggerScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js';
        scrollTriggerScript.async = true;
        document.body.appendChild(scrollTriggerScript);

        const textPluginScript = document.createElement('script');
        textPluginScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/TextPlugin.min.js';
        textPluginScript.async = true;
        document.body.appendChild(textPluginScript);

        textPluginScript.onload = () => {
          initializeAnimations();
          setIsLoaded(true);
        };
      };
    } catch (error) {
      console.error('Error al cargar GSAP:', error);
    }
  };

  const initializeAnimations = () => {
    if (typeof gsap === 'undefined') return;

    if (gsap.registerPlugin) {
      if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
      if (window.TextPlugin) gsap.registerPlugin(TextPlugin);
    }

    // Title animation with glitch effect
    gsap.to('#main-title', {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'steps(8)',
      delay: 0.5,
      onComplete: () => {
        // Brief glitch after title appears
        const title = document.getElementById('main-title');
        if (title) {
          gsap.to(title, {
            x: '+=2', skewX: 2,
            duration: 0.05, repeat: 5, yoyo: true,
            ease: 'none'
          });
        }
      }
    });

    createFloatingParticles();
  };

  // Pixel-style floating particles
  const createFloatingParticles = () => {
    const particlesContainer = document.getElementById('dynamic-particles');
    if (!particlesContainer) return;

    // Clear existing
    while (particlesContainer.firstChild) {
      particlesContainer.removeChild(particlesContainer.firstChild);
    }

    const particleCount = 25;
    const colors = ['#ff2d7b', '#00ffcc', '#ffea00', '#7b2dff', '#39ff14'];
    const symbols = ['\u2665', '\u2605', '\u25A0', '\u2666', '\u25CF'];

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'floating-particle';
      particle.textContent = symbols[i % symbols.length];
      particle.style.color = colors[Math.floor(Math.random() * colors.length)];
      particle.style.fontFamily = "'Press Start 2P', monospace";
      particle.style.fontSize = (0.4 + Math.random() * 0.6) + 'rem';

      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      const size = 0.5 + Math.random() * 0.8;

      particlesContainer.appendChild(particle);

      gsap.set(particle, {
        x: `${posX}vw`,
        y: `${posY}vh`,
        scale: size,
        opacity: 0
      });

      // Fade in
      gsap.to(particle, {
        opacity: 0.35,
        duration: 0.5,
        delay: i * 0.08,
        ease: 'steps(4)'
      });

      // Stepped floating movement
      gsap.to(particle, {
        y: `${posY + (Math.random() * 15 - 7.5)}vh`,
        x: `${posX + (Math.random() * 15 - 7.5)}vw`,
        rotation: Math.random() * 360,
        repeat: -1,
        yoyo: true,
        duration: 6 + Math.random() * 8,
        ease: 'steps(12)'
      });
    }
  };

  useEffect(() => {
    loadGsap();
  }, []);

  return {
    initAnimations: initializeAnimations,
    isLoaded
  };
}
