export const wordSearchPuzzles = [
  {
    id: 'ws-001',
    name: 'AMOR ETERNO',
    words: ['AMOR', 'BESO', 'CITA', 'ROSA', 'LUNA', 'VIDA', 'ALMA', 'MIEL']
  },
  {
    id: 'ws-002',
    name: 'MOMENTOS JUNTOS',
    words: ['ABRAZO', 'PASEO', 'RISA', 'DULCE', 'SUENO', 'CIELO', 'FLOR']
  },
  {
    id: 'ws-003',
    name: 'SENTIMIENTOS',
    words: ['CARINO', 'TERNURA', 'PASION', 'MAGIA', 'BRILLO', 'FUEGO', 'LUZ']
  },
  {
    id: 'ws-004',
    name: 'PARA SIEMPRE',
    words: ['ANILLO', 'PROMESA', 'FUTURO', 'HOGAR', 'JUNTOS', 'LAZO', 'FE']
  }
];

const GRID_SIZE = 10;
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function randomLetter() {
  return LETTERS[Math.floor(Math.random() * LETTERS.length)];
}

export function generateGrid(words) {
  const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));
  const placements = [];

  const sortedWords = [...words].sort((a, b) => b.length - a.length);

  for (const word of sortedWords) {
    let placed = false;
    const directions = Math.random() > 0.5
      ? ['horizontal', 'vertical']
      : ['vertical', 'horizontal'];

    for (let attempt = 0; attempt < 150 && !placed; attempt++) {
      const dir = directions[attempt % 2];
      let row, col;

      if (dir === 'horizontal') {
        row = Math.floor(Math.random() * GRID_SIZE);
        col = Math.floor(Math.random() * (GRID_SIZE - word.length + 1));
      } else {
        row = Math.floor(Math.random() * (GRID_SIZE - word.length + 1));
        col = Math.floor(Math.random() * GRID_SIZE);
      }

      let canPlace = true;
      for (let i = 0; i < word.length; i++) {
        const r = dir === 'horizontal' ? row : row + i;
        const c = dir === 'horizontal' ? col + i : col;
        if (grid[r][c] !== null && grid[r][c] !== word[i]) {
          canPlace = false;
          break;
        }
      }

      if (canPlace) {
        for (let i = 0; i < word.length; i++) {
          const r = dir === 'horizontal' ? row : row + i;
          const c = dir === 'horizontal' ? col + i : col;
          grid[r][c] = word[i];
        }
        placements.push({ word, startRow: row, startCol: col, direction: dir });
        placed = true;
      }
    }

    if (!placed) {
      // Force place in first available spot
      for (let r = 0; r < GRID_SIZE && !placed; r++) {
        for (let c = 0; c <= GRID_SIZE - word.length && !placed; c++) {
          let canPlace = true;
          for (let i = 0; i < word.length; i++) {
            if (grid[r][c + i] !== null && grid[r][c + i] !== word[i]) {
              canPlace = false;
              break;
            }
          }
          if (canPlace) {
            for (let i = 0; i < word.length; i++) {
              grid[r][c + i] = word[i];
            }
            placements.push({ word, startRow: r, startCol: c, direction: 'horizontal' });
            placed = true;
          }
        }
      }
    }
  }

  // Fill empty cells
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === null) {
        grid[r][c] = randomLetter();
      }
    }
  }

  return { grid, placements };
}
