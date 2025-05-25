import prisma from "../db/prisma.js";

const find = async (username) => {
  const profile = await prisma.profile.findFirst({
    where: {
      user: { username },
    },
  });
  return profile;
};

const findByUserId = async (userId) => {
  const profile = await prisma.profile.findUnique({
    where: { userId },
  });
  return profile;
};

const updateProfile = async (username, data) => {
  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });

  const profile = await prisma.profile.update({
    where: {
      userId: user.id,
    },
    data,
  });
  return profile;
};

export default {
  find,
  findByUserId,
  updateProfile,
};
