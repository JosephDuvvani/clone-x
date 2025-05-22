import { Router } from "express";
import {
  deleteUser,
  followUser,
  getFollowers,
  getFollowing,
  getFollowingPosts,
  getNotFollowing,
  getUserInfo,
  getUserLikedPosts,
  getUserPosts,
  unfollowUser,
} from "../controllers/user.js";
import Auth from "../middleware/authMiddleware.js";

const router = Router();

router.get("/:username", Auth.isAuth, getUserInfo);
router.get("/:username/posts", Auth.isAuth, getUserPosts);
router.get("/:username/liked_posts", Auth.isAuth, getUserLikedPosts);

router.post("/:username/follow", Auth.isAuth, followUser);
router.post("/:username/unfollow", Auth.isAuth, unfollowUser);
router.get("/:username/followers", Auth.isAuth, getFollowers);
router.get("/:username/following", Auth.isAuth, getFollowing);
router.get("/:username/notFollowing", Auth.isAuth, getNotFollowing);
router.get("/:username/following_posts", Auth.isAuth, getFollowingPosts);

router.post("/:userId/delete", Auth.isAuth, deleteUser);

export default router;
