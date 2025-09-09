import mongoose from "mongoose";

const gameSchema = new mongoose.Schema(
  {
    rawgId: { type: Number, required: true },
    name: String,
    description: String,
    image: String,
    released: String,
  },
  { timestamps: true }
);

export default mongoose.model("Game", gameSchema);
