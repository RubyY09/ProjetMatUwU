import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    gameId: { type: String, required: true }, // comme tu prends l’ID de RAWG
    message: { type: String, required: true },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
