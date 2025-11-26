import { prisma } from "../../prisma/client.js";
import { recommendNextAction } from "../utils/recommender.js";

export const getRecommendation = async (req, res) => {
  try {
    console.log("🤖 AI: Received request for user:", req.user.id);
    const userId = req.user.id;

    // 1. Fetch User
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        goals: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!user) throw new Error("User not found in DB");
    console.log("✅ AI: User fetched:", user.name);

    // 2. Fetch Transactions
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        timestamp: { gte: thirtyDaysAgo },
      },
    });
    console.log(`✅ AI: Fetched ${transactions.length} transactions`);

    // 3. Prepare Data
    const userDataForAI = {
      ...user,
      goal: user.goals[0] || null,
      // Ensure these fields exist to prevent recommender crashes
      income: user.income || 0,
      budgetLimit: user.budgetLimit || 0,
    };

    // 4. Run Engine
    console.log("🔄 AI: Running recommendation engine...");
    const recommendation = await recommendNextAction(
      userDataForAI,
      transactions
    );
    console.log("✨ AI: Recommendation generated:", recommendation?.type);

    res.json(
      recommendation || {
        type: "general",
        message:
          "You're doing great! Keep tracking your expenses to unlock more insights.",
        score: 5,
      }
    );
  } catch (error) {
    console.error("❌ AI CONTROLLER CRASH:", error); // <--- Look for this line in terminal
    res
      .status(500)
      .json({ error: "AI generation failed", details: error.message });
  }
};
