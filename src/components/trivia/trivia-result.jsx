import { h } from 'preact';

export function TriviaResult({ answers, questions, total }) {
  const correct = answers.filter(a => a.correct).length;
  const percentage = Math.round((correct / total) * 100);

  return (
    <div className="trivia-results pixel-border">
      <h3 className="results-title neon-text-yellow">RESULTADOS</h3>
      <div className="results-score">
        <span className="results-percentage neon-text-cyan">{percentage}%</span>
        <span className="results-fraction">{correct} / {total} correctas</span>
      </div>
      <div className="results-breakdown">
        {answers.map((answer, i) => (
          <div key={i} className={`result-item ${answer.correct ? 'correct' : 'incorrect'}`}>
            <span className="result-num">Q{i + 1}</span>
            <span className="result-icon">{answer.correct ? '\u2713' : '\u2717'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
