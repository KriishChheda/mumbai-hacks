import { prisma } from "../../prisma/client.js";

export const createGroup = async (req, res) => {
  const { name } = req.body;
  const groupCode = Math.random().toString(36).substring(2, 8).toUpperCase();

  try {
    const group = await prisma.group.create({
      data: {
        name,
        groupCode,
        createdById: req.user.id,
        members: {
          create: {
            userId: req.user.id,
            role: "ADMIN",
          },
        },
      },
      include: { members: true },
    });
    res.json(group);
  } catch (error) {
    res.status(500).json({ error: "Failed to create group" });
  }
};

export const joinGroup = async (req, res) => {
  const { groupCode } = req.body;

  try {
    const group = await prisma.group.findUnique({ where: { groupCode } });
    if (!group) return res.status(404).json({ error: "Group not found" });

    const existingMember = await prisma.groupMember.findFirst({
      where: { groupId: group.id, userId: req.user.id },
    });

    if (existingMember)
      return res.status(400).json({ error: "Already a member" });

    await prisma.groupMember.create({
      data: {
        groupId: group.id,
        userId: req.user.id,
        role: "MEMBER",
      },
    });

    res.json({ message: "Joined group successfully", groupId: group.id });
  } catch (error) {
    res.status(500).json({ error: "Failed to join group" });
  }
};

export const getMyGroups = async (req, res) => {
  try {
    const memberships = await prisma.groupMember.findMany({
      where: { userId: req.user.id },
      include: { group: true },
    });

    const result = memberships.map((m) => ({
      ...m.group,
      myRole: m.role,
    }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch groups" });
  }
};

export const removeMember = async (req, res) => {
  const { groupId, memberId } = req.body;
  const currentUserId = req.user.id;

  try {
    const requester = await prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId: currentUserId } },
    });

    if (!requester || requester.role !== "ADMIN") {
      return res.status(403).json({ error: "Only Admins can remove members" });
    }

    await prisma.groupMember.delete({
      where: { groupId_userId: { groupId, userId: memberId } },
    });

    res.json({ message: "Member removed" });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove member" });
  }
};

export const leaveGroup = async (req, res) => {
  const { groupId } = req.body;
  const currentUserId = req.user.id;

  try {
    const membership = await prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId: currentUserId } },
    });

    if (!membership) {
      return res.status(404).json({ error: "Not a member of the group" });
    }

    if (membership.role === "ADMIN") {
      const adminCount = await prisma.groupMember.count({
        where: { groupId, role: "ADMIN" },
      });

      if (adminCount <= 1) {
        return res
          .status(400)
          .json({ error: "Cannot leave group as the only Admin" });
      }
    }

    await prisma.groupMember.delete({
      where: { groupId_userId: { groupId, userId: currentUserId } },
    });

    res.json({ message: "Left group successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to leave group" });
  }
};
