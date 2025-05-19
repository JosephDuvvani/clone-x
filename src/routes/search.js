import { Router } from "express";
import Auth from "../middleware/authMiddleware.js";
import { searchUsers } from "../controllers/search.js";

const router = Router();

router.get("/users", Auth.isAuth, searchUsers);

export default router;
