import { useState } from "react";

const fruits = ["Apple", "Orange", "Banana", "Apricot", "Grape", "Strawberry"];

export default function Search() {
  const [input, setInput] = useState<string>("");
  const [queryResult, setQueryResult] = useState<string[]>(["Apple", "Banana"]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const query = e.target.value;
    setInput(query);

    if (query.length === 0) {
      setQueryResult(fruits);
    } else {
      const matchingFruits = fruits.filter(fruit => fruit.toLowerCase().includes(query.toLowerCase()));
      setQueryResult(matchingFruits);
    }
  }

  function handleDisplayMatch(fruit: string) {
    // split fruit into parts that are match and not
    // bold the parts that match
    const lowercaseFruit = fruit.toLowerCase();
    const lowercaseInput = input.toLowerCase();
    const queryStart = lowercaseFruit.indexOf(lowercaseInput);
    const queryEnd = queryStart + input.length;
    return (
      <span>
        {fruit.substring(0, queryStart)}
        <strong className="font-extrabold">{fruit.substring(queryStart, queryEnd)}</strong>
        {fruit.substring(queryEnd)}
      </span>
    )
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
      {queryResult.length > 0 ? (
        queryResult.map((fruit) =>
          handleDisplayMatch(fruit)
        )
      ) : (
        input.length > 0 && <p>No results found.</p>
      )}
    </div>
  );
}
