import { h } from 'preact';

export function GameCard({ title, icon, color, description, path, stats }) {
  const formatTime = (s) => {
    if (s == null) return '--:--';
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <a href={path} className="game-card pixel-border" style={{ '--card-accent': color }}>
      {stats.played === 0 && <span className="game-card-badge">NUEVO</span>}
      <div className="game-card-icon" style={{ color, textShadow: `0 0 15px ${color}55` }}>
        <i className={icon}></i>
      </div>
      <h3 className="game-card-title">{title}</h3>
      <p className="game-card-desc">{description}</p>
      <div className="game-card-stats">
        <div className="card-stat">
          <span className="card-stat-label">JUGADO</span>
          <span className="card-stat-value">{stats.played || 0}</span>
        </div>
        <div className="card-stat">
          <span className="card-stat-label">MEJOR</span>
          <span className="card-stat-value">
            {stats.bestTime != null ? formatTime(stats.bestTime) :
             stats.highScore > 0 ? stats.highScore : '--'}
          </span>
        </div>
      </div>
      <div className="game-card-play">
        <span>{'\u25BA'} JUGAR</span>
      </div>
    </a>
  );
}
