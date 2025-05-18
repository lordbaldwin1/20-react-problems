import { useState } from "react";

const keyboard = "qwertyuiopasdfghjklzxcvbnm";

interface Letter {
  value: string;
  status: "empty" | "unconfirmed" | "correct" | "partial" | "incorrect";
}

interface GuessRow {
  letters: Letter[];
  status: "unconfirmed" | "confirmed" | "empty";
}

type WordGridState = GuessRow[];

const generateLetter = (): Letter => {
  return {
    value: "",
    status: "empty",
  };
};
const generateGuessRow = (): GuessRow => {
  return {
    letters: Array.from({ length: 5 }, () => generateLetter()),
    status: "empty",
  };
};

const initialGridState: WordGridState = Array.from({ length: 6 }, () =>
  generateGuessRow()
);

function Row(props: { guessRow: GuessRow }) {
  return (
    <div className="flex justify-center mb-2 gap-2">
      {props.guessRow.letters.map((letter, index) => (
        <Element key={index} letter={letter} />
      ))}
    </div>
  );
}

function Element(props: { letter: Letter}) {
  return (
    <div className="flex w-10 h-10 bg-gray-300">
      <p>{props.letter.value}</p>
    </div>
  )
}

export default function Wordle() {
  const [grid, setGrid] = useState<GuessRow[]>(initialGridState);
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {grid.map((row, index) => {
        return <Row key={index} guessRow={row} />
      })}
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 justify-center">
          {keyboard
            .split("")
            .slice(0, 10)
            .map((letter) => (
              <button
                key={letter}
                className="bg-gray-300 hover:bg-gray-400 p-3 rounded-sm text-gray-900 w-10 h-10 flex items-center justify-center"
              >
                {letter}
              </button>
            ))}
        </div>
        <div className="flex gap-2 justify-center">
          {keyboard
            .split("")
            .slice(10, 19)
            .map((letter) => (
              <button
                key={letter}
                className="bg-gray-300 hover:bg-gray-400 p-3 rounded-sm text-gray-900 w-10 h-10 flex items-center justify-center"
              >
                {letter}
              </button>
            ))}
        </div>
        <div className="flex gap-2 justify-center">
          {keyboard
            .split("")
            .slice(19, 26)
            .map((letter) => (
              <button
                key={letter}
                className="bg-gray-300 hover:bg-gray-400 p-3 rounded-sm text-gray-900 w-10 h-10 flex items-center justify-center"
              >
                {letter}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
