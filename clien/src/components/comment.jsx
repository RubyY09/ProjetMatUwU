import { useState, useEffect } from "react";
import "../App.css";

export default function Comments({ gameId }) {
  const [comments, setComments] = useState([]);
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  const MAX_CHARS = 160;

  // Charger les commentaires
  useEffect(() => {
    fetch(`http://localhost:5000/api/comments/${gameId}`)
      .then((res) => res.json())
      .then((data) => setComments(data))
      .catch((err) => console.error("Erreur fetch comments:", err));
  }, [gameId]);

  // Envoyer un commentaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérifier la longueur du message
    if (message.trim().length === 0 || message.length > MAX_CHARS) {
      return;
    }

    const newComment = { username, gameId, message };

    const res = await fetch("http://localhost:5000/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newComment),
    });

    const data = await res.json();
    setComments([data, ...comments]); // afficher direct
    setMessage("");
  };

  // Gérer le changement du message avec limitation
  const handleMessageChange = (e) => {
    const newMessage = e.target.value;
    if (newMessage.length <= MAX_CHARS) {
      setMessage(newMessage);
    }
  };

  // Calculer les caractères restants
  const remainingChars = MAX_CHARS - message.length;

  return (
    <div className="mt-10 mx-15 text-gray-50 mb-25">
      {/* Liste des commentaires */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4">
          {comments.length === 0 && (
            <p className="text-gray-400 w-full">
              No reviews yet. Be the first!
            </p>
          )}
          {comments.slice(0, 4).map((c) => (
            <div
              key={c._id}
              className="bg-[#2b2929] p-4 rounded-xl shadow-lg text-start flex flex-col justify-between h-50 w-[25rem] min-h-0 overflow-hidden"
            >
              <strong className="text-gray-50 uppercase flex-shrink-0">
                {c.username}
              </strong>
              <p
                className="flex-grow overflow-hidden break-words hyphens-auto leading-relaxed whitespace-normal max-w-full"
                style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}
              >
                {c.message}
              </p>
              <span className="text-gray-500 text-sm flex-shrink-0">
                {new Date(c.createdAt).toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        <h2 className="text-8xl BN mb-6 text-start mt-10">YOUR OPINIONS</h2>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="mb-8 flex flex-col gap-4 w-1/2">
        <input
          type="text"
          placeholder="Your pseudo"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-3 rounded-xl text-gray-100 bg-[#2b2929]"
          required
        />
        <div className="relative">
          <textarea
            placeholder="Ton avis (max 160 caractères)"
            value={message}
            onChange={handleMessageChange}
            className="p-3 rounded-xl text-gray-100 bg-[#2b2929] w-full resize-none"
            rows="4"
            required
          />
          <div
            className={`absolute bottom-2 right-3 text-sm ${
              remainingChars < 20
                ? "text-red-400"
                : remainingChars < 50
                ? "text-yellow-400"
                : "text-gray-400"
            }`}
          >
            {remainingChars}/{MAX_CHARS}
          </div>
        </div>
        <button
          type="submit"
          className={`py-2 rounded-xl boutonr ${
            message.trim().length === 0 || message.length > MAX_CHARS
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          disabled={message.trim().length === 0 || message.length > MAX_CHARS}
        >
          Envoyer
        </button>
      </form>
    </div>
  );
}
