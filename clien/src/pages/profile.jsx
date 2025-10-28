// src/pages/Profile.jsx
import { Link, useNavigate } from "react-router-dom";
import { Heart, User, LogOut } from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Profile() {
  const { favorites, removeFavorite } = useFavorites();
  const { userConnected, logout } = useAuth(); // ✅ CHANGÉ: user → userConnected
  const navigate = useNavigate();

  console.log("👤 Utilisateur sur Profile:", userConnected); // Debug

  // Redirection si non connecté
  if (!userConnected) { // ✅ CHANGÉ
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-50">
        <div className="text-center">
          <User size={80} className="mx-auto mb-4 text-gray-600" />
          <p className="text-2xl text-gray-400 mb-4">Vous devez être connecté</p>
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
        </div>
      </div>

      {/* Section des favoris */}
      <div className="mt-10">
        <h2 className="text-4xl md:text-4xl font-bold mb-6 text-left ">FAVORITES GAMES</h2>
        
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