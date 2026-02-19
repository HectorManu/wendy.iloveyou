import { h } from 'preact';

export function PlayerStats({ level, xp, levelProgress, gamesPlayed, gamesWon }) {
  return (
    <div className="player-stats pixel-border">
      <div className="ps-level">
        <span className="ps-label">NIVEL</span>
        <span className="ps-level-value neon-text-yellow">{level}</span>
      </div>
      <div className="ps-xp">
        <div className="ps-xp-header">
          <span className="ps-label">XP</span>
          <span className="ps-xp-text">{xp} / {level * 500}</span>
        </div>
        <div className="ps-xp-bar">
          <div className="ps-xp-fill" style={{ width: `${levelProgress}%` }}></div>
        </div>
      </div>
      <div className="ps-totals">
        <div className="ps-total-item">
          <span className="ps-label">JUGADOS</span>
          <span className="ps-total-value neon-text-cyan">{gamesPlayed}</span>
        </div>
        <div className="ps-total-item">
          <span className="ps-label">GANADOS</span>
          <span className="ps-total-value neon-text-green">{gamesWon}</span>
        </div>
      </div>
    </div>
  );
}
