import { prisma } from "../../prisma/client.js";
import { parseSms } from "../utils/smsParser.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini for fallback categorization
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// --- AI HELPER ---
const enrichCategoryWithAI = async (merchant, description, amount) => {
  if (!process.env.GEMINI_API_KEY) return "Uncategorized";

  try {
    const prompt = `
      Categorize this transaction into exactly one of these: [Food & Dining, Travel & Commute, Shopping, Groceries, Subscriptions, Health & Fitness, Bills & Utilities, Investment, Education, Entertainment, Transfer].
      Transaction details: "${merchant}" - ${description} - amount ${amount}.
      Context: "Gym" implies Health, "Netflix" implies Subscriptions.
      If unsure, return "General". Output ONLY the category name.
    `;
    const result = await model.generateContent(prompt);
    const category = result.response.text().trim();
    return category; // Return clean string
  } catch (e) {
    console.error("AI Categorization failed:", e);
    return "Uncategorized";
  }
};

// --- STATS & ANALYTICS (NEW) ---

export const getTransactionStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all user transactions
    const transactions = await prisma.transaction.findMany({
      where: { userId, type: "EXPENSE" },
      orderBy: { timestamp: "desc" },
    });

    // 1. Category Breakdown (Pie Chart)
    const categoryStats = {};
    let totalExpense = 0;

    // 2. Daily Trend (Line Chart)
    const dailyTrend = {};

    // 3. Recurring Bill Detection
    // Map: "Merchant-Amount" -> Count
    const recurringMap = {};

    transactions.forEach((t) => {
      // A. Category Sum
      const cat = t.category || "Uncategorized";
      categoryStats[cat] = (categoryStats[cat] || 0) + t.amount;
      totalExpense += t.amount;

      // B. Daily Trend
      const dateKey = t.timestamp.toISOString().split("T")[0]; // YYYY-MM-DD
      dailyTrend[dateKey] = (dailyTrend[dateKey] || 0) + t.amount;

      // C. Recurring Check (Same Merchant + Same Amount)
      const key = `${t.merchant.toLowerCase().trim()}-${t.amount}`;
      if (!recurringMap[key]) {
        recurringMap[key] = {
          merchant: t.merchant,
          amount: t.amount,
          count: 0,
          category: t.category,
          lastDate: t.timestamp,
        };
      }
      recurringMap[key].count++;
    });

    // Format Data for Frontend
    const categoryData = Object.entries(categoryStats).map(([name, value]) => ({
      name,
      value,
      percentage: ((value / totalExpense) * 100).toFixed(1),
    }));

    const trendData = Object.entries(dailyTrend)
      .sort((a, b) => new Date(a[0]) - new Date(b[0])) // Sort by date
      .map(([date, amount]) => ({ date, amount }));

    // Filter for actual recurring bills (at least 2 occurrences)
    const recurringBills = Object.values(recurringMap)
      .filter((item) => item.count > 1)
      .sort((a, b) => b.amount - a.amount); // Highest bills first

    res.json({
      totalExpense,
      categoryData,
      trendData,
      recurringBills,
    });
  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};

// --- STANDARD CRUD ---

export const addTransaction = async (req, res) => {
  // ... (Keep existing addTransaction code)
  try {
    let { amount, type, merchant, category, timestamp } = req.body;

    if (amount === undefined || amount === null || isNaN(amount)) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    // Agentic Upgrade: If category is missing/generic, ask AI
    if (
      (!category || category === "Others" || category === "Uncategorized") &&
      merchant
    ) {
      // console.log("🤖 Asking AI to categorize:", merchant);
      category = await enrichCategoryWithAI(merchant, "Manual Entry", amount);
    }

    const tx = await prisma.transaction.create({
      data: {
        userId: req.user.id,
        amount: parseFloat(amount),
        type,
        merchant: merchant || "Unknown",
        category: category || "Others",
        timestamp: timestamp ? new Date(timestamp) : new Date(),
      },
    });

    res.json(tx);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add transaction" });
  }
};

export const getMyTransactions = async (req, res) => {
  try {
    const txs = await prisma.transaction.findMany({
      where: { userId: req.user.id },
      orderBy: { timestamp: "desc" },
    });
    res.json(txs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};

export const updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { amount, merchant, category } = req.body;

  try {
    const existing = await prisma.transaction.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!existing)
      return res.status(404).json({ error: "Transaction not found" });

    const updated = await prisma.transaction.update({
      where: { id },
      data: {
        amount: amount ? parseFloat(amount) : undefined,
        merchant,
        category,
      },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update transaction" });
  }
};

export const deleteTransaction = async (req, res) => {
  const { id } = req.params;

  try {
    const existing = await prisma.transaction.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!existing)
      return res.status(404).json({ error: "Transaction not found" });

    await prisma.transaction.delete({ where: { id } });

    res.json({ message: "Transaction deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete transaction" });
  }
};

// --- SMS & BULK HANDLERS ---

export const addSmsTransaction = async (req, res) => {
  const { smsText } = req.body;

  if (!smsText) return res.status(400).json({ error: "No text provided" });

  const parsed = parseSms(smsText);
  if (!parsed) return res.status(400).json({ error: "Could not parse SMS" });

  // Agentic Upgrade: If rule-based parser failed to categorize, ask AI
  if (parsed.category === "Uncategorized") {
    console.log("🤖 Rule-based failed. Asking AI for SMS category...");
    parsed.category = await enrichCategoryWithAI(
      parsed.merchant,
      smsText,
      parsed.amount
    );
  }

  try {
    const tx = await prisma.transaction.create({
      data: {
        userId: req.user.id,
        amount: parsed.amount,
        type: parsed.type,
        merchant: parsed.merchant,
        category: parsed.category,
        timestamp: parsed.timestamp,
      },
    });
    res.json(tx);
  } catch (error) {
    res.status(500).json({ error: "Failed to save SMS transaction" });
  }
};

export const addBulkSms = async (req, res) => {
  const { messages } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "No messages provided" });
  }

  try {
    const validData = [];

    for (const smsText of messages) {
      const parsed = parseSms(smsText);
      if (parsed) {
        validData.push({
          userId: req.user.id,
          amount: parsed.amount,
          type: parsed.type,
          merchant: parsed.merchant,
          category: parsed.category,
          timestamp: parsed.timestamp,
        });
      }
    }

    if (validData.length === 0) {
      return res.json({
        message: "No valid transactions found in SMS list",
        count: 0,
      });
    }

    const result = await prisma.transaction.createMany({
      data: validData,
    });

    res.json({ message: "Bulk SMS sync successful", count: result.count });
  } catch (error) {
    console.error("Bulk SMS Error:", error);
    res.status(500).json({ error: "Failed to process bulk SMS" });
  }
};
