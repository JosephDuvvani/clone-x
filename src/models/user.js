import prisma from "../db/prisma.js";

const create = async ({ username, password, firstname, lastname }) => {
  const newUser = await prisma.user.create({
    data: {
      username,
      password,
      profile: {
        create: {
          firstname,
          lastname,
        },
      },
    },
  });
  return newUser;
};

const exists = async (username) => {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  return !!user;
};

const find = async (username) => {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
      username: true,
      password: true,
      profile: {
        select: {
          pictureUrl: true,
          firstname: true,
          lastname: true,
        },
      },
    },
  });

  return user;
};

const findById = async (id) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      username: true,
      profile: {
        select: {
          pictureUrl: true,
          firstname: true,
          lastname: true,
        },
      },
    },
  });

  return user;
};

export default { create, exists, find, findById };
