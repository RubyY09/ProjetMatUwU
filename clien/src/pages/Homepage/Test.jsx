import GameCard from "../../components/Common/GameCard";
import { useBlog } from "../../context/BlogContext";
import "../../App";
import Games from "../Catalogue";
import { Link } from "react-router-dom";

export default function Test() {
  const { games, loading } = useBlog();

  console.log(games.results);

  if (loading) return <p className="text-center text-xl">Chargement...</p>;

  return (
    <div>
      <div className="flex flex-col gap-10 px-4 py-8 m-5  ">
        <div className="flex   ">
          <div className="w-115 ">
            <div className="flex items-center  gap-4">
              <h2 className="text-purple-500 text-9xl BN ">EN</h2>
            </div>
            <h2 className="text-gray-50 text-9xl BN  flex items-center">
              COURS
            </h2>
          </div>

          <div className="flex gap-15">
            {games.results
              .filter((game, index) => {
                // exclure les 5 premiers (meilleurs) et les 5 derniers (récents)
                return index >= 5 && index < games.results.length - 5;
              })

              .slice(0, 5) // prend 5 jeux
              .map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
          </div>
        </div>
        <div className="flex justify-end gap-4 mb-8 ">
          <Link to="/games">
  <button 
    className="boutoncontour text-gray-50 pt-1 pb-1 ps-8 pe-8" 
    aria-label="Voir plus de jeux de votre bibliothèque"
    type="button"
  >
    SEE MORE
  </button>
</Link>


          <Link to="/games">
            <button className="boutoncontour text-gray-50 pt-1 pb-1 ps-5 pe-5"  aria-label="Voir plus de jeux de votre bibliothèque">
              &gt;
            </button >
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-10 px-4 py-8 m-5  ">
        <div className="flex   ">
          <div className="w-115  ">
            <div className="flex items-center  gap-4">
              <h2 className="text-purple-500 text-9xl BN ">TOP</h2>
              <img className="h-[9vh]" src="public/flamme.png" alt="" />
            </div>
            <h2 className="text-gray-50 text-9xl BN  flex items-center">
              GAMES
            </h2>
          </div>

          <div className="flex gap-15">
            {games.results
              .sort((a, b) => b.rating - a.rating) // trie du + grand au + petit
              .slice(0, 5) // prend les 5 premiers
              .map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
          </div>
        </div>
        <div className="flex justify-end gap-4 mb-8 ">
        <Link to="/games">
  <button 
    className="boutoncontour text-gray-50 pt-1 pb-1 ps-8 pe-8" 
    aria-label="Voir plus de jeux de votre bibliothèque"
    type="button"
  >
    SEE MORE
  </button>
</Link>


          <Link to="/games">
            <button className="boutoncontour text-gray-50 pt-1 pb-1 ps-5 pe-5"  aria-label="Voir plus de jeux de votre bibliothèque">
              &gt;
            </button>
          </Link>
        </div>
      </div>
      <img className="gap-0 m-0" src="public/gta.png" alt="" />
      <div className="flex flex-col gap-10 px-4 py-8 ms-5 me-5 mt-5 ">
        <div className="flex   ">
          <div className="w-115 ">
            <div className="flex items-center  gap-4">
              <h2 className="text-purple-500 text-9xl BN ">AJOUT</h2>
            </div>
            <h2 className="text-gray-50 text-9xl BN  flex items-center">
              RECENT
            </h2>
          </div>

          <div className="flex gap-15">
            {games.results
              .sort((a, b) => new Date(b.released) - new Date(a.released))
              .slice(0, 5) // prend les 5 derniers ajouts
              .map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
          </div>
        </div>
        <div className="flex justify-end gap-4 mb-8 ">
         <Link to="/games">
  <button 
    className="boutoncontour text-gray-50 pt-1 pb-1 ps-8 pe-8" 
    aria-label="Voir plus de jeux de votre bibliothèque"
    type="button"
  >
    SEE MORE
  </button>
</Link>

          <Link to="/games">
            <button className="boutoncontour text-gray-50 pt-1 pb-1 ps-5 pe-5"  aria-label="Voir plus de jeux de votre bibliothèque">
              &gt;
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
