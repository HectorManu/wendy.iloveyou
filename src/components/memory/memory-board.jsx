import { h } from 'preact';
import { MemoryCard } from './memory-card';

export function MemoryBoard({ cards, onCardClick }) {
  return (
    <div className="memory-board">
      {cards.map((card, index) => (
        <MemoryCard
          key={card.uid}
          card={card}
          onClick={() => onCardClick(index)}
        />
      ))}
    </div>
  );
}
