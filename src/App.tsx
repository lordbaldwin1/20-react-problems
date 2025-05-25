import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Calculator from "./components/Calculator";
import Navbar from "./components/Navbar";
import Wordle from "./components/Wordle";
import DiceRoll from "./components/DiceRoll";
import TypeTest from "./components/TypeTest";

function App() {
  return (
    <div className="bg-gray-700 text-gray-100 min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/wordle" element={<Wordle />} />
        <Route path="/diceroll" element={<DiceRoll />} />
        <Route path="/typetest" element={<TypeTest />} />

        <Route
          path="*"
          element={
            <h2 className="flex items-center justify-center h-screen text-4xl font-bold">
              404: Page Not Found
            </h2>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
