import models from "../models/index.js";

const create = async (req, res) => {
  const { content } = req.body;

  try {
    const post = await models.Post.create(content, req.user.id);
    return res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error creating new post",
      error: err,
    });
  }
};

const findPosts = async (req, res) => {
  try {
    const posts = await models.Post.findMany();
    return res.json({
      posts,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error finding posts",
      error: err,
    });
  }
};

const likePost = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await models.Post.updateLike(postId, req.user.id);
    return res.json({
      post,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error liking post",
      error: err,
    });
  }
};

const unLikePost = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await models.Post.updateUnLike(postId, req.user.id);
    return res.json({
      post,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error unliking post",
      error: err,
    });
  }
};

export { create, findPosts, likePost, unLikePost };
