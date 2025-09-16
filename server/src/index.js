import express from "express";

import dotenv from "dotenv";

import cookieParser from "cookie-parser";
import cors from "cors";

import routes from "./routes/index.js";

import { connectDB } from "./lib/db.js";

dotenv.config();

const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [process.env.DEPLOY_FRONT_URL, process.env.CLIENT_URL],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);

app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Le serveur est démarré sur le port ${PORT}`);
  connectDB();
});
app.use("/api", routes);
