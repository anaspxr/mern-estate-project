import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <header className="bg-green-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex-wrap">
            <span className="text-green-600">Resorts</span>
            <span className="text-green-800">Find</span>
          </h1>
        </Link>
        <form className="bg-green-100 p-3 rounded-lg flex items-center">
          <input
            type="text"
            placeholder="Search.."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
          />
          <FaSearch className="text-green-800"></FaSearch>
        </form>
        <ul className="flex gap-4">
          <Link to="/">
            <li className="hidden sm:inline text-green-700 hover:underline">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-green-700 hover:underline">
              About
            </li>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img className="rounded-full h-7 w-7 object-cover" src={currentUser.avatar} alt="profile" />
            ) : (
              <li className="text-green-700 hover:underline">SignIn</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
