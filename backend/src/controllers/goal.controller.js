import { prisma } from "../../prisma/client.js";

export const createGroupGoal = async (req, res) => {
  const { groupId, title, target } = req.body;

  try {
    const goal = await prisma.groupGoal.create({
      data: {
        groupId,
        title,
        target: parseFloat(target),
      },
    });
    res.json(goal);
  } catch (error) {
    res.status(500).json({ error: "Failed to create goal" });
  }
};

export const contributeToGroupGoal = async (req, res) => {
  const { goalId, amount } = req.body;
  const userId = req.user.id;
  const numericAmount = parseFloat(amount);

  try {
    await prisma.groupGoalProgress.upsert({
      where: {
        groupGoalId_userId: {
          groupGoalId: goalId,
          userId: userId,
        },
      },
      update: { amount: { increment: numericAmount } },
      create: {
        groupGoalId: goalId,
        userId: userId,
        amount: numericAmount,
      },
    });

    const totalProgress = await prisma.groupGoalProgress.aggregate({
      where: { groupGoalId: goalId },
      _sum: { amount: true },
    });

    const updatedGoal = await prisma.groupGoal.update({
      where: { id: goalId },
      data: { progress: totalProgress._sum.amount || 0 },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { points: { increment: 10 } },
    });

    res.json(updatedGoal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to contribute" });
  }
};

export const groupGoalLeaderboard = async (req, res) => {
  const { goalId } = req.params;

  try {
    const leaderboard = await prisma.groupGoalProgress.findMany({
      where: { groupGoalId: goalId },
      include: { user: { select: { id: true, name: true, points: true } } },
      orderBy: { amount: "desc" },
    });

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch leaderboard" });
  }
};

export const createPersonalGoal = async (req, res) => {
  const { title, target } = req.body;

  try {
    const goal = await prisma.goal.create({
      data: {
        userId: req.user.id,
        title,
        target: parseFloat(target),
      },
    });
    res.json(goal);
  } catch (error) {
    res.status(500).json({ error: "Failed to create personal goal" });
  }
};

export const getMyGoals = async (req, res) => {
  try {
    const goals = await prisma.goal.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch goals" });
  }
};

export const updateGoalProgress = async (req, res) => {
  const { goalId } = req.params;
  const { amount } = req.body;

  try {
    const goal = await prisma.goal.update({
      where: { id: goalId },
      data: { progress: { increment: parseFloat(amount) } },
    });
    res.json(goal);
  } catch (error) {
    res.status(500).json({ error: "Failed to update progress" });
  }
};
