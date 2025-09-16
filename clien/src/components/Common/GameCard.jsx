import { Link } from "react-router-dom";
import "../../App.css";

export default function GameCard({ game }) {
  return (
    <Link to={`/game/${game.id}`}>
      <div className="bg-white rounded-2xl  overflow-hidden hover:scale-105 transition-transform ">
        <div className="pb-4">
          <h2 className="text-lg text-start text-[#7C7C7C] w-auto">
            {game.name}
          </h2>
          <p className="text-sm text-gray-500"></p>
        </div>
        <img
          src={game.background_image}
          alt={game.name}
          className="h-90 object-cover rounded-xl w-75"
        />
      </div>
    </Link>
  );
}
