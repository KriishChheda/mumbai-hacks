import express from "express";
import { auth } from "../middleware/auth.js";

import {
  createGroupGoal,
  contributeToGroupGoal,
  groupGoalLeaderboard,
  createPersonalGoal,
  getMyGoals,
  updateGoalProgress,
} from "../controllers/goal.controller.js";

const router = express.Router();

router.post("/", auth, createPersonalGoal);
router.get("/", auth, getMyGoals);
router.patch("/:goalId/progress", auth, updateGoalProgress);

router.post("/group", auth, createGroupGoal);

router.post("/contribute", auth, contributeToGroupGoal);

router.get("/:goalId/leaderboard", auth, groupGoalLeaderboard);

export default router;
