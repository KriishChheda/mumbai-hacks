import express from "express";
import { auth } from "../middleware/auth.js";

import {
  addTransaction,
  getMyTransactions,
} from "../controllers/transaction.controller.js";

const router = express.Router();

// POST /transactions → add a new one
router.post("/", auth, addTransaction);

// GET /transactions/my → all my transactions
router.get("/my", auth, getMyTransactions);

export default router;
