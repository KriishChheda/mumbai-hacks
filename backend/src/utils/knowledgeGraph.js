export const merchantToSuggestions = {
  STARBUCKS: {
    category: "coffee",
    cheaperAlt: "Local café near you",
    tip: "Frequent coffee buys detected — consider weekly budget cap.",
  },
  SWIGGY: {
    category: "food delivery",
    cheaperAlt: "Cook at home twice a week",
    tip: "Food delivery spikes often link to stress spending.",
  },
};

// --- NEW: Mock Knowledge Graph Query ---
export const queryKG = async ({ category, userIncome, mood }) => {
  console.log(
    `🔍 Querying KG for: ${category}, Income: ${userIncome}, Mood: ${mood.state}`
  );

  const suggestions = {
    alternatives: [],
    govtScheme: null,
  };

  // 1. Category-based alternatives
  const catLower = category?.toLowerCase() || "";

  if (
    catLower.includes("food") ||
    catLower.includes("swiggy") ||
    catLower.includes("zomato")
  ) {
    suggestions.alternatives = [
      "Home cooked meals (save ~₹200/meal)",
      "Local Tiffin Service",
    ];
  } else if (catLower.includes("coffee") || catLower.includes("starbucks")) {
    suggestions.alternatives = ["Office coffee machine", "Homemade brew"];
  } else if (catLower.includes("travel") || catLower.includes("uber")) {
    suggestions.alternatives = ["Metro Pass", "Carpooling"];
  } else {
    suggestions.alternatives = [
      "Generic cheaper brand",
      "Second-hand marketplace",
    ];
  }

  // 2. Income-based government schemes (Mock thresholds)
  // Assuming monthly income input, annual < 5L is often a threshold
  if (userIncome > 0 && userIncome < 40000) {
    suggestions.govtScheme = "Atal Pension Yojana (for retirement savings)";
  }

  return suggestions;
};
