import { h } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';
import '../styles/proposal.css';

export function Proposal() {
  const [visible, setVisible] = useState(false);
  const [celebrationActive, setCelebrationActive] = useState(false);
  const [noButtonPosition, setNoButtonPosition] = useState({ top: 0, left: 0 });
  const [shouldClose, setShouldClose] = useState(false);
  const [victoryMessage, setVictoryMessage] = useState('');

  const cardRef = useRef(null);
  const yesButtonRef = useRef(null);
  const noButtonRef = useRef(null);
  const messageRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
      setupProposal();
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (shouldClose && celebrationActive) {
      const timer = setTimeout(() => {
        if (containerRef.current && typeof gsap !== 'undefined') {
          gsap.to(containerRef.current, {
            opacity: 0,
            duration: 0.5,
            ease: 'steps(8)',
            onComplete: () => {
              setVisible(false);
              setCelebrationActive(false);
              setShouldClose(false);
            }
          });
        } else {
          setVisible(false);
          setCelebrationActive(false);
          setShouldClose(false);
        }
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [shouldClose, celebrationActive]);

  const setupProposal = () => {
    if (!cardRef.current) return;

    const today = new Date();
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = today.toLocaleDateString('es-ES', options);

    const proposalTitle = cardRef.current.querySelector('.battle-question');
    if (proposalTitle) {
      proposalTitle.textContent = `Quieres ser mi novia hoy, ${formattedDate}?`;
    }

    if (typeof gsap !== 'undefined') {
      gsap.from(cardRef.current, {
        y: -30,
        opacity: 0,
        duration: 0.5,
        ease: 'steps(8)'
      });
    }
  };

  const handleYes = () => {
    if (!messageRef.current) return;

    setVictoryMessage('BOSS DERROTADO! +9999 XP');
    messageRef.current.style.display = 'block';

    if (yesButtonRef.current) yesButtonRef.current.disabled = true;
    if (noButtonRef.current) noButtonRef.current.style.display = 'none';

    setCelebrationActive(true);
    startCelebration();
    setShouldClose(true);
  };

  const handleNoMouseOver = () => {
    if (!noButtonRef.current) return;

    const card = cardRef.current;
    const button = noButtonRef.current;

    if (card && button) {
      const cardRect = card.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();

      const maxLeft = cardRect.width - buttonRect.width - 20;
      const maxTop = cardRect.height - buttonRect.height - 20;

      const newLeft = Math.random() * maxLeft;
      const newTop = Math.random() * maxTop;

      setNoButtonPosition({ top: newTop, left: newLeft });

      if (typeof gsap !== 'undefined') {
        gsap.to(button, {
          top: newTop,
          left: newLeft,
          duration: 0.15,
          ease: 'steps(6)'
        });
      }
    }
  };

  const startCelebration = () => {
    if (typeof gsap === 'undefined') {
      const gsapScript = document.createElement('script');
      gsapScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
      gsapScript.async = true;
      document.body.appendChild(gsapScript);
      gsapScript.onload = () => startConfetti();
    } else {
      startConfetti();
    }
  };

  const startConfetti = () => {
    const colors = ['#ff2d7b', '#00ffcc', '#ffea00', '#7b2dff', '#39ff14'];
    const symbols = ['\u2665', '\u2605', '\u25A0', '\u2666'];
    const container = document.body;

    for (let i = 0; i < 80; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        confetti.className = 'pixel-confetti';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.boxShadow = `0 0 6px ${colors[Math.floor(Math.random() * colors.length)]}`;
        container.appendChild(confetti);

        gsap.fromTo(
          confetti,
          {
            y: -20,
            x: 0,
            rotation: Math.random() * 360,
            opacity: 1,
            scale: 0.5 + Math.random() * 0.8
          },
          {
            y: '100vh',
            x: (Math.random() - 0.5) * 200,
            rotation: Math.random() * 720,
            opacity: 0,
            duration: 2 + Math.random() * 3,
            ease: 'steps(16)',
            onComplete: () => {
              if (confetti.parentNode) confetti.parentNode.removeChild(confetti);
            }
          }
        );
      }, i * 40);
    }
  };

  if (!visible) return null;

  return (
    <div
      className="boss-battle-overlay"
      style={{ display: visible ? 'flex' : 'none' }}
      ref={containerRef}
    >
      <div className="boss-battle-card pixel-border" ref={cardRef}>
        <div className="battle-header">
          <span className="battle-stars neon-text-yellow">{'\u2605'} {'\u2605'} {'\u2605'}</span>
          <span className="battle-label neon-text-pink">BOSS BATTLE</span>
          <span className="battle-stage">NIVEL FINAL</span>
        </div>

        <div className="boss-sprite">
          <i className="fas fa-heart-circle-check fa-3x"></i>
          <div className="boss-hp-bar">
            <span className="hp-label">AMOR</span>
            <div className="hp-bar-track">
              <div className="hp-bar-fill"></div>
            </div>
            <span className="hp-text neon-text-green">999/999</span>
          </div>
        </div>

        <h3 className="battle-question">Quieres ser mi novia?</h3>

        <div className="battle-actions">
          <button
            className="action-btn attack-btn pixel-border"
            onClick={handleYes}
            ref={yesButtonRef}
          >
            <span className="btn-icon">{'\u2665'}</span>
            <span className="btn-text">SI, ATACAR!</span>
          </button>
          <button
            className="action-btn flee-btn pixel-border"
            onMouseOver={handleNoMouseOver}
            ref={noButtonRef}
            style={{
              position: 'relative',
              top: noButtonPosition.top + 'px',
              left: noButtonPosition.left + 'px'
            }}
          >
            <span className="btn-icon">{'\u2715'}</span>
            <span className="btn-text">HUIR</span>
          </button>
        </div>

        <div className="battle-message" ref={messageRef} style={{ display: victoryMessage ? 'block' : 'none' }}>
          <span className="victory-text neon-text-green">{victoryMessage}</span>
        </div>
      </div>
    </div>
  );
}
