import { body, validationResult } from "express-validator";
import models from "../models/index.js";

const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

const signupRules = [
  body("firstname")
    .trim()
    .notEmpty()
    .withMessage("Firstname is required")
    .isLength({ max: 20 })
    .withMessage("Firstname must not be more than 20 characters"),
  body("lastname")
    .trim()
    .optional()
    .isLength({ max: 20 })
    .withMessage("Lastname must not be more than 20 characters"),
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be between 3 and 20 characters")
    .isAlphanumeric()
    .withMessage("Username must be alphanumeric")
    .custom(async (value) => {
      const exists = await models.User.exists(value);
      if (exists) throw new Error("Username already exists");
      return true;
    }),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be between 8 and 20 characters"),
];

const loginRules = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be between 3 and 20 characters")
    .isAlphanumeric()
    .withMessage("Username must be alphanumeric"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be between 8 and 20 characters"),
];

const validation = (req, res, next) => {
  const results = validationResult(req);
  if (!results.isEmpty()) {
    return res.status(400).json({ errors: results.errors });
  }
  next();
};

export default { isAuth, signupRules, loginRules, validation };
