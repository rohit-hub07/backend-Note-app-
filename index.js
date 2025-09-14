import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { dbConnection } from "./utils/db.js";
import userRouter from "./routes/user.routes.js";
import noteRouter from "./routes/notes.routes.js";
import upgradeRouter from "./routes/upgradePlan.route.js";
import cors from "cors";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = {
  origin: ["http://localhost:8000", "http://localhost:5173", "https://note-app-frontend-sandy.vercel.app"],
  credentials: true,
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 8000;

app.get("/health", (req, res) => {
  res.status(200).json({
    message: "health route is working!",
    success: true,
  });
});

app.get("/", (req, res) => {
  res.send("Backend home")
});

app.use("/user", userRouter);
app.use("/notes", noteRouter);
app.use("/tenants", upgradeRouter);

dbConnection();

app.listen(PORT, () => {
  console.log(`App is listening on port : ${PORT}`);
});
