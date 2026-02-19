import { h } from 'preact';
import { Link } from 'preact-router/match';
import '../styles/not-found.css';

export function NotFound() {
  return (
    <div className="not-found">
      <h2 className="game-over-title neon-text-pink">GAME OVER</h2>
      <p className="game-over-sub">NIVEL NO ENCONTRADO</p>
      <div className="heart-icon">
        <i className="fas fa-heart-broken"></i>
      </div>
      <p className="game-over-message">Pero nuestro amor sigue intacto.</p>
      <Link href="/" className="home-link pixel-border">VOLVER AL INICIO</Link>
    </div>
  );
}
