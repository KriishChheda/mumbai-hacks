export const createGroupGoal = async (req, res) => {
  const { groupId, title, target } = req.body;

  const goal = await prisma.groupGoal.create({
    data: {
      groupId,
      title,
      target,
    },
  });

  res.json(goal);
};

export const contributeToGroupGoal = async (req, res) => {
  const { goalId, amount } = req.body;

  const contribution = await prisma.groupGoalProgress.upsert({
    where: {
      groupGoalId_userId: {
        groupGoalId: goalId,
        userId: req.user.id,
      },
    },
    update: { amount: { increment: amount } },
    create: {
      groupGoalId: goalId,
      userId: req.user.id,
      amount,
    },
  });

  // Update total progress
  const total = await prisma.groupGoalProgress.aggregate({
    where: { groupGoalId: goalId },
    _sum: { amount: true },
  });

  await prisma.groupGoal.update({
    where: { id: goalId },
    data: { progress: total._sum.amount || 0 },
  });

  res.json(contribution);
};

export const groupGoalLeaderboard = async (req, res) => {
  const { goalId } = req.params;

  const leaderboard = await prisma.groupGoalProgress.findMany({
    where: { groupGoalId: goalId },
    include: { user: true },
    orderBy: { amount: "desc" },
  });

  res.json(leaderboard);
};
