import { useState } from "react";

const fruits = ["Apple", "Orange", "Banana", "Apricot", "Grape", "Strawberry"];

export default function Search() {
  const [input, setInput] = useState<string>("");
  const [queryResult, setQueryResult] = useState<string[]>(["Apple", "Banana"]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const query = e.target.value;

    const matchingFruits = fruits.filter(fruit => fruit.toLowerCase().includes(query.toLowerCase()));
    setQueryResult(matchingFruits);
    setInput(query);
  }

  return (
    <div className="flex flex-col items-center">
      <input
        className="bg-white text-black border-1 border-black rounded-sm p-1"
        type="text"
        placeholder="Enter a fruit..."
        value={input}
        onChange={handleInputChange}
      />
      <p>{input}</p>
      {queryResult.length > 0 ? (
        queryResult.map((result, index) => <p key={index}>{result}</p>)
      ) : (
        <p>No results found.</p>
      )}
      {input.length === 0 && 
        fruits.map((fruit, index) => (
          <p key={index}>{fruit}</p>
        ))
      }
    </div>
  );
}
