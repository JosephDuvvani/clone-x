import prisma from "../db/prisma.js";

const create = async (body, authorId) => {
  const post = await prisma.post.create({
    data: {
      body,
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

const update = async (id, body) => {
  const updatedPost = await prisma.post.update({
    where: {
      id,
    },
    data: {
      body,
    },
  });
  return updatedPost;
};

const isLiked = async (id, userId) => {
  const likedPost = await prisma.post.findFirst({
    where: {
      id,
      likes: {
        some: {
          userId,
        },
      },
    },
  });
  return !!likedPost;
};

const updateLike = async (id, userId) => {
  const likedPost = await prisma.post.update({
    where: {
      id,
    },
    data: {
      likes: {
        create: {
          userId,
        },
      },
    },
    select: {
      id: true,
      _count: true,
    },
  });
  return likedPost;
};

const updateUnLike = async (id) => {
  const unlikedPost = await prisma.like.delete({
    where: {
      id,
    },
  });
  return unlikedPost;
};

const findLiked = async (postId, userId) => {
  const likedPost = await prisma.like.findFirst({
    where: {
      postId,
      userId,
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
  isLiked,
  updateLike,
  updateUnLike,
  findLiked,
  isAuthor,
  findFollowingPosts,
  destroy,
};
