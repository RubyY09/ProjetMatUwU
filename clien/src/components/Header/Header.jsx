import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";

export default function Header() {
  const { userConnected, logout } = useAuth();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  // Débounce pour éviter trop d'appels API
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim() && search.length >= 3) {
        fetchGames(search.trim());
      } else {
        setResults([]);
      }
    }, 300); // Attendre 300ms après la dernière frappe

    return () => clearTimeout(timer);
  }, [search]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/games/${results[0]?.id || search}`);
      setSearch("");
      setResults([]);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearch(value);
  };

  const fetchGames = async (query) => {
    try {
      const res = await fetch(
        `https://api.rawg.io/api/games?key=49e293944c8e42c69921316ec1e98b46&search=${encodeURIComponent(
          query
        )}&page_size=5`
      );
      const data = await res.json();
      if (data.results) {
        setResults(data.results);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error("Error fetching games:", err);
      setResults([]);
    }
  };

  const handleGameSelect = (game) => {
    navigate(`/game/${game.id}`);
    setSearch("");
    setResults([]);
  };

  return (
    <header className="bg-white shadow-md p-4 flex flex-row justify-between items-center">
      <NavLink to="/" className="flex items-center gap-15 text-zinc-50">
        <img src="public/logo.png" alt="logo du site" className="w-21" />
        <a className="border-1 pt-1 pb-1 ps-5 pe-5 rounded-4xl hover:bg-gray-100 hover:text-black hover:font-semibold">
          HOME
        </a>
        <NavLink
          to="/games"
          className="border-1 pt-1 pb-1 ps-5 pe-5 rounded-4xl hover:bg-gray-100 hover:text-black hover:font-semibold"
        >
          GAMES
        </NavLink>
        <a className="border-1 pt-1 pb-1 ps-5 pe-5 rounded-4xl hover:bg-gray-100 hover:text-black hover:font-semibold">
          FAVORITES
        </a>
        <a
          to="/test"
          className="border-1 pt-1 pb-1 ps-5 pe-5 rounded-4xl transition-all hover:bg-gray-100 hover:text-black hover:font-semibold"
        >
          CONTACT
        </a>
      </NavLink>

      <nav className="flex space-x-6 relative">
        <form
          onSubmit={handleSearch}
          className="flex flex-col items-start relative"
        >
          <div className="flex items-center text-gray-50 bg-[#272727] rounded-full px-4  w-150">
            <input
              type="text"
              value={search}
              onChange={handleChange}
              placeholder="Search games... (min 3 characters)"
              className="flex-1 bg-white text-gray-100 placeholder-gray-500  rounded-full px-3 py-1"
              aria-label="Rechercher des jeux"
              aria-expanded={results.length > 0}
              aria-haspopup="listbox"
              role="combobox"
              aria-autocomplete="list"
            />
          </div>

          {results.length > 0 && (
            <div
              className="absolute top-full left-0 mt-2 w-150 z-50"
              role="listbox"
            >
              <ul className="bg-white   rounded-lg shadow-xl max-h-60 ">
                {results.map((game, index) => (
                  <li
                    key={game.id}
                    onClick={() => handleGameSelect(game)}
                    className=" cursor-pointer py-1 f   transition-colors duration-150 "
                    role="option"
                    aria-selected="false"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleGameSelect(game);
                      }
                    }}
                  >
                    <p className="text-sm font-medium text-gray-100 bg-[#272727] py-3 rounded-3xl  truncate hover:bg-[#1b1b1b]">
                      {game.name}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {search.length > 0 && search.length < 3 && (
            <div className="absolute top-full left-0 mt-2 w-150 z-50">
              <div className="bg-white  rounded-lg shadow-lg ">
                <p
                  className="text-sm text-gray-50 bg-[#272727] p-3 rounded-3xl"
                  role="status"
                  aria-live="polite"
                >
                  Tapez au moins 3 caractères pour rechercher...
                </p>
              </div>
            </div>
          )}
        </form>

        {userConnected ? (
          <>
            <NavLink
              to="/blog"
              className="bg-gray-100 pt-1 pb-1 ps-5 pe-5 rounded-4xl hover:font-semibold"
            >
              Blog
            </NavLink>
            <NavLink
              to="/login"
              onClick={logout}
              className="bg-gray-100 pt-1 pb-1 ps-5 pe-5 rounded-4xl hover:font-semibold"
            >
              Disconnection
            </NavLink>
          </>
        ) : (
          <>
            <NavLink
              to="/login"
              className="bg-gray-100 pt-1 pb-1 ps-5 pe-5 rounded-4xl hover:font-semibold"
            >
              Login
            </NavLink>
            <NavLink
              to="/register"
              className="bg-gray-100 pt-1 pb-1 ps-5 pe-5 rounded-4xl hover:font-semibold"
            >
              Register
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
}
