import models from "../models/index.js";

const create = async (req, res) => {
  const { body } = req.body;
  const postId = req.params.postId || null;

  try {
    const post = await models.Post.create(body, req.user.id, postId);
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

const findReplies = async (req, res) => {
  const { postId } = req.params;
  const offset = +req.query.offset || 0;
  const limit = +req.query.limit || 10;

  try {
    let replies = await models.Post.findReplies(postId, limit, offset);
    if (replies.length > 0) {
      const likesIDs = await models.User.findLikesIDs(req.user.username);

      if (likesIDs.length > 0)
        replies = replies.map((post) =>
          likesIDs.includes(post.id)
            ? { ...post, liked: true }
            : { ...post, liked: false }
        );
    }
    return res.json({
      replies,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error finding replies",
      error: err,
    });
  }
};

const findReplyChain = async (req, res) => {
  const { postId } = req.params;
  let chain = [];

  try {
    let currentPost = await models.Post.find(postId);
    const likesIDs = await models.User.findLikesIDs(req.user.username);

    while (currentPost) {
      currentPost = likesIDs.includes(currentPost.id)
        ? { ...currentPost, liked: true }
        : { ...currentPost, liked: false };
      chain.unshift(currentPost);
      if (!currentPost.replyToId) break;

      currentPost = await models.Post.find(currentPost.replyToId);
    }

    return res.json({ chain });
  } catch (err) {
    res.status(500).json({
      message: "Error finding reply chain",
      error: err,
    });
  }
};

const updatePost = async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  try {
    const isAuthor = await models.Post.isAuthor(postId, req.user.id);
    if (!isAuthor) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const post = await models.Post.update(postId, content);
    return res.json({
      post,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error updating post",
      error: err,
    });
  }
};

const likePost = async (req, res) => {
  const { postId } = req.params;
  try {
    const isLiked = await models.Post.isLiked(postId, req.user.id);
    if (isLiked) {
      return res.status(400).json({ message: "You've liked the post already" });
    }
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
    const like = await models.Post.findLiked(postId, req.user.id);
    if (!like) {
      return res.status(400).json({ message: "Like not found to unlike" });
    }

    const post = await models.Post.updateUnLike(like.id);
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

const deletePost = async (req, res) => {
  const { postId } = req.params;
  try {
    const isAuthor = await models.Post.isAuthor(postId, req.user.id);
    if (!isAuthor) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const post = await models.Post.destroy(postId);
    return res.json({
      post,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error deleting post",
      error: err,
    });
  }
};

export {
  create,
  findPosts,
  findReplies,
  findReplyChain,
  updatePost,
  likePost,
  unLikePost,
  deletePost,
};
