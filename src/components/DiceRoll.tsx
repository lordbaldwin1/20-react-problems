import { useState } from "react";

export default function DiceRoll() {
  const [dice, setDice] = useState<number>(0);

  const calculateRandomDice = () => {
    const result = Math.floor(Math.random() * (6) + 1);

    setDice(result);
  };

  return (
    <div className="flex flex-col items-center mt-10 gap-4 h-screen">
      <button
        className="p-4 rounded-sm bg-gradient-to-b font-extrabold text-2xl text-gray-950 from-white to-indigo-500 hover:bg-gradient-to-b hover:from-black hover:to-amber-950 hover:text-gray-200 transition duration-300 ease-in-out"
        onClick={calculateRandomDice}
      >
        Roll Dice!
      </button>
      <Dice dice={dice} />
    </div>
  );
}

function Dice(props: { dice: number }) {
  const dice = props.dice;
  if (dice === 1) {
    return (
      <div className="relative h-20 w-20 bg-gray-200 rounded-sm">
        <div className="absolute top-7.5 left-7.5 bg-black h-5 w-5 rounded-full" />
      </div>
    );
  } else if (dice === 2) {
    return (
      <div className="relative h-20 w-20 bg-gray-200 rounded-sm">
        <div className="absolute top-3 left-3 bg-black h-5 w-5 rounded-full" />
        <div className="absolute bottom-3 right-3 bg-black h-5 w-5 rounded-full" />
      </div>
    );
  } else if (dice === 3) {
    return (
      <div className="relative h-20 w-20 bg-gray-200 rounded-sm">
        <div className="absolute top-3 left-3 bg-black h-5 w-5 rounded-full" />
        <div className="absolute top-7.5 right-7.5 bg-black h-5 w-5 rounded-full" />
        <div className="absolute bottom-3 right-3 bg-black h-5 w-5 rounded-full" />
      </div>
    );
  } else if (dice === 4) {
    return (
      <div className="relative h-20 w-20 bg-gray-200 rounded-sm">
        <div className="absolute top-3 left-3 bg-black h-5 w-5 rounded-full" />
        <div className="absolute top-3 right-3 bg-black h-5 w-5 rounded-full" />
        <div className="absolute bottom-3 left-3 bg-black h-5 w-5 rounded-full" />
        <div className="absolute bottom-3 right-3 bg-black h-5 w-5 rounded-full" />
      </div>
    );
  } else if (dice === 5) {
    return (
      <div className="relative h-20 w-20 bg-gray-200 rounded-sm">
        <div className="absolute top-3 left-3 bg-black h-5 w-5 rounded-full" />
        <div className="absolute top-3 right-3 bg-black h-5 w-5 rounded-full" />
        <div className="absolute bottom-3 left-3 bg-black h-5 w-5 rounded-full" />
        <div className="absolute bottom-3 right-3 bg-black h-5 w-5 rounded-full" />
        <div className="absolute bottom-7.5 right-7.5 bg-black h-5 w-5 rounded-full" />
      </div>
    );
  } else if (dice === 6) {
    return (
      <div className="relative h-20 w-20 bg-gray-200 rounded-sm">
        <div className="absolute top-2 left-3 bg-black h-5 w-5 rounded-full" />
        <div className="absolute top-2 right-3 bg-black h-5 w-5 rounded-full" />
        <div className="absolute top-7.5 left-3 bg-black h-5 w-5 rounded-full" />
        <div className="absolute top-7.5 right-3 bg-black h-5 w-5 rounded-full" />
        <div className="absolute bottom-2 left-3 bg-black h-5 w-5 rounded-full" />
        <div className="absolute bottom-2 right-3 bg-black h-5 w-5 rounded-full" />
      </div>
    );
  }
}
