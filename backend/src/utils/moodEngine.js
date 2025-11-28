import { prisma } from "../../prisma/client.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Categories considered "Discretionary" or "Impulse"
const IMPULSE_CATEGORIES = [
  "shopping",
  "entertainment",
  "food delivery",
  "electronics",
  "impulse",
];

export const updateMoodState = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { transactions: true },
    });

    if (!user) return;

    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    // Filter recent transactions
    const recentTx = user.transactions.filter(
      (t) => new Date(t.timestamp) >= thirtyDaysAgo
    );

    // --- Metrics Calculation ---
    const totalIncome = user.income || 0;
    const monthlyLimit = user.budgetLimit || 0;

    let totalSpent = 0;
    let impulseCount = 0;
    let impulseAmount = 0;

    recentTx.forEach((t) => {
      if (t.type === "EXPENSE") {
        totalSpent += t.amount;
        // Basic check for impulse categories
        if (IMPULSE_CATEGORIES.includes(t.category?.toLowerCase())) {
          impulseCount++;
          impulseAmount += t.amount;
        }
      }
    });

    const savings = totalIncome - totalSpent;
    const savingsRate = totalIncome > 0 ? savings / totalIncome : 0;
    const budgetUtilization = monthlyLimit > 0 ? totalSpent / monthlyLimit : 0;

    // --- Rules Engine ---
    let mood = "neutral";
    let score = 50; // Base score

    // 1. Check for Stress (Over Budget)
    if (
      budgetUtilization > 0.95 ||
      (totalIncome > 0 && totalSpent > totalIncome)
    ) {
      mood = "stressed";
      score -= 20;
    }
    // 2. Check for Impulse Issues
    else if (
      impulseCount > 5 ||
      (totalIncome > 0 && impulseAmount > 0.3 * totalIncome)
    ) {
      mood = "impulsive";
      score -= 10;
    }
    // 3. Check for Saver (Healthy Savings)
    else if (savingsRate > 0.2) {
      mood = "saver";
      score += 20;
    }
    // 4. Check for Disciplined (Under Budget)
    else if (budgetUtilization < 0.85 && budgetUtilization > 0) {
      mood = "disciplined";
      score += 10;
    }
    // 5. Fallback
    else {
      mood = "casual";
    }

    // Clamp score
    score = Math.max(0, Math.min(100, score));

    // Update Database with Rules-Based State
    await prisma.user.update({
      where: { id: userId },
      data: {
        moodState: mood,
        moodScore: score,
      },
    });

    // --- Agentic AI Layer ---
    // We generate a contextual insight using Gemini
    // Note: Since we don't have an 'insight' column yet, we log it.
    // Ideally, you would update a 'lastInsight' field in the User model here.
    if (process.env.GEMINI_API_KEY) {
      const aiInsight = await enrichMoodWithLLM(mood, recentTx);
      console.log(`🤖 Gemini Insight for ${user.name}: "${aiInsight}"`);
    }

    console.log(`🧠 Mood Updated: ${mood} (Score: ${score})`);
  } catch (error) {
    console.error("Mood Engine Error:", error);
  }
};

export const getUserMood = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { moodState: true, moodScore: true },
  });

  return {
    state: user?.moodState || "neutral",
    score: user?.moodScore || 50,
  };
};

// --- Agentic AI Function ---
async function enrichMoodWithLLM(currentMood, transactions) {
  try {
    // Take only the last 5 transactions to keep prompt small & fast
    const recentActivity = transactions
      .slice(-5)
      .map((t) => `${t.merchant}: ${t.amount}`)
      .join(", ");

    const prompt = `
      You are a financial coach agent. The user is currently in a "${currentMood}" financial state.
      Their recent activity: [${recentActivity}].
      Generate a witty, one-sentence observation about their spending habits. 
      Don't give generic advice, be specific to the mood.
      Output ONLY the sentence.
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Keep tracking your spending to stay on top!";
  }
}
