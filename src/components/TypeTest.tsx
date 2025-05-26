// as we type, the letter needs to be checked
// if letter at current state index === letter at data index

import { useEffect, useRef, useState } from "react";
import { generateRandomWords } from "../utils/functions";
import { Clock, Hash } from "lucide-react";

interface LetterCount {
  correct: number;
  incorrect: number;
  extra: number;
  missed: number;
}

interface Stats {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  correct: number;
  incorrect: number;
  extra: number;
  missed: number;
}

type GameStatus = "before" | "during" | "after";

type GameMode = "words" | "time";

function GameModeConfig(props: {
  mode: GameMode;
  setGameMode: React.Dispatch<React.SetStateAction<GameMode>>;
  timeLimit: number;
  wordCount: number;
  setTimeLimit: React.Dispatch<React.SetStateAction<number>>;
  setWordCount: React.Dispatch<React.SetStateAction<number>>;
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
          className={`flex items-center hover:cursor-pointer hover:text-yellow-600 ${
            mode === "time" ? "text-yellow-400" : ""
          }`}
          onClick={() => {
            setGameMode("time");
            setTimeLimit(15);
            setWordCount(160);
            resetGameState();
          }}
        >
          <div className="flex flex-row items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>time</span>
          </div>
        </button>

        <button
          className={`flex items-center hover:cursor-pointer hover:text-purple-600 ${
            mode === "words" ? "text-purple-400" : ""
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
                className={`px-2 py-1 rounded ${
                  timeLimit === seconds
                    ? "bg-yellow-500 text-gray-900"
                    : "hover:bg-gray-700"
                }`}
                onClick={() => setTimeLimit(seconds)}
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
                className={`px-2 py-1 rounded ${
                  wordCount === count
                    ? "bg-purple-500 text-gray-900"
                    : "hover:bg-gray-700"
                }`}
                onClick={() => setWordCount(count)}
              >
                {count}
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default function Game() {
  const [gameStatus, setGameStatus] = useState<GameStatus>("after");
  const [gameMode, setGameMode] = useState<GameMode>("words");
  const [gameTime, setGameTime] = useState<number>(0);
  const [stats, setStats] = useState<Stats>({
    wpm: 0,
    rawWpm: 0,
    accuracy: 0,
    correct: 0,
    incorrect: 0,
    extra: 0,
    missed: 0,
  });
  const [wordCount, setWordCount] = useState<number>(10);
  const [sampleText, setSampleText] = useState<string[]>(
    generateRandomWords(wordCount).split(" ")
  );

  useEffect(() => {
    let intervalId: number | undefined;

    if (gameStatus === "during" && gameMode === "words") {
      intervalId = setInterval(() => {
        setGameTime((prev) => prev + 1);
      }, 1000);
    }

    if (gameStatus === "during" && gameMode === "time") {
      intervalId = setInterval(() => {
        setGameTime((prev) => {
          if (prev <= 1) {
            clearInterval(intervalId);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [gameStatus, gameMode]);

  function startGame() {
    setGameStatus("during");
  }

  function endGame() {
    setGameStatus("after");
  }

  function restartGame() {
    // TODO: implement
    return;
  }

  function resetGameState() {
    setGameStatus("before");
    //setGameTime(0);
    setSampleText(generateRandomWords(wordCount).split(" "));
    setStats({
      wpm: 0,
      rawWpm: 0,
      accuracy: 0,
      correct: 0,
      incorrect: 0,
      extra: 0,
      missed: 0,
    });
  }

  useEffect(() => {
    setSampleText(generateRandomWords(wordCount).split(" "));
  }, [wordCount]);

  function calculateStats(
    correctChars: number,
    totalChars: number,
    incorrect: number,
    extra: number,
    missed: number
  ) {
    const timeInMinutes = gameTime / 60;

    const correctWordCount = correctChars / 5; // 1 word = 5 characters
    const rawWordCount = totalChars / 5;

    if (timeInMinutes === 0) return 0;

    const wpm = Math.floor(correctWordCount / timeInMinutes);
    const rawWpm = Math.floor(rawWordCount / timeInMinutes);
    const accuracy = correctChars / totalChars;
    setStats({
      wpm: wpm,
      rawWpm: rawWpm,
      accuracy: Math.floor(accuracy * 100),
      correct: correctChars,
      incorrect: incorrect,
      extra: extra,
      missed: missed,
    });
  }

  return (
    <div className="flex flex-col items-center">
      <p>{`game status: ${gameStatus}`}</p>
      {gameStatus === "after" && (
        <div className="flex flex-col justify-center">
          <p>{`game time: ${gameTime}`}</p>
          <p>{`wpm: ${stats.wpm}`}</p>
          <p>{`raw wpm: ${stats.rawWpm}`}</p>
          <p>{`accuracy: ${stats.accuracy}%`}</p>
          <p>{`characters: ${stats.correct}/${stats.incorrect}/${stats.extra}/${stats.missed}`}</p>
          <button
            className="bg-gray-950 rounded-sm hover:bg-gray-800 hover:outline-1"
            onClick={resetGameState}
          >
            play
          </button>
        </div>
      )}
      {(gameStatus === "during" || gameStatus === "before") && (
        <div className="flex flex-col gap-2">
          <GameModeConfig
            mode={gameMode}
            setGameMode={setGameMode}
            timeLimit={gameTime}
            wordCount={wordCount}
            setTimeLimit={setGameTime}
            setWordCount={setWordCount}
            resetGameState={resetGameState}
          />
          <TypeTest
            startGame={startGame}
            endGame={endGame}
            restartGame={restartGame}
            sampleText={sampleText}
            gameStatus={gameStatus}
            calculateStats={calculateStats}
            gameMode={gameMode}
            gameTime={gameTime}
          />
        </div>
      )}
    </div>
  );
}

// memoize to it doesn't rerender on timer??
function TypeTest(props: {
  gameStatus: GameStatus;
  startGame: () => void;
  endGame: () => void;
  restartGame: () => void;
  calculateStats: (
    correctChars: number,
    totalChars: number,
    incorrect: number,
    extra: number,
    missed: number
  ) => void;
  sampleText: string[];
  gameMode: GameMode;
  gameTime: number;
}) {
  const [input, setInput] = useState<string>("");
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [letterCount, setLetterCount] = useState<LetterCount>({
    correct: 0,
    incorrect: 0,
    extra: 0,
    missed: 0,
  });
  const [completedWords, setCompletedWords] = useState<string[]>([]);

  // TODO: ADD RANDOM TEXTS AS SAMPLE
  const gameStatus = props.gameStatus;
  const sampleText = props.sampleText;
  const gameMode = props.gameMode;
  const gameTime = props.gameTime;

  if (gameMode === "time" && gameTime === 0 && gameStatus === "during") {
    handleEndGame();
  }

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (gameStatus === "during") return;

    setCompletedWords([]);
    setInput("");
    setCurrentWordIndex(0);
    setLetterCount({
      correct: 0,
      incorrect: 0,
      extra: 0,
      missed: 0,
    });
  }, [gameStatus]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (completedWords.length === 0) {
      props.startGame();
    }
    if (newValue.length > 0 && newValue[newValue.length - 1] === " ") {
      return;
    }

    if (
      sampleText.length - 1 === completedWords.length &&
      sampleText[sampleText.length - 1] === newValue
    ) {
      updateLetterCount(
        newValue.split(""),
        sampleText[sampleText.length - 1].split("")
      );
      // GAME END
      handleEndGame();
    }
    setInput(newValue);
  };

  const handleSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " " && input.length > 0) {
      const newCompletedWords = [...completedWords, input];
      setInput("");
      setCompletedWords(newCompletedWords);
      setCurrentWordIndex(currentWordIndex + 1);

      const submittedWord =
        newCompletedWords[newCompletedWords.length - 1].split("");
      const sampleWord = sampleText[newCompletedWords.length - 1].split("");
      updateLetterCount(submittedWord, sampleWord);

      // END GAME
      if (newCompletedWords.length === sampleText.length) {
        handleEndGame();
      }
    }
  };

  function updateLetterCount(submittedWord: string[], sampleWord: string[]) {
    if (gameStatus !== "during") {
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
  }

  function handleEndGame() {
    const characterCount = completedWords.reduce((count, string) => {
      return count + string.length;
    }, 0);
    const spaceCount = completedWords.length - 1;

    const totalCharCount = characterCount + spaceCount;

    props.calculateStats(
      letterCount.correct,
      totalCharCount,
      letterCount.incorrect,
      letterCount.extra,
      letterCount.missed
    );
    props.endGame();
  }

  return (
    <div className="flex flex-col items-center justify-start mt-8 min-h-screen">
      <input
        ref={inputRef}
        onBlur={() => {
          if (inputRef.current) inputRef.current.focus();
        }}
        type="text"
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleSubmit}
        className="bg-white border-2 mb-4 text-black absolute opacity-0"
      />
      <div className="w-full">
        {props.gameMode === "words" && (
          <p className="text-2xl font-bold text-amber-400">{`${completedWords.length}/${sampleText.length}`}</p>
        )}
        {props.gameMode === "time" && (
          <p className="text-2xl font-bold text-amber-400">{`${gameTime}s`}</p>
        )}
      </div>
      <div className="flex flex-row flex-wrap max-w-3xl">
        {sampleText.map((word, index) => (
          <Word
            key={index}
            word={word}
            input={
              index < completedWords.length
                ? completedWords[index]
                : index === completedWords.length
                ? input
                : ""
            }
            isActive={index === currentWordIndex}
            isCompleted={index < currentWordIndex}
          />
        ))}
      </div>
    </div>
  );
}

function Word(props: {
  word: string;
  input: string;
  isActive: boolean;
  isCompleted: boolean;
}) {
  const word = props.word.split("");
  const input = props.input.split("");
  const cursorPosition = input.length;

  const isCorrect = props.word === props.input;

  const extraLetters =
    input.length > word.length ? input.slice(word.length) : [];

  const showEndCursor =
    props.isActive &&
    ((cursorPosition === word.length && extraLetters.length === 0) ||
      cursorPosition === word.length + extraLetters.length);

  return (
    <div className="flex flex-row mr-4 text-4xl font-mono tracking-wide">
      {props.isCompleted && !isCorrect ? (
        <div className="underline decoration-red-400">
          {word.map((letter, index) => {
            if (letter === input[index]) {
              return <Letter key={index} letter={letter} status={"correct"} />;
            } else if (letter !== input[index] && input[index]) {
              return (
                <Letter key={index} letter={letter} status={"incorrect"} />
              );
            } else {
              return <Letter key={index} letter={letter} status={"none"} />;
            }
          })}
          {extraLetters.map((letter, index) => (
            <Letter
              key={`extra-${index}`}
              letter={letter}
              status={"incorrect"}
            />
          ))}
        </div>
      ) : (
        <div className="flex">
          {word.map((letter, index) => {
            const showCursor = index === cursorPosition && props.isActive;
            if (letter === input[index]) {
              return (
                <Letter
                  key={index}
                  letter={letter}
                  status={"correct"}
                  showCursor={showCursor}
                />
              );
            } else if (letter !== input[index] && input[index]) {
              return (
                <Letter
                  key={index}
                  letter={letter}
                  status={"incorrect"}
                  showCursor={showCursor}
                />
              );
            } else {
              return (
                <Letter
                  key={index}
                  letter={letter}
                  status={"none"}
                  showCursor={showCursor}
                />
              );
            }
          })}
          {extraLetters.map((letter, index) => (
            <Letter
              key={`extra-${index}`}
              letter={letter}
              status={"incorrect"}
              showCursor={
                word.length + index === cursorPosition && props.isActive
              }
            />
          ))}

          {showEndCursor && (
            <span className="border-l-2 border-white h-[1em] ml-[1px]"></span>
          )}
        </div>
      )}
    </div>
  );
}

function Letter(props: {
  letter: string;
  status: string;
  showCursor?: boolean;
}) {
  const letter = props.letter;
  const status = props.status;
  const showCursor = props.showCursor;
  console.log(showCursor);

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
}
