import { Router } from "express";
import { login, logout, signup } from "../controllers/auth.js";
import Auth from "../middleware/authMiddleware.js";

const router = Router();

router.post("/signup", Auth.signupRules, Auth.validation, signup, login);
router.post("/login", Auth.loginRules, Auth.validation, login);
router.get("/logout", Auth.isAuth, logout);
router.get("/me", Auth.isAuth, (req, res) => {
  res.json({
    user: req.user,
  });
});

export default router;
