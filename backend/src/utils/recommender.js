import { getUserMood } from "./moodEngine.js";
import { queryKG } from "./knowledgeGraph.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const recommendNextAction = async (user, transactions) => {
  const mood = await getUserMood(user.id);

  const monthlySpent = sumByCategory(transactions);
  // Handle edge case where no transactions exist
  const topCategory =
    Object.keys(monthlySpent.map).length > 0
      ? Object.keys(monthlySpent.map).sort(
          (a, b) => monthlySpent.map[b] - monthlySpent.map[a]
        )[0]
      : "General";

  // KG Query for contextual suggestions
  const graphSuggestions = await queryKG({
    category: topCategory,
    userIncome: user.income,
    mood,
  });

  // 1. Identify the "Core Issue" using Logic (The Decision Maker)
  let coreIssue = {
    type: "general_insight",
    context: "User is tracking expenses. Encourage them.",
    priority: 10,
  };

  if (mood.state === "stressed") {
    coreIssue = {
      type: "crisis_management",
      context:
        "User is stressed and over budget (95% used). Needs immediate relief or a spending freeze on non-essentials.",
      priority: 90,
    };
  } else if (mood.state === "saver") {
    coreIssue = {
      type: "investment_opportunity",
      context: `User is saving well. Suggest investing their surplus savings (${
        user.income * 0.2
      }) into a low-risk fund.`,
      priority: 80,
    };
  } else if (graphSuggestions?.alternatives && topCategory !== "General") {
    coreIssue = {
      type: "merchant_switch",
      context: `User spends too much on ${topCategory}. Suggest switching to ${graphSuggestions.alternatives[0]} to save money.`,
      priority: 50,
    };
  }

  // 2. Use Gemini to Generate the "Good Answer"
  if (process.env.GEMINI_API_KEY) {
    const aiMessage = await generateAdviceWithLLM(coreIssue, mood.state);

    return {
      type: coreIssue.type,
      message: aiMessage,
      score: coreIssue.priority,
      action: mapActionToType(coreIssue.type),
    };
  }

  // Fallback if no API Key
  return {
    type: coreIssue.type,
    message: `(Fallback) ${coreIssue.context}`,
    score: coreIssue.priority,
  };
};

function sumByCategory(transactions = []) {
  const map = {};
  let total = 0;

  transactions.forEach((t) => {
    const cat = t.category || "Uncategorized";
    map[cat] = (map[cat] || 0) + t.amount;
    total += t.amount;
  });

  return { map, total };
}

function mapActionToType(type) {
  const actions = {
    crisis_management: "ENABLE_FREEZE",
    investment_opportunity: "VIEW_FUNDS",
    merchant_switch: "COMPARE_PRICES",
  };
  return actions[type] || "VIEW_DETAILS";
}

// --- Agentic AI Generation ---
async function generateAdviceWithLLM(issue, mood) {
  try {
    const prompt = `
      Act as a friendly, empathetic financial coach.
      
      Context:
      - User Mood: ${mood}
      - Detected Issue: ${issue.context}
      - Recommendation Type: ${issue.type}

      Task:
      Write a short, engaging, and actionable message (max 2 sentences) for the user.
      If they are stressed, be calming. If they are doing well, be celebratory.
      Do not use technical jargon.
    `;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("Gemini Error:", error);
    return issue.context; // Fallback to raw logic
  }
}
