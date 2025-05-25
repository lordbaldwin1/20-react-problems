import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { WORD_LIST } from '../utils/wordList';

const keyboard = "QWERTYUIOPASDFGHJKLZXCVBNM";

const TOTAL_GUESSES = 6;
const GUESS_LENGTH = 5;

// data can be a full string of 5 letters
// partial string for currentGuess
// empty string, it hasn't been guessed yet

const initializeLetterStatus = () => {
  const initialStatus: Record<string, string> = {};
  for (let i = 65; i <= 90; i++) {
    const letter = String.fromCharCode(i);
    initialStatus[letter] = "unused";
  }
  return initialStatus;
};

function WordRow(props: { data: string; letters: string[] }) {
  const data = props.data;

  const dataArray = data.split("");

  if (dataArray.length < GUESS_LENGTH) {
    for (let i = dataArray.length; i < GUESS_LENGTH; i++) {
      dataArray.push(" ");
    }
  }
  return (
    <div className="flex flex-row gap-2 text-3xl font-bold">
      {dataArray.map((letter, i) => (
        <WordLetter key={i} data={letter} status={props.letters[i]} />
      ))}
    </div>
  );
}

function WordLetter(props: { data: string; status: string }) {
  const data = props.data;
  const status = props.status;

  if (status === "correct") {
    return (
      <div className="flex items-center justify-center bg-green-400 h-15 w-15 rounded-sm">
        {data}
      </div>
    );
  } else if (status === "partial") {
    return (
      <div className="flex items-center justify-center bg-yellow-400 h-15 w-15 rounded-sm">
        {data}
      </div>
    );
  } else if (status === "incorrect") {
    return (
      <div className="flex items-center justify-center bg-gray-500 h-15 w-15 rounded-sm">
        {data}
      </div>
    );
  } else {
    return (
      <div className="flex items-center justify-center border-1 h-15 w-15 rounded-sm">
        {data}
      </div>
    );
  }
}
export default function Wordle() {
const [winningWord, setWinningWord] = useState(() => {
    const randomIndex = Math.floor(Math.random() * WORD_LIST.length);
    return WORD_LIST[randomIndex];
  });
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [pastGuesses, setPastGuesses] = useState<string[]>([]);
  const [letterChecks, setLetterChecks] = useState<string[][]>([]);
  const [letterStatus, setLetterStatus] = useState<Record<string, string>>(
    initializeLetterStatus()
  );
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost">(
    "playing"
  );
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    console.log(winningWord);
    if (
      pastGuesses.length > 0 &&
      pastGuesses[pastGuesses.length - 1] === winningWord
    ) {
      setGameStatus("won");
    } else if (pastGuesses.length === TOTAL_GUESSES) {
      setGameStatus("lost");
    }
  }, [pastGuesses, setGameStatus, winningWord]);

  const handleRestartGame = () => {
    const randomIndex = Math.floor(Math.random() * WORD_LIST.length);
    setWinningWord(WORD_LIST[randomIndex]);
    setPastGuesses([]);
    setCurrentGuess("");
    setLetterChecks([]);
    setLetterStatus(initializeLetterStatus());
    setGameStatus("playing");
  };

