import { h } from 'preact';

export function WordSearchGrid({ grid, selection, foundCells, onCellSelect }) {
  const isSelected = (r, c) => {
    if (!selection) return false;
    return r === selection.startRow && c === selection.startCol;
  };

  const isFound = (r, c) => foundCells.has(`${r}-${c}`);

  return (
    <div className="ws-grid">
      {grid.map((row, r) => (
        <div key={r} className="ws-row">
          {row.map((letter, c) => (
            <button
              key={c}
              className={`ws-cell ${isSelected(r, c) ? 'selected' : ''} ${isFound(r, c) ? 'found' : ''}`}
              onClick={() => onCellSelect(r, c)}
            >
              {letter}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
