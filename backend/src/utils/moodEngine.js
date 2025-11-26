import { prisma } from "../../prisma/client.js";

export const updateMoodState = async (userId) => {
  const transactions = await prisma.transaction.findMany({
    where: { userId },
  });

  let impulseCount = 0;

  transactions.forEach((t) => {
    if (t.category === "impulse") impulseCount++;
  });

  let mood = "neutral";

  if (impulseCount > 5) mood = "stressed";
  else if (impulseCount === 0) mood = "disciplined";
  else mood = "casual";

  await prisma.user.update({
    where: { id: userId },
    data: { moodState: mood },
  });
};

export const getUserMood = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { moodState: true, moodScore: true },
  });

  return {
    state: user?.moodState || "neutral",
    score: user?.moodScore || 50,
  };
};
