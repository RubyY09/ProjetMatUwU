import express from "express";
import Comment from "../models/comment.model.js"; // modèle mongoose

const router = express.Router();

// Récupérer tous les commentaires d’un jeu
router.get("/:gameId", async (req, res) => {
  try {
    const comments = await Comment.find({ gameId: req.params.gameId }).sort({
      createdAt: -1,
    });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Ajouter un commentaire
router.post("/", async (req, res) => {
  try {
    const { username, gameId, message } = req.body;
    if (!username || !gameId || !message) {
      return res
        .status(400)
        .json({ message: "Tous les champs sont obligatoires" });
    }

    const newComment = new Comment({ username, gameId, message });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
