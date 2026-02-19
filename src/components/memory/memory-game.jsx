import { h } from 'preact';
import { useState, useCallback } from 'preact/hooks';
import { GameShell } from '../game-shared/game-shell';
import { GameCompleteModal } from '../game-shared/game-complete-modal';
import { MemoryBoard } from './memory-board';
import { useGameProgress } from '../../hooks/use-game-progress';
import { memoryCardSets } from '../../data/memory-card-sets';
import '../../styles/memory.css';

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function createCards(setIndex) {
  const set = memoryCardSets[setIndex || 0];
  const cards = [];
  set.pairs.forEach((pair, i) => {
    for (let c = 0; c < 2; c++) {
      cards.push({
        uid: `${pair.id}-${c}`,
        pairId: pair.id,
        icon: pair.icon || null,
        symbol: pair.symbol || null,
        color: pair.color,
        label: pair.label,
        isFlipped: false,
        isMatched: false
      });
    }
  });
  return shuffleArray(cards);
}

export function MemoryGame() {
  const { recordGameResult } = useGameProgress();
  const [cards, setCards] = useState(() => createCards(0));
  const [flipped, setFlipped] = useState([]);
  const [checking, setChecking] = useState(false);
  const [moves, setMoves] = useState(0);
  const [matchedCount, setMatchedCount] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [finalTime, setFinalTime] = useState(null);
  const [finalScore, setFinalScore] = useState(0);
  const [finalXP, setFinalXP] = useState(0);
  const totalPairs = 8;

  const handleCardClick = useCallback((index) => {
    if (checking || cards[index].isFlipped || cards[index].isMatched || flipped.length >= 2) return;

    const newCards = [...cards];
    newCards[index] = { ...newCards[index], isFlipped: true };
    const newFlipped = [...flipped, index];

    setCards(newCards);
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      setChecking(true);

      const [first, second] = newFlipped;
      if (newCards[first].pairId === newCards[second].pairId) {
        // Match
        setTimeout(() => {
          setCards(prev => prev.map((c, i) =>
            i === first || i === second ? { ...c, isMatched: true } : c
          ));
          const newMatched = matchedCount + 1;
          setMatchedCount(newMatched);
          setFlipped([]);
          setChecking(false);
        }, 400);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map((c, i) =>
            i === first || i === second ? { ...c, isFlipped: false } : c
          ));
          setFlipped([]);
          setChecking(false);
        }, 1000);
      }
    }
  }, [cards, flipped, checking, matchedCount]);

  const handleGameComplete = useCallback((elapsedTime, stopTimer) => {
    if (matchedCount >= totalPairs && !gameComplete) {
      stopTimer();
      const score = (totalPairs * 50) + Math.max(0, (20 - moves) * 25) + Math.max(0, (120 - elapsedTime) * 3);
      let xp = totalPairs * 5 + 100;
      if (elapsedTime < 60) xp += 50;
      if (moves <= 12) xp += 25;

      setFinalTime(elapsedTime);
      setFinalScore(Math.max(0, score));
      setFinalXP(xp);
      setGameComplete(true);

      recordGameResult('memory', {
        won: true,
        score: Math.max(0, score),
        xp,
        time: elapsedTime,
        extraStats: {
          totalPairsMatched: totalPairs,
          bestMoves: moves
        }
      });
    }
  }, [matchedCount, totalPairs, gameComplete, moves, recordGameResult]);

  const resetGame = useCallback(() => {
    setCards(createCards(Math.floor(Math.random() * memoryCardSets.length)));
    setFlipped([]);
    setChecking(false);
    setMoves(0);
    setMatchedCount(0);
    setGameComplete(false);
    setFinalTime(null);
  }, []);

  return (
    <GameShell title="MEMORIA" icon="fas fa-th">
      {({ elapsedTime, stopTimer }) => {
        if (matchedCount >= totalPairs && !gameComplete) {
          handleGameComplete(elapsedTime, stopTimer);
        }
        return (
          <>
            <div className="memory-status">
              <div className="memory-stat">
                <span className="memory-stat-label">PARES</span>
                <span className="memory-stat-value neon-text-cyan">{matchedCount}/{totalPairs}</span>
              </div>
              <div className="memory-stat">
                <span className="memory-stat-label">MOVIMIENTOS</span>
                <span className="memory-stat-value neon-text-yellow">{moves}</span>
              </div>
            </div>

            <MemoryBoard cards={cards} onCardClick={handleCardClick} />

            {gameComplete && (
              <GameCompleteModal
                score={finalScore}
                xp={finalXP}
                time={finalTime}
                message={moves <= 12 ? 'Memoria perfecta!' : 'Bien hecho!'}
                onPlayAgain={resetGame}
              />
            )}
          </>
        );
      }}
    </GameShell>
  );
}
