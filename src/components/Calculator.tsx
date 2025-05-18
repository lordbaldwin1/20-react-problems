import { useEffect, useRef, useState, type ChangeEvent } from "react";

// calculator with addition, subtraction, division, clear
export default function Calculator() {
  const [inputNumber, setInputNumber] = useState<string>("");
  const [storedInputNumber, setStoredInputNumber] = useState<number>(0);
  const [storedOperator, setStoredOperator] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);

  const appendNumber = (num: string) => {
    if (inputNumber === "0") {
      setInputNumber(inputNumber);
    } else {
      setInputNumber(inputNumber + num);
    }
  };

  const handleKeyboardInput = (e: ChangeEvent<HTMLInputElement>) => {
    // if input is character FUCK OFF!!!
    const newValue = e.target.value;
    if (!isNaN(Number(newValue))) {
      setInputNumber(newValue);
    }
  };

  const handleOperator = (operator: string) => {
    inputRef.current?.focus();

    const valueToStore = !isNaN(Number(inputNumber)) ? Number(inputNumber) : 0;

    if (valueToStore === 0 && storedOperator !== "") {
      setStoredOperator(operator);
      if (!storedInputNumber) {
        setStoredInputNumber(0);
      }
      return;
    }

    setStoredInputNumber(valueToStore);
    setStoredOperator(operator);
    setInputNumber("");
  };

  const handleCalculation = () => {
    if (isNaN(Number(inputNumber))) {
      return;
    }

    const val1 = Number(storedInputNumber);
    const val2 = Number(inputNumber);

    let answer: number | null = null;
    if (storedOperator === "+") {
      answer = val1 + val2;
    } else if (storedOperator === "-") {
      answer = val1 - val2;
    } else if (storedOperator === "*") {
      answer = val1 * val2;
    } else if (storedOperator === "/") {
      if (val2 === 0) {
        answer = null;
      } else {
        answer = val1 / val2;
      }
    }
    if (answer === null) {
      setInputNumber("ERROR");
      setStoredInputNumber(0);
    } else {
      setInputNumber(String(answer));
      setStoredInputNumber(answer);
    }
    setStoredOperator("");
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="grid grid-cols-4 gap-2 bg-green-300 text-gray-900 p-2 rounded-sm">
        <div className="col-span-4">
          <input
            ref={inputRef}
            id="calculator"
            className="text-right text-gray-900 h-8 p-2 border-1 border-gray-900 rounded-sm"
            type="text"
            placeholder="0"
            value={inputNumber}
            onChange={handleKeyboardInput}
          />
        </div>
        {storedOperator === "+" ? (
          <button
            className="bg-pink-400 p-2 rounded-sm"
            onClick={() => handleOperator("+")}
          >
            +
          </button>
        ) : (
          <button
            className="bg-pink-300 hover:bg-pink-400 p-2 rounded-sm"
            onClick={() => handleOperator("+")}
          >
            +
          </button>
        )}
        {storedOperator === "-" ? (
          <button
            className="bg-pink-400 p-2 rounded-sm"
            onClick={() => handleOperator("-")}
          >
            -
          </button>
        ) : (
          <button
            className="bg-pink-300 hover:bg-pink-400 p-2 rounded-sm"
            onClick={() => handleOperator("-")}
          >
            -
          </button>
        )}
        {storedOperator === "*" ? (
          <button
            className="bg-pink-400 p-2 rounded-sm"
            onClick={() => handleOperator("*")}
          >
            x
          </button>
        ) : (
          <button
            className="bg-pink-300 hover:bg-pink-400 p-2 rounded-sm"
            onClick={() => handleOperator("*")}
          >
            x
          </button>
        )}
        {storedOperator === "/" ? (
          <button
            className="bg-pink-400 p-2 rounded-sm"
            onClick={() => handleOperator("/")}
          >
            ÷
          </button>
        ) : (
          <button
            className="bg-pink-300 hover:bg-pink-400 p-2 rounded-sm"
            onClick={() => handleOperator("/")}
          >
            ÷
          </button>
        )}
        <div className="grid grid-cols-3 col-span-3 gap-2">
          <button
            className="bg-gray-300 p-2 rounded-sm hover:bg-gray-400"
            onClick={() => appendNumber("7")}
          >
            7
          </button>
          <button
            className="bg-gray-300 p-2 rounded-sm hover:bg-gray-400"
            onClick={() => appendNumber("8")}
          >
            8
          </button>
          <button
            className="bg-gray-300 p-2 rounded-sm hover:bg-gray-400"
            onClick={() => appendNumber("9")}
          >
            9
          </button>
          <button
            className="bg-gray-300 p-2 rounded-sm hover:bg-gray-400"
            onClick={() => appendNumber("4")}
          >
            4
          </button>
          <button
            className="bg-gray-300 p-2 rounded-sm hover:bg-gray-400"
            onClick={() => appendNumber("5")}
          >
            5
          </button>
          <button
            className="bg-gray-300 p-2 rounded-sm hover:bg-gray-400"
            onClick={() => appendNumber("6")}
          >
            6
          </button>
          <button
            className="bg-gray-300 p-2 rounded-sm hover:bg-gray-400"
            onClick={() => appendNumber("1")}
          >
            1
          </button>
          <button
            className="bg-gray-300 p-2 rounded-sm hover:bg-gray-400"
            onClick={() => appendNumber("2")}
          >
            2
          </button>
          <button
            className="bg-gray-300 p-2 rounded-sm hover:bg-gray-400"
            onClick={() => appendNumber("3")}
          >
            3
          </button>
          <button
            className="bg-gray-300 p-2 rounded-sm hover:bg-gray-400"
            onClick={() => appendNumber("0")}
          >
            0
          </button>
          <button
            className="bg-gray-300 p-2 rounded-sm hover:bg-gray-400"
            onClick={() => appendNumber(".")}
          >
            .
          </button>
          <button
            className="bg-gray-300 p-2 rounded-sm hover:bg-gray-400"
            onClick={() => {
              setInputNumber("");
              setStoredOperator("");
            }}
          >
            C
          </button>
        </div>

        <button
          className="bg-pink-300 hover:bg-pink-400 p-2 rounded-sm"
          onClick={handleCalculation}
        >
          =
        </button>
      </div>
    </div>
  );
}
