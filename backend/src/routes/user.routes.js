import express from "express";
import { auth } from "../middleware/auth.js";
import {
  getMe,
  getSavingsStats,
  updateProfile,
} from "../controllers/user.controller.js";

const router = express.Router();

// GET /me → returns logged-in user
router.get("/me", auth, getMe);
router.patch("/profile", auth, updateProfile);
router.get("/savings", auth, getSavingsStats);

export default router;
