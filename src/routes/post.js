import { Router } from "express";
import {
  create,
  deletePost,
  findPosts,
  findReplies,
  likePost,
  unLikePost,
  updatePost,
} from "../controllers/post.js";
import Auth from "../middleware/authMiddleware.js";
import {
  createComment,
  deleteComment,
  findComments,
  likeComment,
  unLikeComment,
} from "../controllers/comment.js";

const router = Router();

router.post("/", Auth.isAuth, create);
router.post("/:postId", Auth.isAuth, create);
router.get("/", Auth.isAuth, findPosts);
router.get("/:postId/replies", Auth.isAuth, findReplies);
router.put("/:postId/like", Auth.isAuth, likePost);
router.put("/:postId/unlike", Auth.isAuth, unLikePost);
router.put("/:postId/update", Auth.isAuth, updatePost);
router.delete("/:postId/delete", Auth.isAuth, deletePost);

router.post("/:postId/comments", Auth.isAuth, createComment);
router.get("/:postId/comments", Auth.isAuth, findComments);
router.put("/:postId/comments/:commentId/like", Auth.isAuth, likeComment);
router.put("/:postId/comments/:commentId/unlike", Auth.isAuth, unLikeComment);
router.delete(
  "/:postId/comments/:commentId/delete",
  Auth.isAuth,
  deleteComment
);

export default router;
