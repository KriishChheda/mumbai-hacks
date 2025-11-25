import { prisma } from "../../prisma/client.js";

export const createGroup = async (req, res) => {
  const { name } = req.body;

  const groupCode = Math.random().toString(36).substring(2, 6).toUpperCase();

  const group = await prisma.group.create({
    data: {
      name,
      groupCode,
      createdById: req.user.id,
      members: {
        create: {
          userId: req.user.id,
        },
      },
    },
    include: { members: true },
  });

  res.json(group);
};

export const joinGroup = async (req, res) => {
  const { groupCode } = req.body;

  const group = await prisma.group.findUnique({
    where: { groupCode },
  });

  if (!group) return res.status(404).json({ error: "Group not found" });

  const isMember = await prisma.groupMember.findFirst({
    where: { groupId: group.id, userId: req.user.id },
  });

  if (isMember) return res.status(400).json({ error: "Already in group" });

  await prisma.groupMember.create({
    data: {
      groupId: group.id,
      userId: req.user.id,
    },
  });

  res.json({ message: "Joined group", groupId: group.id });
};

export const getMyGroups = async (req, res) => {
  const groups = await prisma.groupMember.findMany({
    where: { userId: req.user.id },
    include: { group: true },
  });

  res.json(groups.map((g) => g.group));
};
