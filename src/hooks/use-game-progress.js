import { useState, useEffect, useCallback } from 'preact/hooks';

const STORAGE_KEY = 'nuestroAmor_gameProgress';

const DEFAULT_PROGRESS = {
  player: {
    level: 1,
    totalXP: 0,
    gamesPlayed: 0,
    gamesWon: 0,
    lastPlayed: null,
    achievements: []
  },
  games: {
    wordSearch: { played: 0, won: 0, bestTime: null, totalWordsFound: 0, puzzlesCompleted: [], highScore: 0, lastScore: 0, xpEarned: 0 },
    crossword: { played: 0, won: 0, bestTime: null, totalCluesSolved: 0, puzzlesCompleted: [], highScore: 0, lastScore: 0, xpEarned: 0 },
    memory: { played: 0, won: 0, bestTime: null, bestMoves: null, totalPairsMatched: 0, highScore: 0, lastScore: 0, xpEarned: 0 },
    trivia: { played: 0, won: 0, bestScore: 0, totalCorrect: 0, totalAnswered: 0, highScore: 0, lastScore: 0, xpEarned: 0 }
  }
};

function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(saved);
    return {
      player: { ...DEFAULT_PROGRESS.player, ...parsed.player },
      games: {
        wordSearch: { ...DEFAULT_PROGRESS.games.wordSearch, ...(parsed.games?.wordSearch || {}) },
        crossword: { ...DEFAULT_PROGRESS.games.crossword, ...(parsed.games?.crossword || {}) },
        memory: { ...DEFAULT_PROGRESS.games.memory, ...(parsed.games?.memory || {}) },
        trivia: { ...DEFAULT_PROGRESS.games.trivia, ...(parsed.games?.trivia || {}) }
      }
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function useGameProgress() {
  const [progress, setProgress] = useState(loadProgress);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const getPlayerLevel = useCallback(() => {
    return Math.floor(progress.player.totalXP / 500) + 1;
  }, [progress.player.totalXP]);

  const getLevelProgress = useCallback(() => {
    return (progress.player.totalXP % 500) / 500 * 100;
  }, [progress.player.totalXP]);

  const recordGameResult = useCallback((gameKey, result) => {
    setProgress(prev => {
      const game = { ...prev.games[gameKey] };
      const player = { ...prev.player };

      game.played += 1;
      game.lastScore = result.score || 0;
      game.xpEarned += result.xp || 0;

      if (result.score > game.highScore) game.highScore = result.score;

      if (result.won) {
        game.won += 1;
        player.gamesWon += 1;
        if (result.time != null) {
          if (game.bestTime === null || result.time < game.bestTime) {
            game.bestTime = result.time;
          }
        }
      }

      if (result.extraStats) {
        Object.keys(result.extraStats).forEach(key => {
          if (key === 'bestMoves' && result.extraStats[key] != null) {
            if (game.bestMoves === null || result.extraStats[key] < game.bestMoves) {
              game.bestMoves = result.extraStats[key];
            }
          } else if (Array.isArray(game[key]) && Array.isArray(result.extraStats[key])) {
            game[key] = [...new Set([...game[key], ...result.extraStats[key]])];
          } else if (typeof game[key] === 'number' && typeof result.extraStats[key] === 'number') {
            game[key] += result.extraStats[key];
          }
        });
      }

      player.totalXP += result.xp || 0;
      player.gamesPlayed += 1;
      player.lastPlayed = new Date().toISOString();
      player.level = Math.floor(player.totalXP / 500) + 1;

      return {
        player,
        games: { ...prev.games, [gameKey]: game }
      };
    });
  }, []);

  const unlockAchievement = useCallback((achievementId) => {
    setProgress(prev => {
      if (prev.player.achievements.includes(achievementId)) return prev;
      return {
        ...prev,
        player: {
          ...prev.player,
          achievements: [...prev.player.achievements, achievementId]
        }
      };
    });
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(DEFAULT_PROGRESS);
  }, []);

  const getGameStats = useCallback((gameKey) => {
    return progress.games[gameKey] || {};
  }, [progress]);

  return {
    progress,
    getPlayerLevel,
    getLevelProgress,
    recordGameResult,
    unlockAchievement,
    resetProgress,
    getGameStats
  };
}
