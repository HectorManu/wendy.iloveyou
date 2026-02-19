import { h } from 'preact';

export function CrosswordClues({ across, down, solvedClues, activeClue, onClueSelect }) {
  const isActive = (clue, direction) => {
    return activeClue && activeClue.number === clue.number && activeClue.direction === direction;
  };

  const isSolved = (clue, direction) => {
    return solvedClues.includes(`${clue.number}-${direction}`);
  };

  return (
    <div className="cw-clues">
      <div className="cw-clue-section">
        <h4 className="cw-clue-header neon-text-cyan">HORIZONTAL</h4>
        {across.map(clue => (
          <div
            key={clue.number}
            className={`cw-clue-item ${isActive(clue, 'across') ? 'active' : ''} ${isSolved(clue, 'across') ? 'solved' : ''}`}
            onClick={() => onClueSelect({ ...clue, direction: 'across' })}
          >
            <span className="cw-clue-num">{clue.number}.</span>
            <span className="cw-clue-text">{clue.clue}</span>
            {isSolved(clue, 'across') && <i className="fas fa-check cw-clue-check"></i>}
          </div>
        ))}
      </div>
      <div className="cw-clue-section">
        <h4 className="cw-clue-header neon-text-yellow">VERTICAL</h4>
        {down.map(clue => (
          <div
            key={clue.number}
            className={`cw-clue-item ${isActive(clue, 'down') ? 'active' : ''} ${isSolved(clue, 'down') ? 'solved' : ''}`}
            onClick={() => onClueSelect({ ...clue, direction: 'down' })}
          >
            <span className="cw-clue-num">{clue.number}.</span>
            <span className="cw-clue-text">{clue.clue}</span>
            {isSolved(clue, 'down') && <i className="fas fa-check cw-clue-check"></i>}
          </div>
        ))}
      </div>
    </div>
  );
}