const GameMessage = () => {
  if (gameStatus === "won" || gameStatus === "lost") {
    return (
      <div className="flex items-center justify-between bg-gray-900 p-3 rounded-lg shadow-md border border-gray-700 w-full max-w-[600px] mx-auto mb-4">
        {gameStatus === "won" ? (
          <div className="flex items-center space-x-2">
            <span className="text-green-400 font-bold">Congratulations!</span>
            <span>
              You won in {pastGuesses.length}{" "}
              {pastGuesses.length === 1 ? "guess" : "guesses"}!
            </span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <span className="text-red-400 font-bold">Game Over!</span>
            <span>
              The word was <span className="text-yellow-400">{winningWord}</span>
            </span>
          </div>
        )}
        <button
          className="bg-gray-700 hover:bg-gray-600 text-gray-100 px-4 py-1 rounded-md transition-colors duration-200 ease-in-out font-semibold ml-4 whitespace-nowrap"
          onClick={handleRestartGame}
        >
          Play Again
        </button>
      </div>
    );
  }
  return null;
};

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (isNaN(Number(newValue[newValue.length - 1]))) {
      setCurrentGuess(newValue.toUpperCase());
    }
  };

  const handleKeyPress = (letter: string) => {
    if (currentGuess.length < GUESS_LENGTH) {
      setCurrentGuess((currentGuess + letter).toUpperCase());
    }
  };

  const handleSubmitKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      checkGuess(currentGuess);
    }
  };

  const handleSubmitButton = () => {
    checkGuess(currentGuess);
  };

  const handleDeleteButton = () => {
    setCurrentGuess(currentGuess.slice(0, currentGuess.length - 1));
  };

  const checkGuess = (guess: string) => {
    if (gameStatus !== "playing") return;

    if (guess.length === GUESS_LENGTH && pastGuesses.length !== TOTAL_GUESSES) {
      const guessLetterCheck: string[] = [];
      const winningWordCount: Record<string, number> = {};
      const newLetterStatus = { ...letterStatus };

      for (let j = 0; j < GUESS_LENGTH; j++) {
        winningWordCount[winningWord[j]] =
          (winningWordCount[winningWord[j]] || 0) + 1;
      }

      for (let i = 0; i < GUESS_LENGTH; i++) {
        if (guess[i] === winningWord[i]) {
          guessLetterCheck[i] = "correct";
          winningWordCount[winningWord[i]] -= 1;

          if (
            newLetterStatus[guess[i]] === "unused" ||
            newLetterStatus[guess[i]] === "incorrect" ||
            newLetterStatus[guess[i]] === "partial"
          ) {
            newLetterStatus[guess[i]] = "correct";
          }
        }
      }

      for (let k = 0; k < GUESS_LENGTH; k++) {
        if (
          winningWord.includes(guess[k]) &&
          guess[k] !== winningWord[k] &&
          winningWordCount[guess[k]] > 0 &&
          guessLetterCheck[k] === undefined
        ) {
          guessLetterCheck[k] = "partial";
          winningWordCount[guess[k]] -= 1;

          if (newLetterStatus[guess[k]] === "unused") {
            newLetterStatus[guess[k]] = "partial";
          }
        } else if (guessLetterCheck[k] === undefined) {
          guessLetterCheck[k] = "incorrect";

          if (newLetterStatus[guess[k]] === "unused") {
            newLetterStatus[guess[k]] = "incorrect";
          }
        }
      }

      const newGuesses = [...pastGuesses];
      newGuesses.push(guess);

      const newLetterCheck = [...letterChecks];
      newLetterCheck.push(guessLetterCheck);

      setLetterChecks(newLetterCheck);
      setPastGuesses(newGuesses);
      setLetterStatus(newLetterStatus);
      setCurrentGuess("");
    }
  };

  const focusLockInput = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <input
        ref={inputRef}
        type="text"
        className="border-1 mb-2 opacity-0"
        value={currentGuess}
        onChange={handleInputChange}
        onKeyDown={handleSubmitKey}
        onBlur={focusLockInput}
        maxLength={5}
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck="false"
        aria-label="Current guess input"
      />
      <GameMessage />
      <h1 className="text-4xl mb-4 font-extrabold bg-gradient-to-r from-gray-300 via-yellow-300 to-green-300 inline-block text-transparent bg-clip-text">
        WORDLE CLONE
      </h1>
      <div className="flex flex-col gap-2 mb-4">
        {Array.from({ length: TOTAL_GUESSES }).map((_, i) => (
          <WordRow
            key={i}
            data={
              i < pastGuesses.length
                ? pastGuesses[i]
                : i === pastGuesses.length
                ? currentGuess
                : ""
            }
            letters={i < letterChecks.length ? letterChecks[i] : []}
          />
        ))}
      </div>
      <div className="flex flex-col gap-2 font-bold">
        <div className="flex gap-2 justify-center">
          {keyboard
            .split("")
            .slice(0, 10)
            .map((letter) => (
              <Key
                key={letter}
                data={letter}
                status={letterStatus[letter]}
                onClick={handleKeyPress}
              />
            ))}
        </div>
        <div className="flex gap-2 justify-center">
          {keyboard
            .split("")
            .slice(10, 19)
            .map((letter) => (
              <Key
                key={letter}
                data={letter}
                status={letterStatus[letter]}
                onClick={handleKeyPress}
              />
            ))}
        </div>
        <div className="flex gap-2 justify-center">
          <button
            className="bg-gray-300 hover:bg-gray-400 p-3 rounded-sm text-gray-900 w-10 h-10 flex items-center justify-center"
            onClick={handleSubmitButton}
          >
            ↵
          </button>
          {keyboard
            .split("")
            .slice(19, 26)
            .map((letter) => (
              <Key
                key={letter}
                data={letter}
                status={letterStatus[letter]}
                onClick={handleKeyPress}
              />
            ))}
          <button
            className="bg-gray-300 hover:bg-gray-400 p-3 rounded-sm text-gray-900 w-10 h-10 flex items-center justify-center"
            onClick={handleDeleteButton}
          >
            ⌫
          </button>
        </div>
      </div>
    </div>
  );
}

function Key(props: {
  data: string;
  status: string;
  onClick: (letter: string) => void;
}) {
  const letter = props.data;
  const status = props.status;

  if (status === "unused") {
    return (
      <button
        className="bg-gray-300 hover:bg-gray-400 p-3 rounded-sm text-gray-900 w-10 h-10 flex items-center justify-center"
        onClick={() => props.onClick(letter)}
      >
        {letter}
      </button>
    );
  } else if (status === "correct") {
    return (
      <button
        className="bg-green-300 hover:bg-gray-400 p-3 rounded-sm text-gray-900 w-10 h-10 flex items-center justify-center"
        onClick={() => props.onClick(letter)}
      >
        {letter}
      </button>
    );
  } else if (status === "incorrect") {
    return (
      <button
        className="bg-gray-500 hover:bg-gray-600 p-3 rounded-sm text-gray-900 w-10 h-10 flex items-center justify-center"
        onClick={() => props.onClick(letter)}
      >
        {letter}
      </button>
    );
  } else if (status === "partial") {
    return (
      <button
        className="bg-yellow-300 hover:bg-gray-400 p-3 rounded-sm text-gray-900 w-10 h-10 flex items-center justify-center"
        onClick={() => props.onClick(letter)}
      >
        {letter}
      </button>
    );
  }
}
