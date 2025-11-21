import express from "express";
import { auth } from "../middleware/auth.js";
import {
  addTransaction,
  getMyTransactions,
} from "../controllers/transaction.controller.js";

const router = express.Router();

router.post("/", auth, addTransaction);
router.get("/", auth, getMyTransactions);

export default router;
