import { getTransactionInfo } from "transaction-sms-parser";

const customRegexParser = (text) => {
  const cleanText = text.toLowerCase();
  let amount = null;
  let merchant = "Unknown Merchant";
  let type = "EXPENSE";

  const amountMatch = text.match(/(?:Rs\.?|INR)\s*([\d,]+(?:\.\d{1,2})?)/i);
  if (amountMatch) {
    amount = amountMatch[1].replace(/,/g, "");
  }

  const vpaMatch = text.match(/credited to vpa\s+([^\s]+)/i);
  const paidToMatch = text.match(
    /(?:paid to|spent on|transfer to)\s+([^\s]+)/i
  );
  const atMatch = text.match(/at\s+([a-zA-Z0-9\s]+)\son/i); // e.g. "at STARBUCKS on"

  if (vpaMatch) merchant = vpaMatch[1];
  else if (paidToMatch) merchant = paidToMatch[1];
  else if (atMatch) merchant = atMatch[1];

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
      type: type === "EXPENSE" ? "debit" : "credit", // Match library format
      merchant: merchant,
    };
  }
  return null;
};

export const parseSms = (smsText) => {
  try {
    let result = null;

    try {
      result = parser.getTransactionInfo(smsText);
    } catch (e) {}

    if (!result || !result.amount) {
      console.log("⚠️ Library failed, using Custom Regex Parser...");
      result = customRegexParser(smsText);
    }

    if (!result || !result.amount) return null;

    let type = "EXPENSE";
    if (result.type && result.type.toLowerCase().includes("credit")) {
      type = "INCOME";
    }

    return {
      amount: parseFloat(result.amount),
      type: type,
      merchant: result.merchant || "Unknown SMS",
      category: "Uncategorized",
      timestamp: new Date(),
    };
  } catch (error) {
    console.error("SMS Parse Error:", error);
    return null;
  }
};
