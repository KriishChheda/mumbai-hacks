import { prisma } from "../app.js";

export const getLeaderboard = async (req, res) => {
  const users = await prisma.user.findMany({
    orderBy: { points: "desc" },
    select: { id: true, name: true, points: true }
  });

  res.json(users);
};
