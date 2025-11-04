import GameCard from "../components/Common/GameCard";
import { useBlog } from "../context/BlogContext";
import { useState, useEffect, useCallback, useRef } from "react";
import "../App.css";

export default function Catalogue() {
  const { games, loading } = useBlog();
  const [sortOption, setSortOption] = useState("newest");
  const [allGames, setAllGames] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentApiPage, setCurrentApiPage] = useState(1);
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);
  const loadingRef = useRef(false);

  // Nouvel état pour gérer l'ouverture/fermeture du menu sur mobile
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  const loadGenres = useCallback(async () => {
    try {
      const response = await fetch(
        `https://api.rawg.io/api/genres?key=49e293944c8e42c69921316ec1e98b46`
      );
      const data = await response.json();
      setGenres(data.results || []);
    } catch (error) {
      console.error("Error loading genres:", error);
    }
  }, []);

  const loadMoreGames = useCallback(async () => {
    if (loadingRef.current || !hasMore || loadingMore || isFiltering) return;
    loadingRef.current = true;
    setLoadingMore(true);

    try {
      const nextPage = currentApiPage + 1;
      let apiUrl = `https://api.rawg.io/api/games?key=49e293944c8e42c69921316ec1e98b46&page=${nextPage}&page_size=40`;

      if (selectedGenres.length > 0) {
        apiUrl += `&genres=${selectedGenres.join(",")}`;
      }

      if (searchTerm) {
        apiUrl += `&search=${encodeURIComponent(searchTerm)}`;
      }

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        setAllGames((prev) => [...prev, ...data.results]);
        setCurrentApiPage(nextPage);
        if (!data.next) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more games:", error);
    } finally {
      setLoadingMore(false);
      loadingRef.current = false;
    }
  }, [
    currentApiPage,
    hasMore,
    loadingMore,
    selectedGenres,
    searchTerm,
    isFiltering,
  ]);

  const reloadGamesWithFilters = useCallback(async () => {
    setIsFiltering(true);
    setAllGames([]);
    setCurrentApiPage(1);
    setHasMore(true);
    loadingRef.current = true;

    try {
      let apiUrl = `https://api.rawg.io/api/games?key=49e293944c8e42c69921316ec1e98b46&page=1&page_size=40`;

      if (selectedGenres.length > 0) {
        apiUrl += `&genres=${selectedGenres.join(",")}`;
      }

      if (searchTerm) {
        apiUrl += `&search=${encodeURIComponent(searchTerm)}`;
      }

      const response = await fetch(apiUrl);
      const data = await response.json();

      setAllGames(data.results || []);
      setHasMore(!!data.next);
    } catch (error) {
      console.error("Error reloading games:", error);
    } finally {
      loadingRef.current = false;
      setIsFiltering(false);
    }
  }, [selectedGenres, searchTerm]);

  useEffect(() => {
    const handleScroll = () => {
      if (loadingRef.current || !hasMore || isFiltering) return;
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      if (scrollTop + clientHeight >= scrollHeight * 0.8) {
        loadMoreGames();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMoreGames, hasMore, isFiltering]);

  useEffect(() => {
    if (games?.results && selectedGenres.length === 0 && !searchTerm) {
      setAllGames(games.results);
    }
  }, [games, selectedGenres, searchTerm]);

  useEffect(() => {
    loadGenres();
  }, [loadGenres]);

  useEffect(() => {
    if (selectedGenres.length > 0 || searchTerm) {
      const timer = setTimeout(() => {
        reloadGamesWithFilters();
      }, 300);
      return () => clearTimeout(timer);
    } else if (games?.results) {
      setAllGames(games.results);
      setCurrentApiPage(1);
      setHasMore(true);
    }
  }, [selectedGenres, searchTerm, reloadGamesWithFilters, games]);

  const handleSortChange = (newSortOption) => {
    setSortOption(newSortOption);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleGenre = (genreId) => {
    setSelectedGenres((prev) => {
      const newSelection = prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId];
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
      return newSelection;
    });
  };

  const clearAllFilters = () => {
    setSelectedGenres([]);
    setSearchTerm("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasActiveFilters = selectedGenres.length > 0 || searchTerm;

  if (loading) return <p className="text-center text-xl">Loading...</p>;
  if (!allGames.length && !isFiltering && !hasActiveFilters)
    return <p className="text-center text-xl">No games found.</p>;

  const sortedGames = [...allGames].sort((a, b) => {
    if (sortOption === "oldest")
      return new Date(a.released) - new Date(b.released);
    if (sortOption === "newest")
      return new Date(b.released) - new Date(a.released);
    if (sortOption === "most-popular") return b.rating - a.rating;
    if (sortOption === "least-popular") return a.rating - b.rating;
    if (sortOption === "alphabetical") return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div className="p-4 sm:p-10 w-full mx-auto flex flex-col items-center">
      {/* Options de tri */}
      <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-8 flex-wrap justify-center w-full max-w-7xl">
        <button
          className={`px-3 py-1 text-sm sm:px-4 sm:py-2 rounded transition-colors ${
            sortOption === "newest"
              ? "bg-[#CF35DE] text-gray-100"
              : "bg-[#332842] text-gray-100 hover:bg-gray-600"
          }`}
          onClick={() => handleSortChange("newest")}
        >
          Newest
        </button>
        <button
          className={`px-3 py-1 text-sm sm:px-4 sm:py-2 rounded transition-colors ${
            sortOption === "oldest"
              ? "bg-[#CF35DE] text-gray-100"
              : "bg-[#332842] text-gray-100 hover:bg-gray-600"
          }`}
          onClick={() => handleSortChange("oldest")}
        >
          Oldest
        </button>
        <button
          className={`px-3 py-1 text-sm sm:px-4 sm:py-2 rounded transition-colors ${
            sortOption === "most-popular"
              ? "bg-[#CF35DE] text-gray-100"
              : "bg-[#332842] text-gray-100 hover:bg-gray-600"
          }`}
          onClick={() => handleSortChange("most-popular")}
        >
          Most popular
        </button>
        <button
          className={`px-3 py-1 text-sm sm:px-4 sm:py-2 rounded transition-colors ${
            sortOption === "least-popular"
              ? "bg-[#CF35DE] text-gray-100"
              : "bg-[#332842] text-gray-100 hover:bg-gray-600"
          }`}
          onClick={() => handleSortChange("least-popular")}
        >
          Least popular
        </button>
        <button
          className={`px-3 py-1 text-sm sm:px-4 sm:py-2 rounded transition-colors ${
            sortOption === "alphabetical"
              ? "bg-[#CF35DE] text-gray-100"
              : "bg-[#332842] text-gray-100 hover:bg-gray-600"
          }`}
          onClick={() => handleSortChange("alphabetical")}
        >
          A → Z
        </button>
      </div>

      {/* SECTION FILTRES MOBILES (MENU DÉROULANT) */}
      <div className="sm:hidden w-full max-w-7xl mb-8 text-center">
        <button
          onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
          className="w-full px-4 py-2 bg-[#332842] text-gray-50 rounded flex justify-between items-center"
        >
          Filter by Genre
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${
              isFilterMenuOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        <div
          className={`transition-all duration-300 ease-in-out ${
            isFilterMenuOpen ? "h-auto opacity-100" : "h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            {genres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => toggleGenre(genre.id)}
                className={`px-3 py-2 rounded-full text-sm transition-colors ${
                  selectedGenres.includes(genre.id)
                    ? "bg-[#CF35DE] text-white"
                    : "bg-[#332842] text-gray-300 hover:bg-gray-600"
                }`}
              >
                {genre.name}
                {selectedGenres.includes(genre.id) && (
                  <span className="ml-1">×</span>
                )}
              </button>
            ))}
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1 mt-4 mx-auto"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* SECTION FILTRES DESKTOP (TOUJOURS VISIBLES) */}
      <div className="hidden sm:block w-full max-w-7xl mb-8 text-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-200">
            Filter by Genre:
          </h3>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Clear all filters
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => toggleGenre(genre.id)}
              className={`px-3 py-2 rounded-full text-sm transition-colors ${
                selectedGenres.includes(genre.id)
                  ? "bg-[#CF35DE] text-white"
                  : "bg-[#332842] text-gray-300 hover:bg-gray-600"
              }`}
            >
              {genre.name}
              {selectedGenres.includes(genre.id) && (
                <span className="ml-1">×</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Le reste du code est inchangé */}
      {isFiltering && (
        <div className="mb-8 flex items-center justify-center">
          <div className="flex items-center space-x-2 text-[#CF35DE]">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#CF35DE]"></div>
            <span>Filtering games...</span>
          </div>
        </div>
      )}

      {sortedGames.length === 0 && !isFiltering ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-400 mb-2">No games found</p>
          <p className="text-gray-500">
            Try adjusting your filters or search terms
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="mt-4 px-4 py-2 bg-[#CF35DE] text-white rounded hover:bg-purple-600 transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 w-full max-w-7xl">
          {sortedGames.map((game, index) => (
            <GameCard key={`${game.id}-${index}`} game={game} />
          ))}
        </div>
      )}

      {loadingMore && (
        <div className="mt-8 flex items-center justify-center">
          <div className="flex items-center space-x-2 text-[#CF35DE]">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#CF35DE]"></div>
            <span>Loading more games...</span>
          </div>
        </div>
      )}

      {!hasMore && !loadingMore && sortedGames.length > 0 && (
        <div className="mt-8 text-center text-gray-400">
          <p>🎮 You have seen all the available games!</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="mt-2 px-4 py-2 bg-[#332842] text-gray-100 rounded hover:bg-gray-600 transition-colors"
          >
            ↑ Back to top
          </button>
        </div>
      )}

      <ScrollToTopButton />
    </div>
  );
}

function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) setIsVisible(true);
      else setIsVisible(false);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-[#CF35DE] hover:bg-purple-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50"
          aria-label="Back to top"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </>
  );
}