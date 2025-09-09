const RAWG_API_KEY = process.env.RAWG_API_KEY;

export const getGames = async (req, res) => {
  try {
    const response = await fetch(
      `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&page_size=12`
    );
    const data = await response.json();
    res.json(data.results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getGameById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await fetch(
      `https://api.rawg.io/api/games/${id}?key=${RAWG_API_KEY}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
