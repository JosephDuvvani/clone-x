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

const findMany = async (limit) => {
  const user = await prisma.user.findMany({
    take: limit,
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

const findInfo = async (id) => {
  const userInfo = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      username: true,
      createdAt: true,
      profile: true,
      _count: {
        select: {
          posts: true,
          followedBy: true,
          following: true,
        },
      },
    },
  });

  return userInfo;
};

const findPosts = async (id, limit, offset) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      posts: {
        take: limit,
        skip: offset,
        include: {
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
      },
    },
  });

  return user.posts;
};

const findLikedPosts = async (id, limit, offset) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      likedPosts: {
        take: limit,
        skip: offset,
        include: {
          author: {
            select: {
              username: true,
              profile: {
                select: {
                  pictureUrl: true,
                  firstname: true,
                  lastname: true,
                },
              },
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
      },
    },
  });

  return user.likedPosts;
};

const follow = async (userId, targetId) => {
  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      following: {
        connect: {
          id: targetId,
        },
      },
    },
  });

  return user;
};

const unfollow = async (userId, targetId) => {
  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      following: {
        disconnect: {
          id: targetId,
        },
      },
    },
  });

  return user;
};

const isFollowing = async (userId, targetId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      following: {
        where: {
          id: targetId,
        },
      },
    },
  });

  return user.following.length > 0;
};

const findFollowers = async (userId, limit, offset) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      followedBy: {
        take: limit,
        skip: offset,
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
      },
    },
  });

  return user.followedBy;
};

const findFollowing = async (userId, limit, offset) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      following: {
        take: limit,
        skip: offset,
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
      },
    },
  });

  return user.following;
};

const findNotFollowing = async (userId, limit, offset) => {
  const users = await prisma.user.findMany({
    where: {
      followedBy: {
        none: { id: userId },
      },
      NOT: {
        id: userId,
      },
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
    take: limit,
    skip: offset,
  });

  return users;
};

const search = async (text, limit, offset) => {
  const users = await prisma.user.findMany({
    where: {
      OR: [
        {
          username: {
            contains: text,
          },
        },
        {
          profile: {
            OR: [
              {
                firstname: {
                  contains: text,
                },
              },
              {
                lastname: {
                  contains: text,
                },
              },
            ],
          },
        },
      ],
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
    take: limit,
    skip: offset,
  });
  return users;
};

const destroy = async (id) => {
  await prisma.user.delete({
    where: {
      id,
    },
  });
};

export default {
  create,
  exists,
  find,
  findById,
  findMany,
  findInfo,
  findPosts,
  findLikedPosts,
  follow,
  unfollow,
  isFollowing,
  findFollowers,
  findFollowing,
  findNotFollowing,
  search,
  destroy,
};
