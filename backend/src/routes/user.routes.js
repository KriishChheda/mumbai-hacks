import express from "express";
import { auth } from "../middleware/auth.js";
import { getMe } from "../controllers/user.controller.js";

const router = express.Router();

// GET /me → returns logged-in user
router.get("/me", auth, getMe);

export default router;
