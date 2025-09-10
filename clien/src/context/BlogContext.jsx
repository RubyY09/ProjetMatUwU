import { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { useAuth } from "./AuthContext";
import { createBlog } from "../api/blog.api";
import { getGamesFromApi } from "../api/game.api";

const BlogContext = createContext();

export function BlogProvider({ children }) {
  const [blogs, setBlogs] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userConnected } = useAuth();
  console.log(games);

  useEffect(() => {
    async function getGames() {
      try {
        const allGames = await getGamesFromApi();
        setGames(allGames);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    getGames();
  }, []);

  const addBlog = async (values) => {
    try {
      const newBlog = await createBlog(values);
      setBlogs((prev) => [newBlog, ...prev]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <BlogContext.Provider value={{ blogs, addBlog, games, loading }}>
      {children}
    </BlogContext.Provider>
  );
}

export function useBlog() {
  return useContext(BlogContext);
}
