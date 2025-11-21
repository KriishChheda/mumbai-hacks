import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

import userRoutes from "./routes/user.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";
import moodRoutes from "./routes/mood.routes.js";
import leaderboardRoutes from "./routes/leaderboard.routes.js";

const app = express();
app.use(express.json());
app.use(cors());

export const prisma = new PrismaClient();

app.use("/user", userRoutes);
app.use("/transaction", transactionRoutes);
app.use("/mood", moodRoutes);
app.use("/leaderboard", leaderboardRoutes);

app.get("/", (req, res) => res.send("FinBuddy Backend Running"));

app.listen(3000, () => console.log("🔥 Backend live on port 3000"));
