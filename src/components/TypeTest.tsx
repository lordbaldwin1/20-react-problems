import { useEffect, useRef, useState, useMemo, useCallback, memo, forwardRef } from "react";
import { generateRandomWords } from "../utils/functions";
import { Clock, Hash } from "lucide-react";

interface LetterCount {
  correct: number;
  incorrect: number;
  extra: number;
  missed: number;
}

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
  timeLimit: number;
  sampleText: string[];
}

export default function TypeTest() {
  const [input, setInput] = useState<string>("");
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [letterCount, setLetterCount] = useState<LetterCount>({
    correct: 0,
    incorrect: 0,
    extra: 0,
    missed: 0,
  });
  const [completedWords, setCompletedWords] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeWordRef = useRef<HTMLDivElement>(null);

  // GAME STATE
  const [gameState, setGameState] = useState<GameState>({
    status: "before",
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
    timeLimit: 0,
    sampleText: generateRandomWords(10).split(" "),
  });

  // Ref/useEffect to focus input box
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to active word
  useEffect(() => {
    if (activeWordRef.current && containerRef.current) {
      activeWordRef.current.scrollIntoView({
        behavior: 'instant',
        block: 'center',
        inline: 'nearest'
      });
    }
  }, [currentWordIndex]);

  const handleEndGame = useCallback(() => {
    const characterCount = completedWords.reduce((count, string) => {
      return count + string.length;
    }, 0);
    const spaceCount = completedWords.length - 1;

    const totalCharCount = characterCount + spaceCount;

    const correctWordCount = letterCount.correct / 5;
    const rawWordCount = totalCharCount / 5;

    let timeInMinutes;
    if (gameState.mode === "time") {
      timeInMinutes = gameState.timeLimit / 60;
    } else {
      timeInMinutes = gameState.time / 60;
    }
    if (timeInMinutes === 0) return;

    const wpm = Math.floor(correctWordCount / timeInMinutes);
    const rawWpm = Math.floor(rawWordCount / timeInMinutes);
    const accuracy = letterCount.correct / totalCharCount;

    setGameState((prev) => ({
      ...prev,
      status: "after",
      stats: {
        wpm,
        rawWpm,
        accuracy: Math.floor(accuracy * 100),
        correct: letterCount.correct,
        incorrect: letterCount.incorrect,
        extra: letterCount.extra,
        missed: letterCount.missed,
      },
    }));
  }, [completedWords, letterCount, gameState.mode, gameState.time, gameState.timeLimit]);

  const startGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      status: "during",
    }));
  }, []);

  const resetGameState = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      status: "before",
      time: prev.mode === "time" ? prev.timeLimit : 0,
      sampleText: generateRandomWords(prev.wordCount).split(" "),
      stats: {
        wpm: 0,
        rawWpm: 0,
        accuracy: 0,
        correct: 0,
        incorrect: 0,
        extra: 0,
        missed: 0,
      },
    }));
  }, []);

  const updateLetterCount = useCallback((submittedWord: string[], sampleWord: string[]) => {
    if (gameState.status !== "during") {
      return;
    }
    const extraCount =
      submittedWord.length > sampleWord.length
        ? submittedWord.slice(sampleWord.length).length
        : 0;

    const missedCount =
      submittedWord.length < sampleWord.length
        ? sampleWord.length - submittedWord.length
        : 0;

    let correctCount = 0;
    let incorrectCount = 0;

    for (let i = 0; i < submittedWord.length; i++) {
      if (submittedWord[i] === sampleWord[i]) {
        correctCount++;
      } else if (submittedWord[i] !== sampleWord[i]) {
        incorrectCount++;
      }
    }

    setLetterCount((prev) => ({
      correct: prev.correct + correctCount,
      incorrect: prev.incorrect + incorrectCount,
      extra: prev.extra + extraCount,
      missed: prev.missed + missedCount,
    }));
  }, [gameState.status]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (completedWords.length === 0) {
      startGame();
    }
    if (newValue.length > 0 && newValue[newValue.length - 1] === " ") {
      return;
    }

    if (
      gameState.sampleText.length - 1 === completedWords.length &&
      gameState.sampleText[gameState.sampleText.length - 1] === newValue
    ) {
      updateLetterCount(
        newValue.split(""),
        gameState.sampleText[gameState.sampleText.length - 1].split("")
      );
      handleEndGame();
    }
    setInput(newValue);
  }, [completedWords.length, gameState.sampleText, startGame, updateLetterCount, handleEndGame]);

  const handleSubmit = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " " && input.length > 0) {
      const newCompletedWords = [...completedWords, input];
      setInput("");
      setCompletedWords(newCompletedWords);
      setCurrentWordIndex(currentWordIndex + 1);

      const submittedWord = newCompletedWords[newCompletedWords.length - 1].split("");
      const sampleWord = gameState.sampleText[newCompletedWords.length - 1].split("");
      updateLetterCount(submittedWord, sampleWord);

      if (newCompletedWords.length === gameState.sampleText.length) {
        handleEndGame();
      }
    } else if (e.key === "Backspace" && input.length === 0 && completedWords.length > 0) {
      e.preventDefault();
      const newCompletedWords = completedWords.slice(0, completedWords.length - 1);
      setInput(completedWords[completedWords.length - 1]);
      setCurrentWordIndex(currentWordIndex - 1);
      setCompletedWords(newCompletedWords);
      // UPDATE LETTER COUNT HERE TODO!!!!
    }
  }, [input, completedWords, currentWordIndex, gameState.sampleText, updateLetterCount, handleEndGame]);

  const handleGameAreaClick = useCallback(() => {
    if (gameState.status === "during" || gameState.status === "before") {
      inputRef.current?.focus();
    }
  }, [gameState.status]);

  if (gameState.mode === "time" && gameState.time === 0 && gameState.status === "during") {
    handleEndGame();
  }
  // Focus input when game starts or resets
  useEffect(() => {
    if (gameState.status === "during" || gameState.status === "before") {
      inputRef.current?.focus();
    }
  }, [gameState.status]);

  // Timers
  useEffect(() => {
    let intervalId: number | undefined;

    if (gameState.status === "during" && gameState.mode === "words") {
      intervalId = setInterval(() => {
        setGameState((prev) => ({
          ...prev,
          time: prev.time + 1,
        }));
      }, 1000);
    }

    if (gameState.status === "during" && gameState.mode === "time") {
      intervalId = setInterval(() => {
        setGameState((prev) => ({
          ...prev,
          time: prev.time - 1,
        }));
      }, 1000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [gameState.status, gameState.mode]);

  // Reset typing states when game status changes
  useEffect(() => {
    if (gameState.status === "during") return;

    setCompletedWords([]);
    setInput("");
    setCurrentWordIndex(0);
    setLetterCount({
      correct: 0,
      incorrect: 0,
      extra: 0,
      missed: 0,
    });
  }, [
    gameState.status,
    gameState.mode,
    gameState.timeLimit,
    gameState.wordCount,
  ]);

  const memoizedGameModeConfig = useMemo(() => (
    <GameModeConfig
      mode={gameState.mode}
      setGameMode={(mode) => setGameState((prev) => ({ ...prev, mode }))}
      timeLimit={gameState.timeLimit}
      wordCount={gameState.wordCount}
      setTimeLimit={(time) => setGameState((prev) => ({ ...prev, timeLimit: time }))}
      setWordCount={(count) => setGameState((prev) => ({ ...prev, wordCount: count }))}
      resetGameState={resetGameState}
    />
  ), [gameState.mode, gameState.timeLimit, gameState.wordCount, resetGameState]);

  return (
    <div className="flex flex-col items-center mt-10" onClick={handleGameAreaClick}>
      {gameState.status === "after" && (
        <div className="flex flex-col items-center gap-4 p-6 bg-gray-800 rounded-lg">
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="flex flex-col items-center p-3 bg-gray-700 rounded">
              <span className="text-gray-400 text-sm">WPM</span>
              <span className="text-2xl font-bold text-yellow-400">{gameState.stats.wpm}</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-gray-700 rounded">
              <span className="text-gray-400 text-sm">Raw WPM</span>
              <span className="text-2xl font-bold text-purple-400">{gameState.stats.rawWpm}</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-gray-700 rounded">
              <span className="text-gray-400 text-sm">Accuracy</span>
              <span className="text-2xl font-bold text-green-400">{gameState.stats.accuracy}%</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-gray-700 rounded">
              <span className="text-gray-400 text-sm">Time</span>
              <span className="text-2xl font-bold text-blue-400">{gameState.time}s</span>
            </div>
          </div>

          <div className="w-full bg-gray-700 rounded p-3">
            <div className="grid grid-cols-4 gap-2 text-center">
              <div>
                <span className="text-green-400 text-sm">Correct</span>
                <p className="text-lg font-bold">{gameState.stats.correct}</p>
              </div>
              <div>
                <span className="text-red-400 text-sm">Incorrect</span>
                <p className="text-lg font-bold">{gameState.stats.incorrect}</p>
              </div>
              <div>
                <span className="text-yellow-400 text-sm">Extra</span>
                <p className="text-lg font-bold">{gameState.stats.extra}</p>
              </div>
              <div>
                <span className="text-blue-400 text-sm">Missed</span>
                <p className="text-lg font-bold">{gameState.stats.missed}</p>
              </div>
            </div>
          </div>

          <button
            className="px-6 py-2 bg-yellow-500 text-gray-900 rounded font-bold hover:bg-yellow-400 transition-colors"
            onClick={resetGameState}
          >
            Try Again
          </button>
        </div>
      )}
      {(gameState.status === "during" || gameState.status === "before") && (
        <div className="flex flex-col gap-2 w-full">
          <div className="w-full flex items-center justify-center">
            {memoizedGameModeConfig}
          </div>
          <div className="flex flex-col items-center justify-start mt-8">
            <input
              ref={inputRef}
              onBlur={() => {
                if (gameState.status === "during" || gameState.status === "before") {
                  inputRef.current?.focus();
                }
              }}
              type="text"
              value={input}
              maxLength={15}
              onChange={handleInputChange}
              onKeyDown={handleSubmit}
              className="bg-white border-2 mb-4 text-black absolute opacity-0"
            />
            <div className="w-full ml-84 max-w-4xl">
              {gameState.mode === "words" && (
                <p className="text-2xl font-bold text-amber-400">{`${completedWords.length}/${gameState.sampleText.length}`}</p>
              )}
              {gameState.mode === "time" && (
                <p className="text-2xl font-bold text-amber-400">{`${gameState.time}s`}</p>
              )}
            </div>
            
            <div
              ref={containerRef}
              className="relative h-[7.5em] overflow-hidden w-full max-w-4xl mx-auto flex justify-center items-start"
            >
              <div className="flex ml-24 flex-wrap gap-x-4 gap-y-0 text-4xl font-mono tracking-wide">
                {gameState.sampleText.map((word, index) => (
                  <Word
                    key={index}
                    ref={index === currentWordIndex ? activeWordRef : null}
                    word={word}
                    input={
                      index < completedWords.length
                        ? completedWords[index]
                        : index === currentWordIndex
                          ? input
                          : ""
                    }
                    isActive={index === currentWordIndex}
                    isCompleted={index < currentWordIndex}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const Word = memo(forwardRef<HTMLDivElement, {
  word: string;
  input: string;
  isActive: boolean;
  isCompleted: boolean;
}>(function Word(props, ref) {
  const word = props.word.split("");
  const input = props.input.split("");
  const cursorPosition = input.length;
  const isCorrect = props.word === props.input;
  const extraLetters = input.length > word.length ? input.slice(word.length) : [];
  const showEndCursor = props.isActive && ((cursorPosition === word.length && extraLetters.length === 0) || cursorPosition === word.length + extraLetters.length);

  return (
    <div 
      ref={ref}
      className="flex flex-row text-4xl font-mono tracking-wide"
    >
      {props.isCompleted && !isCorrect ? (
        <div className="underline decoration-red-400">
          {word.map((letter, index) => {
            if (letter === input[index]) {
              return <Letter key={index} letter={letter} status={"correct"} />;
            } else if (letter !== input[index] && input[index]) {
              return <Letter key={index} letter={letter} status={"incorrect"} />;
            } else {
              return <Letter key={index} letter={letter} status={"none"} />;
            }
          })}
          {extraLetters.map((letter, index) => (
            <Letter key={`extra-${index}`} letter={letter} status={"incorrect"} />
          ))}
        </div>
      ) : (
        <div className="flex">
          {word.map((letter, index) => {
            const showCursor = index === cursorPosition && props.isActive;
            if (letter === input[index]) {
              return <Letter key={index} letter={letter} status={"correct"} showCursor={showCursor} />;
            } else if (letter !== input[index] && input[index]) {
              return <Letter key={index} letter={letter} status={"incorrect"} showCursor={showCursor} />;
            } else {
              return <Letter key={index} letter={letter} status={"none"} showCursor={showCursor} />;
            }
          })}
          {extraLetters.map((letter, index) => (
            <Letter
              key={`extra-${index}`}
              letter={letter}
              status={"incorrect"}
              showCursor={word.length + index === cursorPosition && props.isActive}
            />
          ))}
          {showEndCursor && (
            <span className="border-l-2 border-white h-[1em] ml-[1px]"></span>
          )}
        </div>
      )}
    </div>
  );
}));

const Letter = memo(function Letter(props: {
  letter: string;
  status: string;
  showCursor?: boolean;
}) {
  const letter = props.letter;
  const status = props.status;
  const showCursor = props.showCursor;

  let className = "";
  if (status === "correct") {
    className = "text-white";
  } else if (status === "incorrect") {
    className = "text-red-400";
  } else if (status === "none") {
    className = "text-gray-400";
  }

  if (showCursor) {
    className += " border-l-2 border-white";
  }

  return <span className={className}>{letter}</span>;
});

const GameModeConfig = memo(function GameModeConfig(props: {
  mode: GameMode;
  setGameMode: (mode: GameMode) => void;
  timeLimit: number;
  wordCount: number;
  setTimeLimit: (time: number) => void;
  setWordCount: (count: number) => void;
  resetGameState: () => void;
}) {
  const wordOptions = [10, 25, 50, 100];
  const timeOptions = [15, 30, 60];
  const {
    mode,
    setGameMode,
    timeLimit,
    wordCount,
    setTimeLimit,
    setWordCount,
    resetGameState,
  } = props;

  return (
    <div className="flex items-center justify-center bg-gray-800 text-gray-400 p-2 rounded-md">
      {/* Mode toggles */}
      <div className="flex space-x-4 mr-4">
        <button
          className={`flex items-center hover:cursor-pointer hover:text-yellow-600 ${mode === "time" ? "text-yellow-400" : ""
            }`}
          onClick={() => {
            setGameMode("time");
            setTimeLimit(15);
            setWordCount(50);
            resetGameState();
          }}
        >
          <div className="flex flex-row items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>time</span>
          </div>
        </button>

        <button
          className={`flex items-center hover:cursor-pointer hover:text-purple-600 ${mode === "words" ? "text-purple-400" : ""
            }`}
          onClick={() => {
            setGameMode("words");
            setWordCount(10);
            resetGameState();
          }}
        >
          <div className="flex flex-row items-center gap-2">
            <Hash className="h-4 w-4" />
            <span>words</span>
          </div>
        </button>
      </div>

      {/* Divider */}
      <div className="h-6 w-px bg-gray-600 mx-4"></div>

      {/* Options based on active mode */}
      <div className="flex space-x-2">
        {mode === "time" && (
          <>
            {timeOptions.map((seconds) => (
              <button
                key={seconds}
                className={`px-2 py-1 rounded ${timeLimit === seconds
                  ? "bg-yellow-500 text-gray-900"
                  : "hover:bg-gray-700"
                  }`}
                onClick={() => {
                  setTimeLimit(seconds);
                  setWordCount(seconds * 2.5);
                  resetGameState();
                }}
              >
                {seconds}
              </button>
            ))}
          </>
        )}

        {mode === "words" && (
          <>
            {wordOptions.map((count) => (
              <button
                key={count}
                className={`px-2 py-1 rounded ${wordCount === count
                  ? "bg-purple-500 text-gray-900"
                  : "hover:bg-gray-700"
                  }`}
                onClick={() => {
                  setWordCount(count);
                  resetGameState();
                }}
              >
                {count}
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
});
