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

const findInfo = async (username) => {
  const userInfo = await prisma.user.findUnique({
    where: {
      username,
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

const findPosts = async (username, limit, offset) => {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      posts: {
        where: {
          replyToId: null,
        },
        take: limit,
        skip: offset,
        include: {
          author: {
            select: {
              username: true,
              profile: true,
              _count: {
                select: {
                  followedBy: true,
                  following: true,
                },
              },
            },
          },
          _count: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  return user.posts;
};

const findLikedPosts = async (username, limit, offset) => {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      likedPosts: {
        take: limit,
        skip: offset,
        select: {
          id: true,
          likedAt: true,
          post: {
            include: {
              author: {
                select: {
                  username: true,
                  profile: true,
                  _count: {
                    select: {
                      followedBy: true,
                      following: true,
                    },
                  },
                },
              },
              replyTo: {
                include: {
                  author: {
                    select: {
                      username: true,
                      profile: true,
                      _count: {
                        select: {
                          followedBy: true,
                          following: true,
                        },
                      },
                    },
                  },
                  _count: true,
                },
              },
              _count: true,
            },
          },
        },
        orderBy: {
          likedAt: "desc",
        },
      },
    },
  });

  return user.likedPosts;
};

const findLikesIDs = async (username) => {
  const userInfo = await prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      likedPosts: {
        select: { postId: true },
      },
    },
  });

  return userInfo?.likedPosts.length > 0
    ? userInfo.likedPosts.map((like) => like.postId)
    : [];
};

const findConnectIDs = async (username) => {
  const userInfo = await prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      followedBy: {
        select: { id: true },
      },
      following: {
        select: { id: true },
      },
    },
  });

  return {
    followedByIDs:
      userInfo?.followedBy.length > 0
        ? userInfo.followedBy.map((user) => user.id)
        : [],
    followingIDs:
      userInfo?.following.length > 0
        ? userInfo.following.map((user) => user.id)
        : [],
  };
};

const follow = async (username, target) => {
  const user = await prisma.user.update({
    where: {
      username,
    },
    data: {
      following: {
        connect: {
          username: target,
        },
      },
    },
  });

  return user;
};

const unfollow = async (username, targetUsername) => {
  const user = await prisma.user.update({
    where: {
      username,
    },
    data: {
      following: {
        disconnect: {
          username: targetUsername,
        },
      },
    },
  });

  return user;
};

const isFollowing = async (username, target) => {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      following: {
        where: {
          username: target,
        },
      },
    },
  });

  return user.following.length > 0;
};

const findFollowers = async (username, limit, offset) => {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      followedBy: {
        take: limit,
        skip: offset,
        select: {
          id: true,
          username: true,
          profile: true,
          _count: {
            select: {
              followedBy: true,
              following: true,
            },
          },
        },
      },
    },
  });

  return user.followedBy;
};

const findFollowing = async (username, limit, offset) => {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      following: {
        take: limit,
        skip: offset,
        select: {
          id: true,
          username: true,
          profile: true,
          _count: {
            select: {
              followedBy: true,
              following: true,
            },
          },
        },
      },
    },
  });

  return user.following;
};

const findNotFollowing = async (username, limit, offset) => {
  const users = await prisma.user.findMany({
    where: {
      followedBy: {
        none: { username },
      },
      NOT: {
        username,
      },
    },
    select: {
      id: true,
      username: true,
      profile: true,
      _count: {
        select: {
          followedBy: true,
          following: true,
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
  findLikesIDs,
  findConnectIDs,
  follow,
  unfollow,
  isFollowing,
  findFollowers,
  findFollowing,
  findNotFollowing,
  search,
  destroy,
};
