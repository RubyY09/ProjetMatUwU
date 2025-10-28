const BASE_URL = import.meta.env.VITE_SERVER_URL;

export async function signUp(values) {
  try {
    const response = await fetch(`${BASE_URL}user`, {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-type": "application/json",
      },
    });
    const newUserMessage = await response.json();
    return newUserMessage;
  } catch (error) {
    console.error("Erreur signUp:", error);
    return { message: "Erreur réseau" };
  }
}

export async function signIn(values) {
  try {
    console.log(" URL de connexion:", `${BASE_URL}user/login`);
    console.log(" Données envoyées:", values);

    const response = await fetch(`${BASE_URL}user/login`, {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-type": "application/json",
      },
      credentials: "include",
    });

    console.log(" Status de la réponse:", response.status);

    // Gestion des erreurs HTTP
    if (!response.ok) {
      const error = await response.json();
      console.error(" Erreur serveur:", error);
      return { 
        user: null, 
        message: error.message || "Erreur de connexion" 
      };
    }

    const userConnected = await response.json();
    console.log(" Utilisateur connecté:", userConnected);
    return userConnected;
  } catch (error) {
    console.error(" Erreur réseau:", error);
    return { 
      user: null, 
      message: "Impossible de contacter le serveur" 
    };
  }
}

export async function getCurrentUser() {
  try {
    const response = await fetch(`${BASE_URL}user/current`, {
      method: "GET",
      credentials: "include",
    });
    if (response.ok) {
      return await response.json();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Erreur getCurrentUser:", error);
    return null;
  }
}

export async function signout() {
  try {
    await fetch(`${BASE_URL}user/deleteToken`, {
      method: "DELETE",
      credentials: "include",
    });
  } catch (error) {
    console.error("Erreur signout:", error);
  }
}