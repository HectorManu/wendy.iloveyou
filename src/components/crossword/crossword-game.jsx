import { h } from 'preact';
import { useState, useCallback, useMemo } from 'preact/hooks';
import { GameShell } from '../game-shared/game-shell';
import { GameCompleteModal } from '../game-shared/game-complete-modal';
import { CrosswordGrid } from './crossword-grid';
import { CrosswordClues } from './crossword-clues';
import { useGameProgress } from '../../hooks/use-game-progress';
import { crosswordPuzzles } from '../../data/crossword-puzzles';
import '../../styles/crossword.css';

export function CrosswordGame() {
  const { recordGameResult } = useGameProgress();
  const [puzzleIndex, setPuzzleIndex] = useState(() => Math.floor(Math.random() * crosswordPuzzles.length));
  const puzzle = crosswordPuzzles[puzzleIndex];
  const size = puzzle.gridSize;

  const [playerGrid, setPlayerGrid] = useState(() =>
    Array.from({ length: size }, (_, r) =>
      Array.from({ length: size }, (_, c) =>
        puzzle.solution[r][c] === '#' ? '#' : ''
      )
    )
  );

  const allClues = useMemo(() => [
    ...puzzle.clues.across.map(c => ({ ...c, direction: 'across' })),
    ...puzzle.clues.down.map(c => ({ ...c, direction: 'down' }))
  ], [puzzle]);

  const [activeClue, setActiveClue] = useState(null);
  const [solvedClues, setSolvedClues] = useState([]);
  const [gameComplete, setGameComplete] = useState(false);
  const [finalTime, setFinalTime] = useState(null);
  const [finalScore, setFinalScore] = useState(0);
  const [finalXP, setFinalXP] = useState(0);

  const activeCells = useMemo(() => {
    if (!activeClue) return [];
    const cells = [];
    for (let i = 0; i < activeClue.length; i++) {
      const r = activeClue.direction === 'across' ? activeClue.row : activeClue.row + i;
      const c = activeClue.direction === 'across' ? activeClue.col + i : activeClue.col;
      cells.push({ r, c });
    }
    return cells;
  }, [activeClue]);

  const solvedCells = useMemo(() => {
    const cells = new Set();
    solvedClues.forEach(clueKey => {
      const clue = allClues.find(c => `${c.number}-${c.direction}` === clueKey);
      if (clue) {
        for (let i = 0; i < clue.length; i++) {
          const r = clue.direction === 'across' ? clue.row : clue.row + i;
          const c = clue.direction === 'across' ? clue.col + i : clue.col;
          cells.add(`${r}-${c}`);
        }
      }
    });
    return cells;
  }, [solvedClues, allClues]);

  const handleClueSelect = useCallback((clue) => {
    setActiveClue(clue);
  }, []);

  const handleCellInput = useCallback((row, col, value) => {
    const newGrid = playerGrid.map(r => [...r]);
    newGrid[row][col] = value.toUpperCase();
    setPlayerGrid(newGrid);

    // Check if any clue is now complete and correct
    allClues.forEach(clue => {
      const key = `${clue.number}-${clue.direction}`;
      if (solvedClues.includes(key)) return;

      let word = '';
      for (let i = 0; i < clue.length; i++) {
        const r = clue.direction === 'across' ? clue.row : clue.row + i;
        const c = clue.direction === 'across' ? clue.col + i : clue.col;
        word += newGrid[r][c];
      }

      if (word === clue.answer) {
        setSolvedClues(prev => [...prev, key]);
      }
    });
  }, [playerGrid, allClues, solvedClues]);

  const handleCellClick = useCallback((row, col) => {
    // Find a clue that passes through this cell
    const matching = allClues.find(clue => {
      for (let i = 0; i < clue.length; i++) {
        const r = clue.direction === 'across' ? clue.row : clue.row + i;
        const c = clue.direction === 'across' ? clue.col + i : clue.col;
        if (r === row && c === col) return true;
      }
      return false;
    });
    if (matching) setActiveClue(matching);
  }, [allClues]);

  const handleGameComplete = useCallback((elapsedTime, stopTimer) => {
    if (gameComplete) return;
    stopTimer();
    const totalClues = allClues.length;
    const score = (totalClues * 150) + Math.max(0, (600 - elapsedTime) * 2);
    let xp = totalClues * 15 + 150;
    if (elapsedTime < 300) xp += 75;

    setFinalTime(elapsedTime);
    setFinalScore(Math.max(0, score));
    setFinalXP(xp);
    setGameComplete(true);

    recordGameResult('crossword', {
      won: true,
      score: Math.max(0, score),
      xp,
      time: elapsedTime,
      extraStats: {
        totalCluesSolved: totalClues,
        puzzlesCompleted: [puzzle.id]
      }
    });
  }, [gameComplete, allClues, puzzle, recordGameResult]);

  const resetGame = useCallback(() => {
    const newIndex = Math.floor(Math.random() * crosswordPuzzles.length);
    const newPuzzle = crosswordPuzzles[newIndex];
    setPuzzleIndex(newIndex);
    setPlayerGrid(
      Array.from({ length: newPuzzle.gridSize }, (_, r) =>
        Array.from({ length: newPuzzle.gridSize }, (_, c) =>
          newPuzzle.solution[r][c] === '#' ? '#' : ''
        )
      )
    );
    setActiveClue(null);
    setSolvedClues([]);
    setGameComplete(false);
    setFinalTime(null);
  }, []);

  // Number map for grid
  const numberMap = useMemo(() => {
    const map = {};
    allClues.forEach(clue => {
      const key = `${clue.row}-${clue.col}`;
      if (!map[key]) map[key] = clue.number;
    });
    return map;
  }, [allClues]);

  return (
    <GameShell title="CRUCIGRAMA" icon="fas fa-border-all">
      {({ elapsedTime, stopTimer }) => {
        if (solvedClues.length >= allClues.length && allClues.length > 0 && !gameComplete) {
          handleGameComplete(elapsedTime, stopTimer);
        }
        return (
          <>
            <div className="cw-puzzle-name neon-text-purple">{puzzle.name}</div>
            <div className="cw-progress">
              {solvedClues.length} / {allClues.length} pistas resueltas
            </div>

            <div className="cw-layout">
              <CrosswordGrid
                grid={playerGrid}
                size={size}
                numberMap={numberMap}
                activeCells={activeCells}
                solvedCells={solvedCells}
                onCellInput={handleCellInput}
                onCellClick={handleCellClick}
              />
              <CrosswordClues
                across={puzzle.clues.across}
                down={puzzle.clues.down}
                solvedClues={solvedClues}
                activeClue={activeClue}
                onClueSelect={handleClueSelect}
              />
            </div>

            {gameComplete && (
              <GameCompleteModal
                score={finalScore}
                xp={finalXP}
                time={finalTime}
                message="Crucigrama completado!"
                onPlayAgain={resetGame}
              />
            )}
          </>
        );
      }}
    </GameShell>
  );
}
