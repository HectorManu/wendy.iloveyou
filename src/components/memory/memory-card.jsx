import { h } from 'preact';

export function MemoryCard({ card, onClick }) {
  const isRevealed = card.isFlipped || card.isMatched;

  return (
    <div
      className={`memory-card-wrapper ${isRevealed ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`}
      onClick={onClick}
      style={card.isMatched ? { '--match-color': card.color } : {}}
    >
      <div className="memory-card-inner">
        <div className="memory-card-front pixel-border">
          <span className="card-question">?</span>
        </div>
        <div className="memory-card-back pixel-border" style={{ borderColor: card.color }}>
          {card.icon ? (
            <i className={card.icon} style={{ color: card.color }}></i>
          ) : (
            <span className="card-symbol" style={{ color: card.color }}>{card.symbol}</span>
          )}
        </div>
      </div>
    </div>
  );
}
