import { h } from 'preact';
import { useState, useEffect, useCallback } from 'preact/hooks';
import '../../styles/game-shell.css';

export function GameShell({ title, icon, children, onTimeUpdate, showTimer = true }) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning || !showTimer) return;
    const interval = setInterval(() => {
      setElapsedTime(prev => {
        const newTime = prev + 1;
        if (onTimeUpdate) onTimeUpdate(newTime);
        return newTime;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, showTimer]);

  const stopTimer = useCallback(() => setIsRunning(false), []);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <div className="game-shell">
      <div className="game-shell-header pixel-border">
        <a href="/arcade" className="game-back-btn neon-text-cyan">
          {'\u25C4'} ARCADE
        </a>
        <div className="game-shell-title">
          <i className={icon}></i>
          <span className="neon-text-pink">{title}</span>
        </div>
        {showTimer && (
          <div className="game-shell-timer">
            <span className="timer-label">TIEMPO</span>
            <span className="timer-value neon-text-yellow">{formatTime(elapsedTime)}</span>
          </div>
        )}
      </div>
      <div className="game-shell-content">
        {typeof children === 'function' ? children({ elapsedTime, stopTimer }) : children}
      </div>
    </div>
  );
}
