// src/context/FavoritesContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('gameFavorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('gameFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (game) => {
    setFavorites(prev => {
      if (prev.some(f => f.id === game.id)) return prev;
      return [...prev, game];
    });
  };

  const removeFavorite = (gameId) => {
    setFavorites(prev => prev.filter(f => f.id !== gameId));
  };

  const isFavorite = (gameId) => {
    return favorites.some(f => f.id === gameId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
}