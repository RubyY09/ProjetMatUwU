import express from "express";
import { protect } from "../middlewares/authMidlleware.js";
import { getGames, getGameById } from "../controllers/blog.controller.js";

const router = express.Router();

router.get("/games", getGames);
router.get("/games/:id", getGameById);

export default router;
