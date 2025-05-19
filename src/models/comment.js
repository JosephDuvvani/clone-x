import prisma from "../db/prisma.js";

const create = async (content, postId, authorId) => {
  const comment = await prisma.comment.create({
    data: {
      content,
      postId,
      authorId,
    },
  });
  return comment;
};

const findMany = async (postId, offset, limit) => {
  const comments = await prisma.comment.findMany({
    where: {
      postId,
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
      createdAt: "asc",
    },
    skip: offset,
    take: limit,
  });
  return comments;
};

const exists = async (id) => {
  const comment = await prisma.comment.findUnique({
    where: {
      id,
    },
  });
  return !!comment;
};

const updateLike = async (id, userId) => {
  const likedComment = await prisma.comment.update({
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
  return likedComment;
};

const updateUnLike = async (id, userId) => {
  const unlikedComment = await prisma.comment.update({
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
  return unlikedComment;
};

const isAuthor = async (id, authorId) => {
  const comment = await prisma.comment.findUnique({
    where: {
      id,
    },
  });
  return comment.authorId === authorId;
};

const destroy = async (id) => {
  const deletedComment = await prisma.comment.delete({
    where: {
      id,
    },
  });
  return deletedComment;
};

export default {
  create,
  findMany,
  exists,
  updateLike,
  updateUnLike,
  isAuthor,
  destroy,
};
