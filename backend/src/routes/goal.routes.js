import express from "express";
import { auth } from "../middleware/auth.js";

import {
  createGroupGoal,
  contributeToGroupGoal,
  groupGoalLeaderboard,
} from "../controllers/goal.controller.js";

const router = express.Router();

// POST /goals/group → create a new group goal
router.post("/group", auth, createGroupGoal);

// POST /goals/contribute → contribute to group goal
router.post("/contribute", auth, contributeToGroupGoal);

// GET /goals/:goalId/leaderboard → leaderboard for goal
router.get("/:goalId/leaderboard", auth, groupGoalLeaderboard);

export default router;
