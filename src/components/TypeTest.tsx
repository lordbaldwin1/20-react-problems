// as we type, the letter needs to be checked
// if letter at current state index === letter at data index

import { useEffect, useRef, useState } from "react";
import { generateRandomWords } from "../utils/functions";

function Word(props: {
  word: string;
  input: string;
  isActive: boolean;
  isCompleted: boolean;
}) {
  const word = props.word.split("");
  const input = props.input.split("");

  const isCorrect = props.word === props.input;

  const extraLetters =
    input.length > word.length ? input.slice(word.length) : [];

  return (
    <div className="flex flex-row mr-4 text-4xl font-mono tracking-wider">
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
        <div>
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
      )}
    </div>
  );
}

function Letter(props: { letter: string; status: string }) {
  const letter = props.letter;
  const status = props.status;

  if (status === "correct") {
    return <span className="text-white">{letter}</span>;
  } else if (status === "incorrect") {
    return <span className="text-red-400">{letter}</span>;
  } else if (status === "none") {
    return <span className="text-gray-400">{letter}</span>;
  }
}

interface LetterCount {
  correct: number;
  incorrect: number;
  extra: number;
  missed: number;
}

type GameStatus = "before" | "during" | "after";

// Game Component to handle state:
// handle game status
// handle calculation of WPM
// handle whether test is displayed or results is displayed
//
// memo type test component?
// what state will type test keep?
// input, completedWords, currentWordIndex, sampleText (prop?)

export default function Game() {
  const [gameStatus, setGameStatus] = useState<GameStatus>("before");
  const [gameTime, setGameTime] = useState<number>(0);
  const [wpm, setWpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(0);
  const [rawWpm, setRawWpm] = useState<number>(0);
  const [wordCount, setWordCount] = useState<number>(25);
  const [sampleText, setSampleText] = useState<string[]>(
    generateRandomWords(wordCount).split(" ")
  );

  useEffect(() => {
    let intervalId: number | undefined;

    if (gameStatus === "during") {
      intervalId = setInterval(() => {
        setGameTime((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [gameStatus]);

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
    setGameTime(0);
    setSampleText(generateRandomWords(wordCount).split(" "));
    setWpm(0);
    setRawWpm(0);
    setAccuracy(0);
  }

  useEffect(() => {
    setSampleText(generateRandomWords(wordCount).split(" "));
  }, [wordCount])

  function handleChangeWordCount(newWordCount: number) {
    resetGameState();
    setWordCount(newWordCount);
  }

  function calculateStats(correctChars: number, totalChars: number) {
    const timeInMinutes = gameTime / 60;

    const correctWordCount = correctChars / 5; // 1 word = 5 characters
    const rawWordCount = totalChars / 5;

    if (timeInMinutes === 0) return 0;

    const wpm = Math.floor(correctWordCount / timeInMinutes);
    const rawWpm = Math.floor(rawWordCount / timeInMinutes);
    const accuracy = correctChars / totalChars;
    setWpm(wpm);
    setRawWpm(rawWpm);
    setAccuracy(Math.floor(accuracy * 100));
  }

  return (
    <div className="flex flex-col items-center">
      <p>{`game status: ${gameStatus}`}</p>
      <p>{`game time: ${gameTime}`}</p>
      <p>{`WPM: ${wpm}`}</p>
      <p>{`RAW WPM: ${rawWpm}`}</p>
      <p>{`accuracy: ${accuracy}%`}</p>
      <button className="bg-gray-950" onClick={() => handleChangeWordCount(10)}>
        10
      </button>
      <button className="bg-gray-950" onClick={() => handleChangeWordCount(25)}>
        25
      </button>
      <button className="bg-gray-950" onClick={() => handleChangeWordCount(50)}>
        50
      </button>
      <TypeTest
        startGame={startGame}
        endGame={endGame}
        restartGame={restartGame}
        sampleText={sampleText}
        gameStatus={gameStatus}
        calculateStats={calculateStats}
      />
    </div>
  );
}

function TypeTest(props: {
  gameStatus: GameStatus;
  startGame: () => void;
  endGame: () => void;
  restartGame: () => void;
  calculateStats: (correctChars: number, totalChars: number) => void;
  sampleText: string[];
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

  // function handleRestartGame() {
  //   setGameStatus("before");
  //   setSeconds(0);
  // }

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // Start game on first input
    if (completedWords.length === 0) {
      props.startGame();
    }
    if (newValue.length > 0 && newValue[newValue.length - 1] === " ") {
      return;
    }

    // End game when last word correctly entered
    if (
      sampleText.length - 1 === completedWords.length &&
      sampleText[sampleText.length - 1] === newValue
    ) {
      updateLetterCount(
        newValue.split(""),
        sampleText[sampleText.length - 1].split("")
      );
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

      // COUNT LETTERS
      const submittedWord =
        newCompletedWords[newCompletedWords.length - 1].split("");
      const sampleWord = sampleText[newCompletedWords.length - 1].split("");
      updateLetterCount(submittedWord, sampleWord);

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
    const correctCharCount =
      totalCharCount - (letterCount.extra + letterCount.incorrect);

    props.calculateStats(correctCharCount, totalCharCount);
    props.endGame();
    setCompletedWords([]);
    setInput('');
    setCurrentWordIndex(0);
  }

  return (
    <div className="flex flex-col items-center justify-start mt-8 min-h-screen">
      <p>{`letter counts: correct: ${letterCount.correct} incorrect: ${letterCount.incorrect} extra: ${letterCount.extra} missed: ${letterCount.missed}`}</p>
      <input
        ref={inputRef}
        onBlur={() => {
          if (inputRef.current) inputRef.current.focus();
        }}
        type="text"
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleSubmit}
        className="bg-white border-2 mb-4 text-black"
      />
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
