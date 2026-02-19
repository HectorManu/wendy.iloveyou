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
        <a href="/" className="hud-game-title neon-text-pink">NUESTRO AMOR</a>
        <div className="hud-nav">
          <a href="/" className="hud-nav-link">INICIO</a>
          <span className="hud-nav-sep">|</span>
          <a href="/arcade" className="hud-nav-link">ARCADE</a>
        </div>
      </div>
      <div className="hud-right">
        <span className="hud-label">VER</span>
        <span className="hud-version">v2.1</span>
      </div>
    </div>
  );
}
