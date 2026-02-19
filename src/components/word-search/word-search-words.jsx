import { h } from 'preact';

export function WordSearchWords({ words, foundWords }) {
  return (
    <div className="ws-words pixel-border">
      <h4 className="ws-words-title neon-text-cyan">PALABRAS</h4>
      <div className="ws-words-count">{foundWords.length} / {words.length}</div>
      <ul className="ws-word-list">
        {words.map(word => (
          <li key={word} className={`ws-word-item ${foundWords.includes(word) ? 'found' : ''}`}>
            {foundWords.includes(word) && <i className="fas fa-check"></i>}
            <span>{word}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
