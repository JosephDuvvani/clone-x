import prisma from "../db/prisma.js";

const create = async (content, authorId) => {
  const post = await prisma.post.create({
    data: {
      content,
      authorId,
    },
  });
  return post;
};

const findMany = async () => {
  const posts = await prisma.post.findMany({
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
      _count: true,
    },
  });
  return posts;
};

const exists = async (id) => {
  const post = await prisma.post.findUnique({
    where: {
      id,
    },
  });
  return !!post;
};

const update = async (id, content) => {
  const updatedPost = await prisma.post.update({
    where: {
      id,
    },
    data: {
      content,
    },
  });
  return updatedPost;
};

const updateLike = async (id, userId) => {
  const likedPost = await prisma.post.update({
    where: {
      id,
    },
    data: {
      likes: {
        connect: { id: userId },
      },
    },
    select: {
      id: true,
      _count: true,
    },
  });
  return likedPost;
};

const updateUnLike = async (id, userId) => {
  const likedPost = await prisma.post.update({
    where: {
      id,
    },
    data: {
      likes: {
        disconnect: { id: userId },
      },
    },
    select: {
      id: true,
      _count: true,
    },
  });
  return likedPost;
};

const isAuthor = async (id, authorId) => {
  const post = await prisma.post.findUnique({
    where: {
      id,
    },
  });
  return post.authorId === authorId;
};

const findFollowingPosts = async (userId, limit, offset) => {
  const posts = await prisma.post.findMany({
    where: {
      author: {
        followedBy: {
          some: {
            id: userId,
          },
        },
      },
    },
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
      _count: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    skip: offset,
  });

  return posts;
};

const destroy = async (id) => {
  const deletedPost = await prisma.post.delete({
    where: {
      id,
    },
  });
  return deletedPost;
};

export default {
  create,
  findMany,
  exists,
  update,
  updateLike,
  updateUnLike,
  isAuthor,
  findFollowingPosts,
  destroy,
};
