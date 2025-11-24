import { prisma } from "../../prisma/client.js";

export const getMe = async (req, res) => {
  res.json(req.user);
};
