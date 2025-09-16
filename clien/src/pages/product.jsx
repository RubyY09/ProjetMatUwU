import GameCard from "../components/Common/GameCard";
import { useBlog } from "./context/BlogContext";
import "./App.css";

export default function Test() {
  const { games, loading } = useBlog();

  console.log(games.results);

  if (loading) return <p className="text-center text-xl">Chargement...</p>;

  return (














    
  )