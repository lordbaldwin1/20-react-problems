import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <Link to="/calculator" className="text-blue-300 hover:underline mx-auto">
        Calculator
      </Link>
      <Link to="/wordle" className="text-blue-300 hover:underline mx-auto">
        Wordle
      </Link> 
      <Link to="/diceroll" className="text-blue-300 hover:underline mx-auto">
        Dice Roll
      </Link> 
    </div>
  );
}
