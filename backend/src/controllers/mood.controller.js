import { prisma } from "../../prisma/client.js";

export const getMood = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { moodState: true, moodScore: true },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ mood: user.moodState, score: user.moodScore });
  } catch (error) {
    console.error("Mood Error:", error);
    res.status(500).json({ error: "Failed to fetch mood" });
  }
};
