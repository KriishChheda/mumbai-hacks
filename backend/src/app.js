import express from "express";
import cors from "cors";

import userRoutes from "./routes/user.routes.js";
import groupRoutes from "./routes/group.routes.js";
import goalRoutes from "./routes/goal.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/user", userRoutes);
app.use("/groups", groupRoutes);
app.use("/goals", goalRoutes);
app.use("/transactions", transactionRoutes);

app.get("/", (req, res) => res.send("API Running"));

export default app;
export { prisma } from "../prisma/client.js";
