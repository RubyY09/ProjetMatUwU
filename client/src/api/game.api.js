export async function getGamesFromApi() {
  try {
    const response = await fetch(
      "https://api.rawg.io/api/games?key=49e293944c8e42c69921316ec1e98b46"
    );
    return await response.json();
  } catch (error) {
    console.log(error);
  }
}
