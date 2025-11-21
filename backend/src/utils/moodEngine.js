import { prisma } from "../app.js";

// Mood formula (simple hackathon version)
export const updateMoodState = async (userId) => {
  const transactions = await prisma.transaction.findMany({
    where: { userId }
  });

  let impulseCount = 0;

  transactions.forEach(t => {
    if (t.category === "impulse") impulseCount++;
  });

  let mood = "neutral";

  if (impulseCount > 5) mood = "stressed";
  else if (impulseCount === 0) mood = "disciplined";
  else mood = "casual";

  await prisma.user.update({
    where: { id: userId },
    data: { moodState: mood }
  });
};
