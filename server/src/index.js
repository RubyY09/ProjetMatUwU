import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import routes from "./routes/index.js";
import { connectDB } from "./lib/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();




app.use(
  cors({
    origin: [process.env.DEPLOY_FRONT_URL, process.env.CLIENT_URL].filter(Boolean),
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"], // Ajout Authorization
    credentials: true,
  })
);

// 2. Parser JSON
app.use(express.json());

// 3. Parser cookies
app.use(cookieParser());

// 4. Middleware de logs pour debug
app.use((req, res, next) => {
  console.log(` ${req.method} ${req.path}`);
  console.log(" Body:", req.body);
  console.log(" Cookies:", req.cookies);
  next();
});

// 5. Routes principales
app.use("/", routes);



// Connexion à la DB et démarrage du serveur
app.listen(PORT, () => {
  console.log(` Serveur démarré sur le port ${PORT}`);
  console.log(` Frontend autorisé: ${process.env.CLIENT_URL,process.env.DEPLOY_FRONT_URL}`);
  connectDB();
});