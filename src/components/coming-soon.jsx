import { h } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import '../styles/coming-soon.css';

export function ComingSoon() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && typeof gsap !== 'undefined') {
      gsap.from(containerRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.5,
        delay: 1,
        ease: 'steps(8)',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none none'
        }
      });
    }
  }, []);

  return (
    <div className="locked-levels pixel-border" ref={containerRef}>
      <div className="locked-header">
        <span className="locked-title neon-text-purple">CONTENIDO BLOQUEADO</span>
        <span className="locked-subtitle">PROXIMO DLC</span>
      </div>

      <div className="locked-grid">
        <div className="locked-item pixel-border">
          <div className="lock-icon">
            <i className="fas fa-lock"></i>
          </div>
          <span className="lock-label">LINEA DEL TIEMPO</span>
        </div>
        <div className="locked-item pixel-border">
          <div className="lock-icon">
            <i className="fas fa-lock"></i>
          </div>
          <span className="lock-label">ALBUM DE FOTOS</span>
        </div>
        <div className="locked-item pixel-border">
          <div className="lock-icon">
            <i className="fas fa-lock"></i>
          </div>
          <span className="lock-label">MUSICA 8-BIT</span>
        </div>
      </div>

      <p className="locked-message">
        Nuevos niveles en desarrollo<span className="pixel-cursor">_</span>
      </p>
    </div>
  );
}
