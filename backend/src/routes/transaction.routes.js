import express from "express";
import { addTransaction, getUserTransactions } from "../controllers/transaction.controller.js";

const router = express.Router();

router.post("/add", addTransaction);
router.get("/:userId", getUserTransactions);

export default router;
