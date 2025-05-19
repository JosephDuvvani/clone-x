import models from "../models/index.js";

const createComment = async (req, res) => {
  const { content } = req.body;
  const { postId } = req.params;

  try {
    const comment = await models.Comment.create(content, postId, req.user.id);
    return res.status(201).json({
      message: "Comment posted successfully",
      comment,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error posting comment",
      error: err,
    });
  }
};

const findComments = async (req, res) => {
  const { postId } = req.params;
  const offset = +req.query.offset || 0;
  const limit = +req.query.limit || 10;

  try {
    const postExists = await models.Post.exists(postId);
    if (!postExists) {
      return res.status(404).json({
        message: "Post not found",
      });
    }
    const comments = await models.Comment.findMany(postId, offset, limit);
    return res.json({
      comments,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error finding comments",
      error: err,
    });
  }
};

const likeComment = async (req, res) => {
  const { commentId } = req.params;
  try {
    const exists = await models.Comment.exists(commentId);
    if (!exists) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }
    const comment = await models.Comment.updateLike(commentId, req.user.id);
    return res.json({
      comment,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error liking comment",
      error: err,
    });
  }
};

const unLikeComment = async (req, res) => {
  const { commentId } = req.params;
  try {
    const exists = await models.Comment.exists(commentId);
    if (!exists) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }
    const comment = await models.Comment.updateUnLike(commentId, req.user.id);
    return res.json({
      comment,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error unliking comment",
      error: err,
    });
  }
};

const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  try {
    const exists = await models.Comment.exists(commentId);
    if (!exists) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }
    const isAuthor = await models.Comment.isAuthor(commentId, req.user.id);
    if (!isAuthor) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const comment = await models.Comment.destroy(commentId);
    return res.json({
      comment,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error deleting comment",
      error: err,
    });
  }
};

export {
  createComment,
  findComments,
  likeComment,
  unLikeComment,
  deleteComment,
};
