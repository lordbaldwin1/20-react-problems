import { useState, useEffect } from 'react';
import { generateRandomWords } from '../utils/functions';

type GameStatus = "before" | "during" | "after";
type GameMode = "words" | "time";

interface GameState {
  status: GameStatus;
  mode: GameMode;
  time: number;
  stats: {
    wpm: number;
    rawWpm: number;
    accuracy: number;
    correct: number;
    incorrect: number;
    extra: number;
    missed: number;
  };
  wordCount: number;
  sampleText: string[];
}

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>({
    status: "after",
    mode: "words",
    time: 0,
    stats: {
      wpm: 0,
      rawWpm: 0,
      accuracy: 0,
      correct: 0,
      incorrect: 0,
      extra: 0,
      missed: 0,
    },
    wordCount: 10,
    sampleText: generateRandomWords(10).split(" ")
  });

  // Update sample text when word count changes
  useEffect(() => {
    setGameState(prev => ({
      ...prev,
      sampleText: generateRandomWords(prev.wordCount).split(" ")
    }));
  }, [gameState.wordCount]);

  useEffect(() => {
    let intervalId: number | undefined;

    if (gameState.status === "during") {
      if (gameState.mode === "time") {
        intervalId = setInterval(() => {
          setGameState(prev => {
            if (prev.time <= 1) {
              clearInterval(intervalId);
              return { ...prev, time: 0, status: "after" };
            }
            return { ...prev, time: prev.time - 1 };
          });
        }, 1000);
      } else if (gameState.mode === "words") {
        intervalId = setInterval(() => {
          setGameState(prev => ({ ...prev, time: prev.time + 1 }));
        }, 1000);
      }
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [gameState.status, gameState.mode]);

  const startGame = () => {
    setGameState(prev => ({ ...prev, status: "during" }));
  };

  const endGame = () => {
    setGameState(prev => ({ ...prev, status: "after" }));
  };

  const resetGameState = () => {
    setGameState(prev => ({
      ...prev,
      status: "before",
      time: prev.mode === "time" ? prev.time : 0,
      sampleText: generateRandomWords(prev.wordCount).split(" "),
      stats: {
        wpm: 0,
        rawWpm: 0,
        accuracy: 0,
        correct: 0,
        incorrect: 0,
        extra: 0,
        missed: 0,
      }
    }));
  };

  const calculateStats = (
    correctChars: number,
    totalChars: number,
    incorrect: number,
    extra: number,
    missed: number
  ) => {
    const timeInMinutes = gameState.time / 60;
    const correctWordCount = correctChars / 5;
    const rawWordCount = totalChars / 5;

    if (timeInMinutes === 0) return;

    const wpm = Math.floor(correctWordCount / timeInMinutes);
    const rawWpm = Math.floor(rawWordCount / timeInMinutes);
    const accuracy = correctChars / totalChars;

    setGameState(prev => ({
      ...prev,
      stats: {
        wpm,
        rawWpm,
        accuracy: Math.floor(accuracy * 100),
        correct: correctChars,
        incorrect,
        extra,
        missed,
      }
    }));
  };

  const updateGameMode = (mode: "words" | "time") => {
    setGameState(prev => ({
      ...prev,
      mode,
      time: mode === "time" ? 15 : 0
    }));
  };

  const updateTime = (time: number) => {
    setGameState(prev => ({ ...prev, time }));
  };

  const updateWordCount = (count: number) => {
    setGameState(prev => ({ ...prev, wordCount: count }));
  };

  return {
    gameState,
    startGame,
    endGame,
    resetGameState,
    calculateStats,
    updateGameMode,
    updateTime,
    updateWordCount,
  };
} 