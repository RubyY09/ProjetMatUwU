import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";

export default function Header() {
  const { userConnected, logout } = useAuth();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className=" shadow-md">
      {/* Desktop Header */}
      <div className="hidden xl:flex p-3 flex-row justify-between items-center ">
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
            <div className="flex items-center text-gray-50 bg-[#272727] rounded-full px-4 w-150">
              <input
                type="text"
                value={search}
                onChange={handleChange}
                placeholder="Search games... (min 3 characters)"
                className="flex-1 bg-white text-gray-100 placeholder-gray-500 rounded-full px-3 py-1"
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
                <ul className="bg-white rounded-lg shadow-xl max-h-60">
                  {results.map((game, index) => (
                    <li
                      key={game.id}
                      onClick={() => handleGameSelect(game)}
                      className="cursor-pointer py-1 transition-colors duration-150"
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
                      <p className="text-sm font-medium text-gray-100 bg-[#272727] py-3 rounded-3xl truncate hover:bg-[#1b1b1b]">
                        {game.name}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {search.length > 0 && search.length < 3 && (
              <div className="absolute top-full left-0 mt-2 w-150 z-50">
                <div className="bg-white rounded-lg shadow-lg">
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
                to="/profile"
                className="bg-gray-100 pt-1 pb-1 ps-5 pe-5 rounded-4xl hover:font-semibold"
              >
                PROFIL
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
      </div>

      {/* Large Tablet/Small Desktop Header */}
      <div className="hidden lg:flex xl:hidden p-4 flex-row justify-between items-center">
        <NavLink to="/" className="flex items-center gap-4 text-zinc-50">
          <img src="public/logo.png" alt="logo du site" className="w-16" />
          <NavLink
            to="/"
            className="border-1 pt-1 pb-1 ps-3 pe-3 rounded-4xl hover:bg-gray-100 hover:text-black hover:font-semibold text-sm"
          >
            HOME
          </NavLink>
          <NavLink
            to="/games"
            className="border-1 pt-1 pb-1 ps-3 pe-3 rounded-4xl hover:bg-gray-100 hover:text-black hover:font-semibold text-sm"
          >
            GAMES
          </NavLink>
          <a className="border-1 pt-1 pb-1 ps-3 pe-3 rounded-4xl hover:bg-gray-100 hover:text-black hover:font-semibold text-sm">
            FAVORITES
          </a>
          <a className="border-1 pt-1 pb-1 ps-3 pe-3 rounded-4xl hover:bg-gray-100 hover:text-black hover:font-semibold text-sm">
            CONTACT
          </a>
        </NavLink>

        <nav className="flex space-x-3 relative">
          <form
            onSubmit={handleSearch}
            className="flex flex-col items-start relative"
          >
            <div className="flex items-center text-gray-50 bg-[#272727] rounded-full px-3 w-48">
              <input
                type="text"
                value={search}
                onChange={handleChange}
                placeholder="Search games..."
                className="flex-1 bg-white text-gray-100 placeholder-gray-500 rounded-full px-3 py-1 text-sm"
                aria-label="Rechercher des jeux"
                aria-expanded={results.length > 0}
                aria-haspopup="listbox"
                role="combobox"
                aria-autocomplete="list"
              />
            </div>

            {results.length > 0 && (
              <div
                className="absolute top-full left-0 mt-2 w-48 z-50"
                role="listbox"
              >
                <ul className="bg-white rounded-lg shadow-xl max-h-60">
                  {results.map((game) => (
                    <li
                      key={game.id}
                      onClick={() => handleGameSelect(game)}
                      className="cursor-pointer py-1 transition-colors duration-150"
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
                      <p className="text-sm font-medium text-gray-100 bg-[#272727] py-2 rounded-3xl truncate hover:bg-[#1b1b1b] mx-1">
                        {game.name}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {search.length > 0 && search.length < 3 && (
              <div className="absolute top-full left-0 mt-2 w-48 z-50">
                <div className="bg-white rounded-lg shadow-lg">
                  <p
                    className="text-sm text-gray-50 bg-[#272727] p-2 rounded-3xl"
                    role="status"
                    aria-live="polite"
                  >
                    Min 3 caractères...
                  </p>
                </div>
              </div>
            )}
          </form>

          {userConnected ? (
            <>
              <NavLink
                to="/blog"
                className="bg-gray-100 pt-1 pb-1 ps-3 pe-3 rounded-4xl hover:font-semibold text-sm"
              >
                Blog
              </NavLink>
              <NavLink
                to="/login"
                onClick={logout}
                className="bg-gray-100 pt-1 pb-1 ps-3 pe-3 rounded-4xl hover:font-semibold text-sm"
              >
                Logout
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="bg-gray-100 pt-1 pb-1 ps-3 pe-3 rounded-4xl hover:font-semibold text-sm"
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="bg-gray-100 pt-1 pb-1 ps-3 pe-3 rounded-4xl hover:font-semibold text-sm"
              >
                Register
              </NavLink>
            </>
          )}
        </nav>
      </div>

      {/* Tablet Header */}
      <div className="hidden md:flex lg:hidden p-4 flex-col gap-4">
        <div className="flex justify-between items-center">
          <NavLink to="/" className="flex items-center gap-4 text-zinc-50">
            <img src="public/logo.png" alt="logo du site" className="w-16" />
          </NavLink>
          
          <div className="flex items-center gap-4">
            {userConnected ? (
              <>
                <NavLink
                  to="/blog"
                  className="bg-gray-100 pt-1 pb-1 ps-3 pe-3 rounded-4xl hover:font-semibold text-sm"
                >
                  Blog
                </NavLink>
                <NavLink
                  to="/login"
                  onClick={logout}
                  className="bg-gray-100 pt-1 pb-1 ps-3 pe-3 rounded-4xl hover:font-semibold text-sm"
                >
                  Logout
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="bg-gray-100 pt-1 pb-1 ps-3 pe-3 rounded-4xl hover:font-semibold text-sm"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="bg-gray-100 pt-1 pb-1 ps-3 pe-3 rounded-4xl hover:font-semibold text-sm"
                >
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <nav className="flex space-x-4 text-zinc-50">
            <NavLink
              to="/"
              className="border-1 pt-1 pb-1 ps-4 pe-4 rounded-4xl hover:bg-gray-100 hover:text-black hover:font-semibold text-sm"
            >
              HOME
            </NavLink>
            <NavLink
              to="/games"
              className="border-1 pt-1 pb-1 ps-4 pe-4 rounded-4xl hover:bg-gray-100 hover:text-black hover:font-semibold text-sm"
            >
              GAMES
            </NavLink>
            <a className="border-1 pt-1 pb-1 ps-4 pe-4 rounded-4xl hover:bg-gray-100 hover:text-black hover:font-semibold text-sm">
              FAVORITES
            </a>
            <a className="border-1 pt-1 pb-1 ps-4 pe-4 rounded-4xl hover:bg-gray-100 hover:text-black hover:font-semibold text-sm">
              CONTACT
            </a>
          </nav>

          <form onSubmit={handleSearch} className="flex flex-col items-end relative">
            <div className="flex items-center text-gray-50 bg-[#272727] rounded-full px-3 w-64">
              <input
                type="text"
                value={search}
                onChange={handleChange}
                placeholder="Search games..."
                className="flex-1 bg-white text-gray-100 placeholder-gray-500 rounded-full px-3 py-1 text-sm"
                aria-label="Rechercher des jeux"
                aria-expanded={results.length > 0}
                aria-haspopup="listbox"
                role="combobox"
                aria-autocomplete="list"
              />
            </div>

            {results.length > 0 && (
              <div
                className="absolute top-full right-0 mt-2 w-64 z-50"
                role="listbox"
              >
                <ul className="bg-white rounded-lg shadow-xl max-h-60">
                  {results.map((game) => (
                    <li
                      key={game.id}
                      onClick={() => handleGameSelect(game)}
                      className="cursor-pointer py-1 transition-colors duration-150"
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
                      <p className="text-sm font-medium text-gray-100 bg-[#272727] py-3 rounded-3xl truncate hover:bg-[#1b1b1b]">
                        {game.name}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {search.length > 0 && search.length < 3 && (
              <div className="absolute top-full right-0 mt-2 w-64 z-50">
                <div className="bg-white rounded-lg shadow-lg">
                  <p
                    className="text-sm text-gray-50 bg-[#272727] p-3 rounded-3xl"
                    role="status"
                    aria-live="polite"
                  >
                    Min 3 caractères...
                  </p>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden p-4">
        <div className="flex justify-between items-center">
          <NavLink to="/" className="flex items-center">
            <img src="public/logo.png" alt="logo du site" className="w-12" />
          </NavLink>

          <button
            onClick={toggleMobileMenu}
            className="bg-gray-100 p-2 rounded-lg hover:bg-gray-200 transition-colors"
            aria-label="Ouvrir le menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="mt-4 space-y-4 border-t pt-4">
            {/* Search Bar Mobile */}
            <form onSubmit={handleSearch} className="relative">
              <div className="flex items-center text-gray-50 bg-[#272727] rounded-full px-3">
                <input
                  type="text"
                  value={search}
                  onChange={handleChange}
                  placeholder="Search games..."
                  className="flex-1 bg-white text-gray-100 placeholder-gray-500 rounded-full px-3 py-2 text-sm"
                  aria-label="Rechercher des jeux"
                />
              </div>

              {results.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-full z-50" role="listbox">
                  <ul className="bg-white rounded-lg shadow-xl max-h-60">
                    {results.map((game) => (
                      <li
                        key={game.id}
                        onClick={() => {
                          handleGameSelect(game);
                          setIsMobileMenuOpen(false);
                        }}
                        className="cursor-pointer py-1 transition-colors duration-150"
                        role="option"
                        aria-selected="false"
                        tabIndex={0}
                      >
                        <p className="text-sm font-medium text-gray-100 bg-[#272727] py-3 rounded-3xl truncate hover:bg-[#1b1b1b] mx-2">
                          {game.name}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </form>

            {/* Navigation Mobile */}
            <nav className="flex flex-col space-y-2">
              <NavLink
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-center border-1 pt-2 pb-2 rounded-4xl hover:bg-gray-100 hover:text-black hover:font-semibold text-zinc-50"
              >
                HOME
              </NavLink>
              <NavLink
                to="/games"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-center border-1 pt-2 pb-2 rounded-4xl hover:bg-gray-100 hover:text-black hover:font-semibold text-zinc-50"
              >
                GAMES
              </NavLink>
              <a
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-center border-1 pt-2 pb-2 rounded-4xl hover:bg-gray-100 hover:text-black hover:font-semibold text-zinc-50 cursor-pointer"
              >
                FAVORITES
              </a>
              <a
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-center border-1 pt-2 pb-2 rounded-4xl hover:bg-gray-100 hover:text-black hover:font-semibold text-zinc-50 cursor-pointer"
              >
                CONTACT
              </a>
            </nav>

            {/* Auth Links Mobile */}
            <div className="flex flex-col space-y-2 border-t pt-4">
              {userConnected ? (
                <>
                  <NavLink
                    to="/blog"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-center bg-gray-100 pt-2 pb-2 rounded-4xl hover:font-semibold"
                  >
                    Blog
                  </NavLink>
                  <NavLink
                    to="/login"
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-center bg-gray-100 pt-2 pb-2 rounded-4xl hover:font-semibold"
                  >
                    Disconnection
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-center bg-gray-100 pt-2 pb-2 rounded-4xl hover:font-semibold"
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-center bg-gray-100 pt-2 pb-2 rounded-4xl hover:font-semibold"
                  >
                    Register
                  </NavLink>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}