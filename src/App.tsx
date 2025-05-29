import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Calculator from "./components/Calculator";
import Navbar from "./components/Navbar";
import Wordle from "./components/Wordle";
import DiceRoll from "./components/DiceRoll";
import TypeTest from "./components/TypeTest";
import Quiz from "./components/Quiz";
import Search from "./components/Search";

function App() {
  return (
    <div className="bg-gray-700 text-gray-100 min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/wordle" element={<Wordle />} />
          <Route path="/diceroll" element={<DiceRoll />} />
          <Route path="/typetest" element={<TypeTest />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/search" element={<Search />} />

          <Route
            path="*"
            element={
              <h2 className="flex items-center justify-center flex-1 text-4xl font-bold">
                404: Page Not Found
              </h2>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
