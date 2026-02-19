import { h } from 'preact';
import { useGameProgress } from '../../hooks/use-game-progress';
import { PlayerStats } from './player-stats';
import { GameCard } from './game-card';

const GAMES = [
  {
    key: 'memory',
    title: 'MEMORIA',
    icon: 'fas fa-th',
    color: '#ff2d7b',
    description: 'Encuentra los pares ocultos',
    path: '/arcade/memoria'
  },
  {
    key: 'trivia',
    title: 'TRIVIA',
    icon: 'fas fa-question-circle',
    color: '#00ffcc',
    description: 'Pon a prueba tu conocimiento',
    path: '/arcade/trivia'
  },
  {
    key: 'wordSearch',
    title: 'SOPA DE LETRAS',
    icon: 'fas fa-search',
    color: '#ffea00',
    description: 'Busca las palabras escondidas',
    path: '/arcade/sopa-de-letras'
  },
  {
    key: 'crossword',
    title: 'CRUCIGRAMA',
    icon: 'fas fa-border-all',
    color: '#7b2dff',
    description: 'Resuelve las pistas de amor',
    path: '/arcade/crucigrama'
  }
];

export function ArcadeHub() {
  const { progress, getPlayerLevel, getLevelProgress, getGameStats } = useGameProgress();

  return (
    <div className="arcade-container">
      <div className="arcade-header">
        <h1 className="arcade-title neon-text-pink">SALA DE JUEGOS</h1>
        <p className="arcade-subtitle">Elige tu aventura</p>
      </div>

      <PlayerStats
        level={getPlayerLevel()}
        xp={progress.player.totalXP}
        levelProgress={getLevelProgress()}
        gamesPlayed={progress.player.gamesPlayed}
        gamesWon={progress.player.gamesWon}
      />

      <div className="arcade-grid">
        {GAMES.map(game => (
          <GameCard
            key={game.key}
            title={game.title}
            icon={game.icon}
            color={game.color}
            description={game.description}
            path={game.path}
            stats={getGameStats(game.key)}
          />
        ))}
      </div>
    </div>
  );
}
