import express from "express";
import { auth } from "../middleware/auth.js";

import {
  addTransaction,
  getMyTransactions,
  updateTransaction,
  deleteTransaction,
  addSmsTransaction,
  addBulkSms,
} from "../controllers/transaction.controller.js";

const router = express.Router();

// Standard CRUD
router.get("/my", auth, getMyTransactions);
router.post("/", auth, addTransaction);
router.patch("/:id", auth, updateTransaction);
router.delete("/:id", auth, deleteTransaction);

// SMS Routes
router.post("/sms", auth, addSmsTransaction);
router.post("/sms/bulk", auth, addBulkSms);

export default router;
