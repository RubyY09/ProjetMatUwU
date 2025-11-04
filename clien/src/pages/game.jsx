import { useEffect, useState } from "react";
import { fetchGames } from "../api/blog.api";

export default function Games() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetchGames().then((data) => setGames(data));
  }, []);

  return (
    <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {games.map((game) => (
        <div
          key={game.id}
          className="bg-gray-900 text-white rounded-xl shadow-lg p-2"
        >
          <img
            src={game.background_image}
            alt={game.name}
            className="rounded-lg mb-2 w-full h-40 object-cover"
          />
          <h2 className="text-lg font-bold">{game.name}</h2>
          <p className="text-sm text-gray-400">Sortie : {game.released}</p>
        </div>
      ))}
    </div>
  );
}
