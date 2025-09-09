// src/components/GameCard.jsx
export default function GameCard({ game }) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:scale-105 transition-transform">
      <img
        src={game.background_image}
        alt={game.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-lg font-semibold">{game.name}</h2>
        <p className="text-sm text-gray-500">
          ⭐ {game.rating} | ⏳ {game.playtime}h
        </p>
      </div>
    </div>
  );
}
