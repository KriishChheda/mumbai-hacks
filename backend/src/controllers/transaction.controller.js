import { prisma } from "../../prisma/client.js";
import { parseSms } from "../utils/smsParser.js";

// --- STANDARD CRUD ---

export const addTransaction = async (req, res) => {
  try {
    const { amount, type, merchant, category, timestamp } = req.body;

    if (amount === undefined || amount === null || isNaN(amount)) {
      return res.status(400).json({ error: "Invalid amount" });
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
  const { messages } = req.body; // Expects array of strings: ["SMS 1", "SMS 2"]

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
