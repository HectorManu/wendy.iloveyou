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
  const [hintsUsed, setHintsUsed] = useState([]);
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

  // Hint: reveal first letter of active clue
  const handleHint = useCallback(() => {
    if (!activeClue) return;
    const key = `${activeClue.number}-${activeClue.direction}`;
    if (hintsUsed.includes(key)) return;

    const r = activeClue.row;
    const c = activeClue.col;
    const firstLetter = activeClue.answer[0];

    const newGrid = playerGrid.map(row => [...row]);
    newGrid[r][c] = firstLetter;
    setPlayerGrid(newGrid);
    setHintsUsed(prev => [...prev, key]);

    // Check if this completes any clue
    allClues.forEach(clue => {
      const clueKey = `${clue.number}-${clue.direction}`;
      if (solvedClues.includes(clueKey)) return;
      let word = '';
      for (let i = 0; i < clue.length; i++) {
        const cr = clue.direction === 'across' ? clue.row : clue.row + i;
        const cc = clue.direction === 'across' ? clue.col + i : clue.col;
        word += newGrid[cr][cc];
      }
      if (word === clue.answer) {
        setSolvedClues(prev => [...prev, clueKey]);
      }
    });
  }, [activeClue, hintsUsed, playerGrid, allClues, solvedClues]);

  const handleGameComplete = useCallback((elapsedTime, stopTimer) => {
    if (gameComplete) return;
    stopTimer();
    const totalClues = allClues.length;
    const score = (totalClues * 150) + Math.max(0, (600 - elapsedTime) * 2) - (hintsUsed.length * 30);
    let xp = totalClues * 15 + 150;
    if (elapsedTime < 300) xp += 75;
    xp -= hintsUsed.length * 5;

    setFinalTime(elapsedTime);
    setFinalScore(Math.max(0, score));
    setFinalXP(Math.max(xp, totalClues * 10));
    setGameComplete(true);

    recordGameResult('crossword', {
      won: true,
      score: Math.max(0, score),
      xp: Math.max(xp, totalClues * 10),
      time: elapsedTime,
      extraStats: {
        totalCluesSolved: totalClues,
        puzzlesCompleted: [puzzle.id]
      }
    });
  }, [gameComplete, allClues, puzzle, hintsUsed, recordGameResult]);

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
    setHintsUsed([]);
    setGameComplete(false);
    setFinalTime(null);
  }, []);

  const numberMap = useMemo(() => {
    const map = {};
    allClues.forEach(clue => {
      const key = `${clue.row}-${clue.col}`;
      if (!map[key]) map[key] = clue.number;
    });
    return map;
  }, [allClues]);

  const activeClueKey = activeClue ? `${activeClue.number}-${activeClue.direction}` : null;
  const hintAlreadyUsed = activeClueKey ? hintsUsed.includes(activeClueKey) : false;
  const clueAlreadySolved = activeClueKey ? solvedClues.includes(activeClueKey) : false;

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

            {/* Active clue bar - visible on mobile */}
            {activeClue && (
              <div className="cw-active-clue pixel-border">
                <div className="cw-active-clue-info">
                  <span className="cw-active-clue-num neon-text-yellow">
                    {activeClue.number}. {activeClue.direction === 'across' ? '\u2192' : '\u2193'}
                  </span>
                  <span className="cw-active-clue-text">{activeClue.clue}</span>
                </div>
                {activeClue.hint && !clueAlreadySolved && (
                  <button
                    className={`cw-hint-btn pixel-border ${hintAlreadyUsed ? 'used' : ''}`}
                    onClick={handleHint}
                    disabled={hintAlreadyUsed}
                  >
                    <i className="fas fa-lightbulb"></i>
                    {hintAlreadyUsed ? ' USADA' : ' PISTA'}
                  </button>
                )}
              </div>
            )}

            {/* Hint text when used */}
            {activeClue && activeClue.hint && hintAlreadyUsed && !clueAlreadySolved && (
              <div className="cw-hint-text neon-text-yellow">
                <i className="fas fa-lightbulb"></i> {activeClue.hint}
              </div>
            )}

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
                message={hintsUsed.length === 0 ? 'Sin pistas! Increible!' : 'Crucigrama completado!'}
                onPlayAgain={resetGame}
              />
            )}
          </>
        );
      }}
    </GameShell>
  );
}
