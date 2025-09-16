import express from "express";

import userRoutes from "./user.route.js";
import blogRoutes from "./blog.route.js";
import commentRoutes from "./comment.route.js"; // ✅

const router = express.Router();

router.use("/blog", blogRoutes);
router.use("/user", userRoutes);
router.use("/comments", commentRoutes); // ✅

export default router;
