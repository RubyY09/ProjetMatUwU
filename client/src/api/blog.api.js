const BASE_URL = import.meta.env.VITE_SERVER_URL;

// Récupérer tous les blogs

// Créer un blog
export async function createBlog(data) {
  const response = await fetch(`${BASE_URL}blog`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!response.ok) throw new Error("Erreur lors de la création du blog");
  //   if (!response.ok) {
  //     console.log(error);
  //   }
  return response.json();
}
export async function fetchGames() {
  const res = await fetch("http://localhost:5000/games");
  return await res.json();
}

export async function fetchGameById(id) {
  const res = await fetch(`http://localhost:5000/games/${id}`);
  return await res.json();
}