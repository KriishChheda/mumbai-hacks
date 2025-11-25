import express from "express";
import { auth } from "../middleware/auth.js";

import {
  createGroup,
  joinGroup,
  getMyGroups,
} from "../controllers/group.controller.js";

const router = express.Router();

// POST /groups → create a new group
router.post("/", auth, createGroup);

// POST /groups/join → join using group code
router.post("/join", auth, joinGroup);

// GET /groups/my → groups user is in
router.get("/my", auth, getMyGroups);

export default router;
