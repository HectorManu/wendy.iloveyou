import { h } from 'preact';
import { useState, useCallback, useEffect, useRef } from 'preact/hooks';
import { GameShell } from '../game-shared/game-shell';
import { GameCompleteModal } from '../game-shared/game-complete-modal';
import { TriviaQuestion } from './trivia-question';
import { TriviaResult } from './trivia-result';
import { useGameProgress } from '../../hooks/use-game-progress';
import { triviaQuestions } from '../../data/trivia-questions';
import '../../styles/trivia.css';

function pickRandom(arr, count) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function TriviaGame() {
  const { recordGameResult } = useGameProgress();
  const TOTAL = 10;
  const [questions, setQuestions] = useState(() => pickRandom(triviaQuestions, TOTAL));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [finalXP, setFinalXP] = useState(0);
  const [finalTime, setFinalTime] = useState(null);
  const timerRef = useRef({ elapsed: 0, stop: null });

  const handleAnswer = useCallback((selectedIndex) => {
    const question = questions[currentIndex];
    const isCorrect = selectedIndex === question.correctIndex;
    const newAnswers = [...answers, { questionId: question.id, selected: selectedIndex, correct: isCorrect }];
    setAnswers(newAnswers);

    setTimeout(() => {
      if (currentIndex + 1 >= questions.length) {
        setShowResults(true);
      } else {
        setCurrentIndex(currentIndex + 1);
      }
    }, 1500);
  }, [currentIndex, questions, answers]);

  // Handle finish when results are shown
  useEffect(() => {
    if (showResults && !gameComplete && timerRef.current.stop) {
      timerRef.current.stop();
      const elapsedTime = timerRef.current.elapsed;
      const correct = answers.filter(a => a.correct).length;
      const score = correct * 100;
      let xp = correct * 12;
      if (correct >= 7) xp += 100;
      if (correct === TOTAL) xp += 120;

      setFinalTime(elapsedTime);
      setFinalScore(score);
      setFinalXP(xp);
      setGameComplete(true);

      recordGameResult('trivia', {
        won: correct >= 7,
        score,
        xp,
        time: elapsedTime,
        extraStats: {
          totalCorrect: correct,
          totalAnswered: TOTAL,
          bestScore: Math.round((correct / TOTAL) * 100)
        }
      });
    }
  }, [showResults, gameComplete, answers, recordGameResult]);

  const resetGame = useCallback(() => {
    setQuestions(pickRandom(triviaQuestions, TOTAL));
    setCurrentIndex(0);
    setAnswers([]);
    setShowResults(false);
    setGameComplete(false);
    setFinalTime(null);
  }, []);

  const correct = answers.filter(a => a.correct).length;

  return (
    <GameShell title="TRIVIA" icon="fas fa-question-circle">
      {({ elapsedTime, stopTimer }) => {
        timerRef.current.elapsed = elapsedTime;
        timerRef.current.stop = stopTimer;
        return (
          <>
            {!showResults ? (
              <>
                <div className="trivia-progress">
                  <span className="trivia-progress-text">
                    PREGUNTA <span className="neon-text-cyan">{currentIndex + 1}</span> / {TOTAL}
                  </span>
                  <div className="trivia-progress-bar">
                    <div
                      className="trivia-progress-fill"
                      style={{ width: `${((currentIndex) / TOTAL) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <TriviaQuestion
                  question={questions[currentIndex]}
                  onAnswer={handleAnswer}
                  answered={answers.length > currentIndex}
                  selectedAnswer={answers[currentIndex]?.selected ?? null}
                />
              </>
            ) : (
              <>
                <TriviaResult
                  answers={answers}
                  questions={questions}
                  total={TOTAL}
                />
                {gameComplete && (
                  <GameCompleteModal
                    score={finalScore}
                    xp={finalXP}
                    time={finalTime}
                    message={correct === TOTAL ? 'Perfecto! Sabes todo!' : correct >= 7 ? 'Muy bien!' : 'Sigue practicando!'}
                    onPlayAgain={resetGame}
                  />
                )}
              </>
            )}
          </>
        );
      }}
    </GameShell>
  );
}
