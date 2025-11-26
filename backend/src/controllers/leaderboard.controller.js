import { prisma } from "../../prisma/client.js";

export const getLeaderboard = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { points: "desc" },
      take: 20, // Top 20 users only
      select: { id: true, name: true, points: true, moodState: true },
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
};
