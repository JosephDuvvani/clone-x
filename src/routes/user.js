import { Router } from "express";
import {
  deleteUser,
  followUser,
  getFollowers,
  getFollowing,
  getNotFollowing,
  getUserInfo,
  getUserLikedPosts,
  getUserPosts,
  unfollowUser,
} from "../controllers/user.js";
import Auth from "../middleware/authMiddleware.js";

const router = Router();

router.get("/:userId", Auth.isAuth, getUserInfo);
router.get("/:userId/posts", Auth.isAuth, getUserPosts);
router.get("/:userId/liked_posts", Auth.isAuth, getUserLikedPosts);

router.post("/:userId/follow", Auth.isAuth, followUser);
router.post("/:userId/unfollow", Auth.isAuth, unfollowUser);
router.get("/:userId/followers", Auth.isAuth, getFollowers);
router.get("/:userId/following", Auth.isAuth, getFollowing);
router.get("/:userId/notFollowing", Auth.isAuth, getNotFollowing);

router.post("/:userId/delete", Auth.isAuth, deleteUser);

export default router;
