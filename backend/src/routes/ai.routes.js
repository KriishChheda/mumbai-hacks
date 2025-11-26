import express from "express";
import { auth } from "../middleware/auth.js";
import { getRecommendation } from "../controllers/ai.controller.js";

const router = express.Router();

router.get("/recommend", auth, getRecommendation);

export default router;
