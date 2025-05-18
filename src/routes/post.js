import { Router } from "express";
import {
  create,
  findPosts,
  likePost,
  unLikePost,
} from "../controllers/post.js";
import Auth from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", Auth.isAuth, create);
router.get("/", Auth.isAuth, findPosts);
router.put("/:postId/like", Auth.isAuth, likePost);
router.put("/:postId/unlike", Auth.isAuth, unLikePost);

export default router;
