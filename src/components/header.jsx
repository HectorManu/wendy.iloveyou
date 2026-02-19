import { h } from 'preact';
import '../styles/header.css';

export function Header() {
  return (
    <div className="game-hud pixel-border">
      <div className="hud-left">
        <span className="hud-label">PLAYER 1</span>
        <span className="hud-player-name">W & H</span>
      </div>
      <div className="hud-center">
        <span className="hud-game-title neon-text-pink">NUESTRO AMOR</span>
        <span className="hud-subtitle">THE GAME</span>
      </div>
      <div className="hud-right">
        <span className="hud-label">VER</span>
        <span className="hud-version">v2.0</span>
      </div>
    </div>
  );
}
