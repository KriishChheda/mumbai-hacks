import express from "express";
import { auth } from "../middleware/auth.js";

import {
  createGroupGoal,
  contributeToGroupGoal,
  groupGoalLeaderboard,
} from "../controllers/goal.controller.js";

const router = express.Router();

router.post("/", auth, createGroupGoal);

router.post("/contribute", auth, contributeToGroupGoal);

router.get("/:goalId/leaderboard", auth, groupGoalLeaderboard);

export default router;
