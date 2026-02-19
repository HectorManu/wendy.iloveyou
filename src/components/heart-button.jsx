import { h } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';
import '../styles/heart-button.css';

export function HeartButton() {
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const buttonRef = useRef(null);
  const [gsapReady, setGsapReady] = useState(false);

  // Neon colors
  const heartColors = ['#ff2d7b', '#00ffcc', '#ffea00', '#7b2dff', '#39ff14'];

  useEffect(() => {
    if (typeof gsap === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
      script.async = true;
      script.onload = () => setGsapReady(true);
      document.body.appendChild(script);
    } else {
      setGsapReady(true);
    }
  }, []);

  const animateHeartColorChange = (newColor) => {
    if (gsapReady && buttonRef.current && typeof gsap !== 'undefined') {
      gsap.to(buttonRef.current, {
        color: newColor,
        borderColor: newColor,
        duration: 0.1,
        scale: 1.3,
        ease: 'steps(4)',
        onComplete: () => {
          gsap.to(buttonRef.current, {
            scale: 1,
            duration: 0.15,
            ease: 'steps(3)'
          });
        }
      });
    } else if (buttonRef.current) {
      buttonRef.current.style.color = newColor;
      buttonRef.current.style.borderColor = newColor;
    }
  };

  const handleClick = () => {
    const newIndex = (currentColorIndex + 1) % heartColors.length;
    setCurrentColorIndex(newIndex);
    setClickCount(prev => prev + 1);
    animateHeartColorChange(heartColors[newIndex]);

    if (gsapReady && typeof gsap !== 'undefined') {
      createPixelParticles();
    }
  };

  const createPixelParticles = () => {
    const button = buttonRef.current;
    if (!button) return;

    const buttonRect = button.getBoundingClientRect();
    const centerX = buttonRect.left + buttonRect.width / 2;
    const centerY = buttonRect.top + buttonRect.height / 2;

    const symbols = ['\u2665', '\u2605', '\u25A0', '\u2666'];

    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('div');
      particle.className = 'pixel-particle';
      particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      particle.style.color = heartColors[Math.floor(Math.random() * heartColors.length)];
      document.body.appendChild(particle);

      const angle = Math.random() * Math.PI * 2;
      const distance = 40 + Math.random() * 80;
      const endX = centerX + Math.cos(angle) * distance;
      const endY = centerY + Math.sin(angle) * distance;

      gsap.set(particle, {
        x: centerX,
        y: centerY,
        scale: 0.8 + Math.random() * 0.6,
        opacity: 1
      });

      gsap.to(particle, {
        x: endX,
        y: endY,
        opacity: 0,
        scale: 0.1,
        duration: 0.6 + Math.random() * 0.4,
        ease: 'steps(8)',
        onComplete: () => {
          if (particle.parentNode) particle.parentNode.removeChild(particle);
        }
      });
    }
  };

  const currentColor = heartColors[currentColorIndex];

  return (
    <div className="powerup-container">
      <span className="powerup-label">POWER UP!</span>
      <button
        ref={buttonRef}
        className="powerup-btn pixel-border"
        onClick={handleClick}
        aria-label="Activar power up"
        style={{
          color: currentColor,
          borderColor: currentColor,
          boxShadow: `0 0 15px ${currentColor}40, inset 0 0 15px ${currentColor}15`
        }}
      >
        <i className="fas fa-heart"></i>
      </button>
      <span className="powerup-counter" style={{ color: currentColor }}>x{clickCount}</span>
    </div>
  );
}
