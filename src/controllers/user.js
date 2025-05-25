import models from "../models/index.js";

const getUserInfo = async (req, res) => {
  const { username } = req.params;

  try {
    const userInfo = await models.User.findInfo(username);
    if (!userInfo) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    return res.json({ userInfo });
  } catch (err) {
    return res.status(500).json({
      message: "Error retrieving user information",
      error: err,
    });
  }
};

const getUserPosts = async (req, res) => {
  const { username } = req.params;
  const offset = +req.query.offset || 0;
  const limit = +req.query.limit || 10;

  try {
    const posts = await models.User.findPosts(username, limit, offset);
    return res.json({ posts });
  } catch (err) {
    return res.status(500).json({
      message: "Error retrieving posts",
      error: err,
    });
  }
};

const getUserLikedPosts = async (req, res) => {
  const { username } = req.params;
  const offset = +req.query.offset || 0;
  const limit = +req.query.limit || 10;

  try {
    const likes = await models.User.findLikedPosts(username, limit, offset);

    return res.json({ likes });
  } catch (err) {
    return res.status(500).json({
      message: "Error retrieving posts",
      error: err,
    });
  }
};

const followUser = async (req, res) => {
  const username = req.user.username;
  const target = req.params.username;

  if (username === target) {
    return res.status(400).json({
      message: "You cannot follow yourself",
    });
  }

  try {
    const isFollowing = await models.User.isFollowing(username, target);
    if (isFollowing) {
      return res.status(400).json({
        message: "You are already following this user",
      });
    }

    await models.User.follow(username, target);
    return res.sendStatus(204);
  } catch (err) {
    return res.status(500).json({
      message: "Error following user",
      error: err,
    });
  }
};

const unfollowUser = async (req, res) => {
  const username = req.user.username;
  const target = req.params.username;

  if (username === target) {
    return res.status(400).json({
      message: "You cannot unfollow yourself",
    });
  }

  try {
    const isFollowing = await models.User.isFollowing(username, target);
    if (!isFollowing) {
      return res.status(400).json({
        message: "You are not following this user",
      });
    }

    await models.User.unfollow(username, target);
    return res.sendStatus(204);
  } catch (err) {
    return res.status(500).json({
      message: "Error unfollowing user",
      error: err,
    });
  }
};

const getFollowers = async (req, res) => {
  const { username } = req.params;
  const offset = +req.query.offset || 0;
  const limit = +req.query.limit || 10;

  try {
    const followers = await models.User.findFollowers(username, limit, offset);
    return res.json({ followers });
  } catch (err) {
    return res.status(500).json({
      message: "Error retrieving followers",
      error: err,
    });
  }
};

const getFollowing = async (req, res) => {
  const { username } = req.params;
  const offset = +req.query.offset || 0;
  const limit = +req.query.limit || 10;

  try {
    const following = await models.User.findFollowing(username, limit, offset);
    return res.json({ following });
  } catch (err) {
    return res.status(500).json({
      message: "Error retrieving following",
      error: err,
    });
  }
};

const getNotFollowing = async (req, res) => {
  const { username } = req.params;
  const offset = +req.query.offset || 0;
  const limit = +req.query.limit || 10;

  if (username !== req.user.username) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const notFollowing = await models.User.findNotFollowing(
      username,
      limit,
      offset
    );
    return res.json({ notFollowing });
  } catch (err) {
    return res.status(500).json({
      message: "Error retrieving not following",
      error: err,
    });
  }
};

const getFollowingPosts = async (req, res) => {
  const { username } = req.params;
  const offset = +req.query.offset || 0;
  const limit = +req.query.limit || 10;

  if (username !== req.user.username) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const posts = await models.Post.findFollowingPosts(
      req.user.id,
      limit,
      offset
    );
    return res.json({ posts });
  } catch (err) {
    return res.status(500).json({
      message: "Error retrieving following posts",
      error: err,
    });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.user.id;
  const deleteId = req.params.userId;

  if (userId !== deleteId) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    await models.User.destroy(deleteId);
    return res.sendStatus(204);
  } catch (err) {
    return res.status(500).json({
      message: "Error deleting user",
      error: err,
    });
  }
};

export {
  getUserInfo,
  getUserPosts,
  getUserLikedPosts,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getNotFollowing,
  getFollowingPosts,
  deleteUser,
};
