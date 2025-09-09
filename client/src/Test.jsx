import GameCard from "./components/Common/GameCard";
import { useBlog } from "./context/BlogContext";

export default function HomePage() {
  const { games, loading } = useBlog();

  console.log(games.results);

  if (loading) return <p className="text-center text-xl">Chargement...</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">🎮 Liste des jeux</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {games.results.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}
