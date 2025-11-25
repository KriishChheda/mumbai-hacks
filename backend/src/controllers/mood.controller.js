import { prisma } from "../../prisma/client.js";

export const getMood = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(req.params.userId) },
  });
  res.json({ mood: user.moodState });
};
