import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import '../styles/time-counter.css';

const config = {
  startDate: '2024-11-24T00:00:00'
};

export function TimeCounter() {
  const [timeElapsed, setTimeElapsed] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const calculateTimeElapsed = () => {
    const startTime = new Date(config.startDate).getTime();
    const currentTime = new Date().getTime();
    const difference = currentTime - startTime;

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    setTimeElapsed({ days, hours, minutes, seconds });
  };

  useEffect(() => {
    calculateTimeElapsed();
    const timer = setInterval(calculateTimeElapsed, 1000);
    return () => clearInterval(timer);
  }, []);

  // XP = progress through current day (0-100%)
  const xpPercentage = Math.floor(
    ((timeElapsed.hours * 3600 + timeElapsed.minutes * 60 + timeElapsed.seconds) / 86400) * 100
  );

  return (
    <div className="game-score-display pixel-border">
      <h2 id="main-title" className="game-title neon-text-pink">
        NUESTRO AMOR
      </h2>

      <div className="level-display">
        <span className="level-label neon-text-cyan">LVL</span>
        <span className="level-value neon-text-yellow">{timeElapsed.days}</span>
        <span className="level-sub">DIAS JUNTOS</span>
      </div>

      <div className="score-display">
        <div className="score-row">
          <div className="score-unit">
            <span className="score-value neon-text-cyan">{String(timeElapsed.hours).padStart(2, '0')}</span>
            <span className="score-label">HRS</span>
          </div>
          <span className="score-separator">:</span>
          <div className="score-unit">
            <span className="score-value neon-text-cyan">{String(timeElapsed.minutes).padStart(2, '0')}</span>
            <span className="score-label">MIN</span>
          </div>
          <span className="score-separator">:</span>
          <div className="score-unit">
            <span className="score-value neon-text-cyan">{String(timeElapsed.seconds).padStart(2, '0')}</span>
            <span className="score-label">SEC</span>
          </div>
        </div>
      </div>

      <div className="xp-bar-container">
        <span className="xp-label">XP</span>
        <div className="xp-bar">
          <div className="xp-fill" style={{ width: xpPercentage + '%' }}></div>
        </div>
        <span className="xp-text neon-text-green">{xpPercentage}%</span>
      </div>
    </div>
  );
}
