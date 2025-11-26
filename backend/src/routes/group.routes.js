import express from "express";
import { auth } from "../middleware/auth.js";
import {
  createGroup,
  joinGroup,
  getMyGroups,
  removeMember,
  leaveGroup,
} from "../controllers/group.controller.js";

const router = express.Router();

router.post("/", auth, createGroup);
router.post("/join", auth, joinGroup);
router.get("/my", auth, getMyGroups);
router.post("/remove", auth, removeMember);
router.post("/leave", auth, leaveGroup);

export default router;
