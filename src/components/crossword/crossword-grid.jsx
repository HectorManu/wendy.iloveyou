import { h } from 'preact';
import { useRef } from 'preact/hooks';

export function CrosswordGrid({ grid, size, numberMap, activeCells, solvedCells, onCellInput, onCellClick }) {
  const inputRefs = useRef({});

  const isActive = (r, c) => activeCells.some(cell => cell.r === r && cell.c === c);
  const isSolved = (r, c) => solvedCells.has(`${r}-${c}`);

  const handleKeyDown = (r, c, e) => {
    if (e.key === 'Backspace') {
      onCellInput(r, c, '');
    }
  };

  const handleInput = (r, c, e) => {
    const val = e.target.value.slice(-1);
    if (/^[A-Za-z]$/.test(val)) {
      onCellInput(r, c, val);
      // Move to next cell in active direction
      const activeIdx = activeCells.findIndex(cell => cell.r === r && cell.c === c);
      if (activeIdx >= 0 && activeIdx < activeCells.length - 1) {
        const next = activeCells[activeIdx + 1];
        const key = `${next.r}-${next.c}`;
        if (inputRefs.current[key]) {
          inputRefs.current[key].focus();
        }
      }
    }
  };

  return (
    <div className="cw-grid" style={{ '--cw-size': size }}>
      {grid.map((row, r) =>
        row.map((cell, c) => {
          if (cell === '#') {
            return <div key={`${r}-${c}`} className="cw-cell black"></div>;
          }
          const num = numberMap[`${r}-${c}`];
          const active = isActive(r, c);
          const solved = isSolved(r, c);
          return (
            <div
              key={`${r}-${c}`}
              className={`cw-cell ${active ? 'active' : ''} ${solved ? 'solved' : ''}`}
              onClick={() => onCellClick(r, c)}
            >
              {num && <span className="cw-cell-number">{num}</span>}
              <input
                ref={el => { inputRefs.current[`${r}-${c}`] = el; }}
                className="cw-cell-input"
                type="text"
                maxLength={2}
                value={cell}
                onKeyDown={(e) => handleKeyDown(r, c, e)}
                onInput={(e) => handleInput(r, c, e)}
                disabled={solved}
              />
            </div>
          );
        })
      )}
    </div>
  );
}
