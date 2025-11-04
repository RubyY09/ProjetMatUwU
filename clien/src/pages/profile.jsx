// src/pages/Profile.jsx
import { Link, useNavigate } from "react-router-dom";
import { Heart, User, LogOut, CheckCircle } from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

export default function Profile() {
  const { favorites, removeFavorite } = useFavorites();
  const { userConnected, logout } = useAuth();
  const navigate = useNavigate();
  const [completedGames, setCompletedGames] = useState([]);
  const [completedGamesDetails, setCompletedGamesDetails] = useState([]);

  console.log(" Utilisateur sur Profile:", userConnected);

  // Charger les jeux terminés
  useEffect(() => {
    if (userConnected) {
      const completed = JSON.parse(localStorage.getItem(`completed_${userConnected.id}`) || '[]');
      setCompletedGames(completed);
    }
  }, [userConnected]);

  // Récupérer les détails des jeux terminés
  useEffect(() => {
    async function fetchCompletedGamesDetails() {
      if (completedGames.length === 0) {
        setCompletedGamesDetails([]);
        return;
      }

      try {
        const gamesPromises = completedGames.map(gameId =>
          fetch(`https://api.rawg.io/api/games/${gameId}?key=49e293944c8e42c69921316ec1e98b46`)
            .then(res => res.json())
        );
        const games = await Promise.all(gamesPromises);
        setCompletedGamesDetails(games);
      } catch (err) {
        console.error("Erreur lors du chargement des jeux terminés:", err);
      }
    }

    fetchCompletedGamesDetails();
  }, [completedGames]);

  // Redirection si non connecté
  if (!userConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-50">
        <div className="text-center">
          <User size={80} className="mx-auto mb-4 text-gray-600" />
          <p className="text-2xl text-gray-400 mb-4">you must connected</p>
          <Link 
            to="/login" 
            className="boutonr text-white px-6 py-3 rounded-xl inline-block"
          >
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    toast.success("Déconnecté avec succès");
    navigate("/");
  };

  const handleRemoveCompleted = (gameId, gameName) => {
    const updated = completedGames.filter(id => id !== gameId);
    localStorage.setItem(`completed_${userConnected.id}`, JSON.stringify(updated));
    setCompletedGames(updated);
    toast.success(`${gameName} retiré des jeux terminés`);
  };

  return (
    <div className="min-h-screen text-gray-50 px-4 md:px-15 py-10">
      {/* En-tête du profil */}
      <div className="mb-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
          <div>
            <h1 className="text-5xl md:text-9xl BN mb-2">{userConnected.username}</h1>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl transition-colors"
          >
            <LogOut size={20} />
            <span>DECONNECTION</span>
          </button>
        </div>

        {/* Statistiques */}
        <div className="flex flex-wrap gap-4">
          <div className="bg-[#501c4c] text-[#BBA9BB] text-xl md:text-2xl px-6 py-3 rounded-3xl flex items-center gap-3">
            <Heart size={28} fill="#BBA9BB" />
            <span className="font-bold">{favorites.length}</span>
            <span>{favorites.length > 1 ? 'FAVORIS' : 'FAVORI'}</span>
          </div>
          
          <div className="bg-green-700 text-white text-xl md:text-2xl px-6 py-3 rounded-3xl flex items-center gap-3">
            <CheckCircle size={28} />
            <span className="font-bold">{completedGames.length}</span>
            <span>{completedGames.length > 1 ? 'TERMINÉS' : 'TERMINÉ'}</span>
          </div>
        </div>
      </div>

      {/* Section des jeux terminés */}
      <div className="mt-10 mb-16">
        <h2 className="text-4xl md:text-4xl font-bold mb-6 text-left">COMPLETED GAMES</h2>
        
        {completedGamesDetails.length === 0 ? (
          <div className="text-center py-20 bg-gray-800 rounded-3xl">
            <CheckCircle size={80} className="mx-auto mb-4 text-gray-600" />
            <p className="text-2xl text-gray-400">Aucun jeu terminé</p>
            <p className="text-lg text-gray-500 mt-2 mb-6">
              Marquez des jeux comme terminés pour les retrouver ici
            </p>
            <Link 
              to="/" 
              className="boutonr text-white px-6 py-3 rounded-xl inline-block"
            >
              Découvrir des jeux
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {completedGamesDetails.map((game) => (
              <div key={game.id} className="relative group">
                <Link to={`/game/${game.id}`}>
                  <div className="bg-gray-800 rounded-2xl overflow-hidden hover:scale-105 transition-transform shadow-lg">
                    {game.background_image ? (
                      <img
                        src={game.background_image}
                        alt={game.name}
                        className="w-full h-60 object-cover"
                      />
                    ) : (
                      <div className="w-full h-60 bg-gray-700 flex items-center justify-center">
                        <User size={60} className="text-gray-500" />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                        {game.name}
                      </h3>
                      {game.genres && game.genres.length > 0 && (
                        <p className="text-sm text-[#BBA9BB] uppercase">
                          {game.genres.map(g => g.name).join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
                
                {/* Bouton retirer des jeux terminés */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveCompleted(game.id, game.name);
                  }}
                  className="absolute top-3 right-3 bg-green-500 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-green-600 z-10 shadow-lg"
                  aria-label="Retirer des jeux terminés"
                  title="Retirer des jeux terminés"
                >
                  <CheckCircle size={20} fill="white" stroke="white" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section des favoris */}
      <div className="mt-10">
        <h2 className="text-4xl md:text-4xl font-bold mb-6 text-left">FAVORITES GAMES</h2>
        
        {favorites.length === 0 ? (
          <div className="text-center py-20 bg-gray-800 rounded-3xl">
            <Heart size={80} className="mx-auto mb-4 text-gray-600" />
            <p className="text-2xl text-gray-400">Aucun jeu en favori</p>
            <p className="text-lg text-gray-500 mt-2 mb-6">
              Ajoutez des jeux à vos favoris pour les retrouver ici
            </p>
            <Link 
              to="/" 
              className="boutonr text-white px-6 py-3 rounded-xl inline-block"
            >
              Découvrir des jeux
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((game) => (
              <div key={game.id} className="relative group">
                <Link to={`/game/${game.id}`}>
                  <div className="bg-gray-800 rounded-2xl overflow-hidden hover:scale-105 transition-transform shadow-lg">
                    {game.background_image ? (
                      <img
                        src={game.background_image}
                        alt={game.name}
                        className="w-full h-60 object-cover"
                      />
                    ) : (
                      <div className="w-full h-60 bg-gray-700 flex items-center justify-center">
                        <User size={60} className="text-gray-500" />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                        {game.name}
                      </h3>
                      {game.genres && game.genres.length > 0 && (
                        <p className="text-sm text-[#BBA9BB] uppercase">
                          {game.genres.map(g => g.name).join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
                
                {/* Bouton retirer des favoris */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFavorite(game.id);
                    toast.success(`${game.name} retiré des favoris`);
                  }}
                  className="absolute top-3 right-3 bg-red-500 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10 shadow-lg"
                  aria-label="Retirer des favoris"
                  title="Retirer des favoris"
                >
                  <Heart size={20} fill="white" stroke="white" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}