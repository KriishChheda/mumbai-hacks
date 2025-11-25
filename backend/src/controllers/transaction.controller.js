import { prisma } from "../../prisma/client.js";

export const addTransaction = async (req, res) => {
  const { amount, type, merchant, category } = req.body;

  const tx = await prisma.transaction.create({
    data: {
      userId: req.user.id,
      amount,
      type,
      merchant,
      category,
    },
  });

  res.json(tx);
};

export const getMyTransactions = async (req, res) => {
  const txs = await prisma.transaction.findMany({
    where: { userId: req.user.id },
    orderBy: { timestamp: "desc" },
  });

  res.json(txs);
};
