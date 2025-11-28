import { getTransactionInfo } from "transaction-sms-parser";

// Shared Keywords Dictionary
export const CATEGORY_KEYWORDS = {
  "Food & Dining": [
    "zomato",
    "swiggy",
    "starbucks",
    "dominos",
    "kfc",
    "burger king",
    "pizza",
    "restaurant",
    "cafe",
    "coffee",
    "bhojanalaya",
    "dining",
    "eats",
  ],
  "Travel & Commute": [
    "uber",
    "ola",
    "rapido",
    "metro",
    "irctc",
    "rail",
    "flight",
    "indigo",
    "air india",
    "fuel",
    "petrol",
    "pump",
    "shell",
    "cng",
    "toll",
  ],
  Shopping: [
    "amazon",
    "flipkart",
    "myntra",
    "ajio",
    "zara",
    "h&m",
    "retail",
    "store",
    "mall",
    "decathlon",
    "uniqlo",
    "cloth",
  ],
  Groceries: [
    "blinkit",
    "zepto",
    "bigbasket",
    "dmart",
    "reliance fresh",
    "kirana",
    "vegetable",
    "dairy",
    "milk",
    "grocery",
  ],
  Subscriptions: [
    "spotify",
    "netflix",
    "prime",
    "youtube",
    "hotstar",
    "apple",
    "subscription",
    "plan",
    "premium",
    "chatgpt",
  ],
  "Health & Fitness": [
    "gym",
    "fitness",
    "cult",
    "gold",
    "protein",
    "pharmacy",
    "apollo",
    "medplus",
    "doctor",
    "clinic",
    "hospital",
    "lab",
    "1mg",
    "pharmeasy",
    "workout",
    "supplement",
  ],
  "Bills & Utilities": [
    "bescom",
    "electricity",
    "water",
    "gas",
    "jio",
    "airtel",
    "vi",
    "broadband",
    "wifi",
    "bill",
    "recharge",
    "tatasky",
  ],
  Investment: [
    "zerodha",
    "groww",
    "upstox",
    "sip",
    "mutual fund",
    "stocks",
    "gold",
    "coin",
  ],
};

export const detectCategory = (text, merchant) => {
  const cleanText = (text + " " + merchant).toLowerCase();

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((k) => cleanText.includes(k))) {
      return category;
    }
  }

  return "Uncategorized";
};

const customRegexParser = (text) => {
  const cleanText = text.toLowerCase();
  let amount = null;
  let merchant = null;
  let type = "EXPENSE";

  // Match Amount (e.g., Rs. 500, INR 500)
  const amountMatch = text.match(/(?:Rs\.?|INR)\s*([\d,]+(?:\.\d{1,2})?)/i);
  if (amountMatch) {
    amount = amountMatch[1].replace(/,/g, "");
  }

  // Match Merchant using common patterns
  const vpaMatch = text.match(/credited to vpa\s+([^\s]+)/i);
  const paidToMatch = text.match(
    /(?:paid to|spent on|transfer to|sent to)\s+([^\s]+)/i
  );
  const atMatch = text.match(/at\s+([a-zA-Z0-9\s]+?)\s+(?:on|using)/i);

  if (vpaMatch) merchant = vpaMatch[1];
  else if (paidToMatch) merchant = paidToMatch[1];
  else if (atMatch) merchant = atMatch[1];

  if (!merchant) merchant = "Unknown Merchant";

  // Determine Type
  if (
    cleanText.includes("credited") &&
    !cleanText.includes("credited to vpa")
  ) {
    type = "INCOME";
  } else if (
    cleanText.includes("debited") ||
    cleanText.includes("sent") ||
    cleanText.includes("paid")
  ) {
    type = "EXPENSE";
  }

  if (amount) {
    return {
      amount: amount,
      type: type === "EXPENSE" ? "debit" : "credit",
      merchant: merchant,
    };
  }
  return null;
};

export const parseSms = (smsText) => {
  try {
    let result = null;

    try {
      result = getTransactionInfo(smsText);
    } catch (e) {}

    if (!result || !result.amount) {
      result = customRegexParser(smsText);
    }

    if (!result || !result.amount) return null;

    let type = "EXPENSE";
    if (result.type && result.type.toLowerCase().includes("credit")) {
      type = "INCOME";
    }

    const merchantName = result.merchant || "Unknown SMS";
    const detectedCategory = detectCategory(smsText, merchantName);

    return {
      amount: parseFloat(result.amount),
      type: type,
      merchant: merchantName,
      category: detectedCategory,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error("SMS Parse Error:", error);
    return null;
  }
};
