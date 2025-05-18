import { Router } from "express";
import {
  create,
  deletePost,
  findPosts,
  likePost,
  unLikePost,
  updatePost,
} from "../controllers/post.js";
import Auth from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", Auth.isAuth, create);
router.get("/", Auth.isAuth, findPosts);
router.put("/:postId/like", Auth.isAuth, likePost);
router.put("/:postId/unlike", Auth.isAuth, unLikePost);
router.put("/:postId/update", Auth.isAuth, updatePost);
router.delete("/:postId/delete", Auth.isAuth, deletePost);

export default router;
