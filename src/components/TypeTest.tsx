// as we type, the letter needs to be checked
// if letter at current state index === letter at data index

import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";

const testData =
  "open go tell too now follow great school end have from while down high head follow by through she of well see";

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

export default function TypeTest() {
  const [input, setInput] = useState<string>("");
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [completedWords, setCompletedWords] = useState<string[]>([]);
  const [letterCount, setLetterCount] = useState<LetterCount>({
    correct: 0,
    incorrect: 0,
    extra: 0,
    missed: 0,
  });
  const [gameStatus, setGameStatus] = useState<"before" | "during" | "after">(
    "before"
  );
  const [seconds, setSeconds] = useState<number>(0);

  // TODO: ADD RANDOM TEXTS AS SAMPLE
  const sampleText = testData.split(" ");

  useEffect(() => {
    let intervalId: number | undefined;

    if (gameStatus === "during") {
      intervalId = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [gameStatus]);

  function handleStartGame() {
    setGameStatus("during");
  }

  function handleEndGame() {
    setGameStatus("after");
  }

  function handleRestartGame() {
    setGameStatus("before");
    setSeconds(0);
  }

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (gameStatus === "before") {
      setGameStatus("during");
    }
    if (newValue.length > 0 && newValue[newValue.length - 1] === " ") {
      return;
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
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <p>{`Time: ${seconds}`}</p>
      <p>{letterCount.correct}</p>
      <p>{letterCount.incorrect}</p>
      <p>{letterCount.extra}</p>
      <p>{letterCount.missed}</p>
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
