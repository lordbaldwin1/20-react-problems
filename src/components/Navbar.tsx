import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="flex flex-row gap-4 mx-2">
      <h1 className="font-semibold">20 React Problems</h1>
      <nav>
        <Link to="/" className="text-blue-300 hover:underline mx-auto">
          Problem List
        </Link>
      </nav>
    </div>
  );
}
