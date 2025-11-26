import { prisma } from "../../prisma/client.js";

export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

export const updateProfile = async (req, res) => {
  const { income, budgetLimit } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        income: parseFloat(income),
        budgetLimit: parseFloat(budgetLimit),
      },
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile" });
  }
};

export const getSavingsStats = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);

    const expenses = await prisma.transaction.aggregate({
      where: {
        userId: req.user.id,
        type: "EXPENSE",
        timestamp: { gte: firstDay },
      },
      _sum: { amount: true },
    });

    const totalSpent = expenses._sum.amount || 0;
    const savings = (user.income || 0) - totalSpent;
    const budgetLeft = (user.budgetLimit || 0) - totalSpent;

    res.json({
      income: user.income,
      budgetLimit: user.budgetLimit,
      totalSpent,
      savings,
      budgetLeft,
      message:
        savings > 0
          ? `🎉 You saved ₹${savings} this month! Treat yourself?`
          : `⚠️ You have overspent by ₹${Math.abs(savings)}.`,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to calc savings" });
  }
};
