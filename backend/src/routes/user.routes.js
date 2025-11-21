import express from "express";
import { createUser, getUser } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/create", createUser);
router.get("/:id", getUser);

export default router;
