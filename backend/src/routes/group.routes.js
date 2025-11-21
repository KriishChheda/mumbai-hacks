import express from "express";
import { auth } from "../middleware/auth.js";
import {
  createGroup,
  joinGroup,
  getMyGroups,
} from "../controllers/group.controller.js";

const router = express.Router();

router.post("/", auth, createGroup);

router.post("/join", auth, joinGroup);

router.get("/mine", auth, getMyGroups);

export default router;
