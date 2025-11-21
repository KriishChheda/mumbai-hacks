import { getUserMood } from "./moodEngine.js";
import { queryKG } from "./knowledgeGraph.js";

export const recommendNextAction = async (user, transactions) => {
  // ---- STEP 1: Compute mood ----
  const mood = await getUserMood(user.id);

  // ---- STEP 2: Compute spending summary ----
  const monthlySpent = sumByCategory(transactions);
  const topCategory = Object.keys(monthlySpent)
    .sort((a, b) => monthlySpent[b] - monthlySpent[a])[0];

  // ---- STEP 3: Query Knowledge Graph for insights ----
  const graphSuggestions = await queryKG({
    category: topCategory,
    userIncome: user.income,
    mood,
  });

  // ---- STEP 4: Build Recommendations ----
  const recommendations = [];

  // 4A — Mood based tone
  if (mood.state === "stressed") {
    recommendations.push({
      type: "budget_adjust",
      message:
        "Looks like money’s been tight recently. Want me to rebalance your budget so rent & essentials stay safe?",
      score: 10,
    });
  }

  if (mood.state === "impulsive") {
    recommendations.push({
      type: "spending_control",
      message:
        "I noticed spikes in food delivery spends. Want to set a soft limit or get cheaper alternatives?",
      score: 12,
    });
  }

  // 4B — KG-based "smart reasoning"
  if (graphSuggestions?.alternatives) {
    recommendations.push({
      type: "merchant_switch",
      message: `You've been spending a lot on ${topCategory}. Here's a cheaper option: ${graphSuggestions.alternatives[0]}. Want a comparison?`,
      score: 15,
    });
  }

  if (graphSuggestions?.govtScheme) {
    recommendations.push({
      type: "govt_benefit",
      message: `You're eligible for ${graphSuggestions.govtScheme}. Want me to check the requirements & help you apply?`,
      score: 20,
    });
  }

  // 4C — Gamification-based nudges
  if (user.weeklyScore < 50) {
    recommendations.push({
      type: "challenge",
      message:
        "This week's challenge: Spend 10% less on eating out for +30 points. Should I enable it?",
      score: 18,
    });
  }

  // 4D — Savings Goal
  if (user.goal && monthlySpent.total > user.budgetLimit) {
    recommendations.push({
      type: "goal_protection",
      message:
        "You're slightly over budget. Want me to freeze optional spending categories for 3 days to protect your savings goal?",
      score: 22,
    });
  }

  // ---- STEP 5: RETURN BEST RECOMMENDATION ----
  return recommendations.sort((a, b) => b.score - a.score)[0];
};

// ------------ UTIL FUNCTIONS ------------
function sumByCategory(transactions = []) {
  const map = {};
  let total = 0;

  transactions.forEach((t) => {
    const cat = t.category || "Other";
    map[cat] = (map[cat] || 0) + t.amount;
    total += t.amount;
  });

  map.total = total;
  return map;
}
