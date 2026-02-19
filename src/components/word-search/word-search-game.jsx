import { h } from 'preact';
import { useState, useCallback, useMemo } from 'preact/hooks';
import { GameShell } from '../game-shared/game-shell';
import { GameCompleteModal } from '../game-shared/game-complete-modal';
import { WordSearchGrid } from './word-search-grid';
import { WordSearchWords } from './word-search-words';
import { useGameProgress } from '../../hooks/use-game-progress';
import { wordSearchPuzzles, generateGrid } from '../../data/word-search-puzzles';
import '../../styles/word-search.css';

export function WordSearchGame() {
  const { recordGameResult } = useGameProgress();
  const [puzzleIndex, setPuzzleIndex] = useState(() => Math.floor(Math.random() * wordSearchPuzzles.length));
  const puzzle = wordSearchPuzzles[puzzleIndex];

  const [gridData, setGridData] = useState(() => generateGrid(puzzle.words));
  const [foundWords, setFoundWords] = useState([]);
  const [selection, setSelection] = useState(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [finalTime, setFinalTime] = useState(null);
  const [finalScore, setFinalScore] = useState(0);
  const [finalXP, setFinalXP] = useState(0);

  const foundCells = useMemo(() => {
    const cells = new Set();
    gridData.placements.forEach(p => {
      if (foundWords.includes(p.word)) {
        for (let i = 0; i < p.word.length; i++) {
          const r = p.direction === 'horizontal' ? p.startRow : p.startRow + i;
          const c = p.direction === 'horizontal' ? p.startCol + i : p.startCol;
          cells.add(`${r}-${c}`);
        }
      }
    });
    return cells;
  }, [foundWords, gridData.placements]);

  const handleCellSelect = useCallback((row, col) => {
    if (!selection) {
      setSelection({ startRow: row, startCol: col, endRow: row, endCol: col });
    } else {
      // Check if valid line (same row or same col)
      const sRow = selection.startRow;
      const sCol = selection.startCol;

      if (sRow !== row && sCol !== col) {
        // Not a straight line, reset
        setSelection(null);
        return;
      }

      // Extract selected letters
      let letters = '';
      const cells = [];
      if (sRow === row) {
        // horizontal
        const minC = Math.min(sCol, col);
        const maxC = Math.max(sCol, col);
        for (let c = minC; c <= maxC; c++) {
          letters += gridData.grid[row][c];
          cells.push({ r: row, c });
        }
      } else {
        // vertical
        const minR = Math.min(sRow, row);
        const maxR = Math.max(sRow, row);
        for (let r = minR; r <= maxR; r++) {
          letters += gridData.grid[r][col];
          cells.push({ r, c: col });
        }
      }

      // Check both directions
      const lettersReverse = letters.split('').reverse().join('');
      const matchedWord = puzzle.words.find(w =>
        !foundWords.includes(w) && (w === letters || w === lettersReverse)
      );

      if (matchedWord) {
        setFoundWords(prev => [...prev, matchedWord]);
      }

      setSelection(null);
    }
  }, [selection, gridData, puzzle.words, foundWords]);

  const handleComplete = useCallback((elapsedTime, stopTimer) => {
    if (gameComplete) return;
    stopTimer();
    const wordsCount = puzzle.words.length;
    const score = (wordsCount * 100) + Math.max(0, (300 - elapsedTime) * 2);
    let xp = wordsCount * 10 + 100;
    if (elapsedTime < 120) xp += 50;

    setFinalTime(elapsedTime);
    setFinalScore(Math.max(0, score));
    setFinalXP(xp);
    setGameComplete(true);

    recordGameResult('wordSearch', {
      won: true,
      score: Math.max(0, score),
      xp,
      time: elapsedTime,
      extraStats: {
        totalWordsFound: wordsCount,
        puzzlesCompleted: [puzzle.id]
      }
    });
  }, [gameComplete, puzzle, recordGameResult]);

  const resetGame = useCallback(() => {
    const newIndex = Math.floor(Math.random() * wordSearchPuzzles.length);
    const newPuzzle = wordSearchPuzzles[newIndex];
    setPuzzleIndex(newIndex);
    setGridData(generateGrid(newPuzzle.words));
    setFoundWords([]);
    setSelection(null);
    setGameComplete(false);
    setFinalTime(null);
  }, []);

  return (
    <GameShell title="SOPA DE LETRAS" icon="fas fa-search">
      {({ elapsedTime, stopTimer }) => {
        if (foundWords.length >= puzzle.words.length && !gameComplete) {
          handleComplete(elapsedTime, stopTimer);
        }
        return (
          <>
            <div className="ws-puzzle-name neon-text-yellow">{puzzle.name}</div>

            <div className="ws-layout">
              <WordSearchGrid
                grid={gridData.grid}
                selection={selection}
                foundCells={foundCells}
                onCellSelect={handleCellSelect}
              />
              <WordSearchWords
                words={puzzle.words}
                foundWords={foundWords}
              />
            </div>

            {gameComplete && (
              <GameCompleteModal
                score={finalScore}
                xp={finalXP}
                time={finalTime}
                message="Todas las palabras encontradas!"
                onPlayAgain={resetGame}
              />
            )}
          </>
        );
      }}
    </GameShell>
  );
}
