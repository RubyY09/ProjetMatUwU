import { Link } from "react-router-dom";
import "../../App.css";

export default function GameCard({ game }) {
  return (
    <Link to={`/game/${game.id}`}>
      <div className="bg-white rounded-2xl overflow-hidden hover:scale-105 transition-transform flex-shrink-0">
        <div className="pb-2 lg:pb-4 px-2 lg:px-3 pt-2 lg:pt-3">
          <h2 className="text-sm md:text-base lg:text-lg text-start text-[#7C7C7C] w-auto line-clamp-2 min-h-[2.5rem] md:min-h-[3rem]">
            {game.name}
          </h2>
          <p className="text-xs md:text-sm text-gray-500"></p>
        </div>
        <img
          src={game.background_image}
          alt={game.name}
          className="h-32 md:h-60 lg:h-80 xl:h-90 object-cover rounded-xl w-48 md:w-60 lg:w-70 xl:w-75 mx-auto"
        />
      </div>
    </Link>
  );
}