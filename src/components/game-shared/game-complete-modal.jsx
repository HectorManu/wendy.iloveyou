import { h } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import '../../styles/game-complete-modal.css';

export function GameCompleteModal({ score, xp, time, message, onPlayAgain, onBackToArcade }) {
  const modalRef = useRef(null);
  const confettiRef = useRef(null);

  const formatTime = (s) => {
    if (s == null) return '--:--';
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!modalRef.current) return;
    if (typeof gsap !== 'undefined') {
      gsap.from(modalRef.current, {
        scale: 0.5, opacity: 0, duration: 0.4, ease: 'steps(6)'
      });
    }
    // Pixel confetti
    if (confettiRef.current) {
      const colors = ['#ff2d7b', '#00ffcc', '#ffea00', '#7b2dff', '#39ff14'];
      for (let i = 0; i < 30; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.backgroundColor = colors[i % colors.length];
        piece.style.left = Math.random() * 100 + '%';
        confettiRef.current.appendChild(piece);
        if (typeof gsap !== 'undefined') {
          gsap.fromTo(piece,
            { y: -20, opacity: 1, scale: 1 },
            {
              y: 300 + Math.random() * 200,
              x: (Math.random() - 0.5) * 200,
              rotation: Math.random() * 720,
              opacity: 0,
              duration: 2 + Math.random(),
              delay: Math.random() * 0.5,
              ease: 'steps(12)'
            }
          );
        }
      }
    }
  }, []);

  return (
    <div className="game-complete-overlay">
      <div className="game-complete-modal pixel-border" ref={modalRef}>
        <div className="confetti-container" ref={confettiRef}></div>
        <div className="complete-icon">
          <i className="fas fa-trophy"></i>
        </div>
        <h2 className="complete-title neon-text-yellow">NIVEL COMPLETADO!</h2>
        {message && <p className="complete-message">{message}</p>}
        <div className="complete-stats">
          <div className="stat-item">
            <span className="stat-label">SCORE</span>
            <span className="stat-value neon-text-cyan">{score}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">XP</span>
            <span className="stat-value neon-text-green">+{xp}</span>
          </div>
          {time != null && (
            <div className="stat-item">
              <span className="stat-label">TIEMPO</span>
              <span className="stat-value neon-text-pink">{formatTime(time)}</span>
            </div>
          )}
        </div>
        <div className="complete-actions">
          <button className="complete-btn play-again pixel-border" onClick={onPlayAgain}>
            <i className="fas fa-redo"></i> JUGAR DE NUEVO
          </button>
          <a href="/arcade" className="complete-btn back-arcade pixel-border" onClick={onBackToArcade}>
            <i className="fas fa-gamepad"></i> ARCADE
          </a>
        </div>
      </div>
    </div>
  );
}
