import { prisma } from "../app.js";
import { updateMoodState } from "../utils/moodEngine.js";

export const addTransaction = async (req, res) => {
  const { userId, amount, type, category } = req.body;

  const tx = await prisma.transaction.create({
    data: { userId, amount, type, category }
  });

  await updateMoodState(userId); // Mood system auto-updates

  res.json(tx);
};

export const getUserTransactions = async (req, res) => {
  const transactions = await prisma.transaction.findMany({
    where: { userId: Number(req.params.userId) }
  });
  res.json(transactions);
};
