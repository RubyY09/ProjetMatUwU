import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Heart, CheckCircle } from "lucide-react"; 
import toast from "react-hot-toast";
import "../App.css";
import Comments from "../components/comment";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";

export default function GameDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [similarGames, setSimilarGames] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { userConnected } = useAuth();
  const isGameFavorite = game ? isFavorite(game.id) : false;

  console.log("👤 Utilisateur connecté:", userConnected);

  // Charger l'état "terminé" depuis localStorage
  useEffect(() => {
    if (userConnected && game) {
      const completedGames = JSON.parse(localStorage.getItem(`completed_${userConnected.id}`) || '[]');
      setIsCompleted(completedGames.includes(game.id));
    }
  }, [userConnected, game]);

  // Récupération du jeux
  useEffect(() => {
    async function fetchGame() {
      try {
        const res = await fetch(
          `https://api.rawg.io/api/games/${id}?key=49e293944c8e42c69921316ec1e98b46`
        );
        const data = await res.json();
        setGame(data);
      } catch (err) {
        console.error("Erreur :", err);
      } finally {
        setLoading(false);
      }
    }
    fetchGame();
  }, [id]);

  // Récupération des jeux similaires
  useEffect(() => {
    async function fetchSimilarGames() {
      if (!game || !game.genres || game.genres.length === 0) return;

      const genreSlug = game.genres[0].slug;

      try {
        const res = await fetch(
          `https://api.rawg.io/api/games?genres=${genreSlug}&key=49e293944c8e42c69921316ec1e98b46&page_size=4`
        );
        const data = await res.json();

        const filteredGames = data.results.filter((g) => g.id !== game.id);
        setSimilarGames(filteredGames);
      } catch (err) {
        console.error("Erreur jeux similaires :", err);
      }
    }

    fetchSimilarGames();
  }, [game]);

  const handleFavoriteClick = () => {
    if (!game) return;
    
    if (!userConnected) {
      toast.error("You must be logged in to add favorites");
      navigate("/login");
      return;
    }
    
    if (isGameFavorite) {
      removeFavorite(game.id);
      toast.success(`${game.name} removed from favorites`);
    } else {
      addFavorite({
        id: game.id,
        name: game.name,
        background_image: game.background_image,
        genres: game.genres
      });
      toast.success(`${game.name} added to favorites`);
    }
  };

  const handleCompletedClick = () => {
    if (!game) return;
    
    if (!userConnected) {
      toast.error("You must be logged in to mark a game as finished.");
      navigate("/login");
      return;
    }
    
    const completedGames = JSON.parse(localStorage.getItem(`completed_${userConnected.id}`) || '[]');
    
    if (isCompleted) {
      const updatedCompleted = completedGames.filter(gameId => gameId !== game.id);
      localStorage.setItem(`completed_${userConnected.id}`, JSON.stringify(updatedCompleted));
      setIsCompleted(false);
      toast.success(`${game.name} retiré des jeux terminés`);
    } else {
      const updatedCompleted = [...completedGames, game.id];
      localStorage.setItem(`completed_${userConnected.id}`, JSON.stringify(updatedCompleted));
      setIsCompleted(true);
      toast.success(`${game.name} marqué comme terminé`);
    }
  };

  if (loading) return <p className="text-center text-xl">Chargement...</p>;
  if (!game) return <p className="text-center text-xl">Jeu introuvable.</p>;

  return (
    <div className="mb-20">
      <div className="text-gray-50 flex flex-col items-start mt-30 mx-15">
        <div>
          <div className="flex items-start justify-between mb-6">
            <h1 className="text-9xl f BN text-start">{game.name}</h1>
            <div className="flex gap-3">
              {/* Bouton Terminé */}
              <button
                onClick={handleCompletedClick}
                className={`mt-4 p-4 rounded-full transition-all ${
                  isCompleted 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
                aria-label={isCompleted ? "Retirer des jeux terminés" : "Marquer comme terminé"}
                title={!userConnected ? "Connectez-vous pour marquer comme terminé" : ""}
              >
                <CheckCircle 
                  size={32} 
                  fill={isCompleted ? "white" : "none"}
                  stroke="white"
                />
              </button>

              {/* Bouton Favori */}
              <button
                onClick={handleFavoriteClick}
                className={`mt-4 p-4 rounded-full transition-all ${
                  isGameFavorite 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
                aria-label={isGameFavorite ? "Retirer des favoris" : "add to favorites"}
                title={!userConnected ? "Log in to add to favorites" : ""}
              >
                <Heart 
                  size={32} 
                  fill={isGameFavorite ? "white" : "none"}
                  stroke="white"
                />
              </button>
            </div>
          </div>
          
          <p className="uppercase bg-[#501c4c] text-[#BBA9BB] text-2xl px-5 py-2 w-75 rounded-3xl mb-6">
            {game.genres.map((g) => g.name).join(", ")}
          </p>
          <p className="text-lg mb-6 text-start w-3/4">
            {game.description_raw}
          </p>
          {game.background_image && (
            <img
              src={game.background_image}
              alt={game.name}
              className="rounded-2xl shadow-lg mb-6 object-cover object-top w-full h-150"
            />
          )}
        </div>
      </div>

      {/* Bandeau "AVIS" défilant */}
      <div className="overflow-hidden whitespace-nowrap w-full mt-7 p-0">
        <div className="animate-marquee text-9xl text-[#2b2929] BN">
          {Array(20).fill("OPINIONS").join("  ")}
        </div>

        {/* Section Commentaires */}
        <Comments gameId={id} />

        {/* Section Jeux Similaires */}
        {similarGames.length > 0 && (
          <div className="mt-10 mx-15">
            <h2 className="text-gray-50 text-8xl BN flex items-center">
              SIMILARY GAMES
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {similarGames.map((g) => (
                <Link key={g.id} to={`/game/${g.id}`} className="w-full">
                  <div className="text-[#BBA9BB] rounded-2xl p-3 flex flex-col items-center cursor-pointer hover:scale-105 transition-transform">
                    {g.background_image && (
                      <img
                        src={g.background_image}
                        alt={g.name}
                        className="rounded-xl mb-2 w-full h-50 object-cover"
                      />
                    )}
                    <p className="uppercase text-center text-gray-500">
                      {g.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}