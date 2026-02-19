import { h } from 'preact';
import { useState } from 'preact/hooks';

export function TriviaQuestion({ question, onAnswer, answered, selectedAnswer }) {
  const [selected, setSelected] = useState(null);

  const handleSelect = (index) => {
    if (answered || selected !== null) return;
    setSelected(index);
    onAnswer(index);
    // Reset for next question
    setTimeout(() => setSelected(null), 1600);
  };

  const getOptionClass = (index) => {
    if (selected === null && selectedAnswer === null) return '';
    const chosen = selected !== null ? selected : selectedAnswer;
    if (chosen === null) return '';
    if (index === question.correctIndex) return 'correct';
    if (index === chosen && chosen !== question.correctIndex) return 'incorrect';
    return 'dimmed';
  };

  return (
    <div className="trivia-question-card pixel-border">
      <div className="trivia-category">{question.category.toUpperCase()}</div>
      <h3 className="trivia-question-text">{question.question}</h3>
      <div className="trivia-options">
        {question.options.map((option, i) => (
          <button
            key={i}
            className={`trivia-option pixel-border ${getOptionClass(i)}`}
            onClick={() => handleSelect(i)}
            disabled={selected !== null}
          >
            <span className="option-letter">{String.fromCharCode(65 + i)}</span>
            <span className="option-text">{option}</span>
          </button>
        ))}
      </div>
      {selected !== null && (
        <p className="trivia-explanation">
          {selected === question.correctIndex ? '\u2713 ' : '\u2717 '}
          {question.explanation}
        </p>
      )}
    </div>
  );
}
