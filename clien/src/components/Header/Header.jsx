import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

export default function Header() {
  const { userConnected, logout } = useAuth();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  // Exemple de jeux (tu remplaceras ça par ta vraie liste ou un fetch API)
  const games = [
    "Mario Kart",
    "Minecraft",
    "FIFA 25",
    "Zelda",
    "Call of Duty",
    "Fortnite",
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?query=${encodeURIComponent(search)}`);
      setSearch("");
      setResults([]);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim()) {
      // filtre les jeux qui commencent par la recherche
      const filtered = games.filter((g) =>
        g.toLowerCase().startsWith(value.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  };

  return (
    <header className="bg-white shadow-md p-4 flex flex-row justify-between items-center">
      <NavLink to="/" className="flex items-center gap-15 text-zinc-50">
        <img src="public/logo.png" alt="logo du site" className="w-21" />
        <a className="border-1 pt-1 pb-1 ps-5 pe-5 rounded-4xl hover:bg-gray-100 hover:text-black hover:font-semibold">
          HOMES
        </a>
         <NavLink to="/test" className="border-1 pt-1 pb-1 ps-5 pe-5 rounded-4xl hover:bg-gray-100 hover:text-black hover:font-semibold">
          
          GAMES
        
        </NavLink>
        <a className="border-1 pt-1 pb-1 ps-5 pe-5 rounded-4xl hover:bg-gray-100 hover:text-black hover:font-semibold">
          FAVORITE
        </a>
       
        <a     to="/test" className="border-1 pt-1 pb-1 ps-5 pe-5 rounded-4xl transition-all hover:bg-gray-100 hover:text-black hover:font-semibold">
          CONTACT
        </a>
      </NavLink>

      <nav className="flex space-x-6 relative">
        {/* BARRE DE RECHERCHE */}
        <form onSubmit={handleSearch} className="flex flex-col items-start">
          <div className="flex items-center text-gray-50  bg-[#272727] rounded-full px-4 py-1 w-150">
            <input
              type="text"
              value={search}
              onChange={handleChange}
              placeholder="Search..."
              className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none"
            />
          </div>

          {/* Résultats de recherche en direct */}
          {results.length > 0 && (
            <ul className="absolute top-12 bg-white shadow-lg rounded-md w-80 max-h-60 overflow-y-auto z-50">
              {results.map((game, idx) => (
                <li
                  key={idx}
                  onClick={() => {
                    navigate(`/games/${game}`);
                    setSearch("");
                    setResults([]);
                  }}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                >
                  {game}
                </li>
              ))}
            </ul>
          )}
        </form>

        {userConnected ? (
          <>
            <NavLink
              to="/blog"
              className=" bg-gray-100 pt-1 pb-1 ps-5 pe-5 rounded-4xl hover:font-semibold"
            >
              Blog
            </NavLink>
            <NavLink
              to="/login"
              onClick={logout}
              className=" bg-gray-100 pt-1 pb-1 ps-5 pe-5 rounded-4xl hover:font-semibold"
            >
              Disconnection
            </NavLink>
          </>
        ) : (
          <>
            <NavLink
              to="/login"
              className=" bg-gray-100 pt-1 pb-1 ps-5 pe-5 rounded-4xl hover:font-semibold "
            >
              Login
            </NavLink>
            <NavLink
              to="/register"
              className=" bg-gray-100 pt-1 pb-1 ps-5 pe-5 rounded-4xl hover:font-semibold "
            >
              Register
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
}
