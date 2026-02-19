import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import '../styles/footer.css';

export function Footer() {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }));
  }, []);

  return (
    <footer className="game-credits" id="footer">
      <p className="credits-line">
        PROGRAMADO CON <span className="pixel-heart neon-text-pink">{'\u2665'}</span> PARA TI
      </p>
      <p className="credits-date">{currentDate}</p>
      <p className="credits-insert-coin">
        <span className="blink-text">PRESS START TO CONTINUE</span>
      </p>
    </footer>
  );
}
