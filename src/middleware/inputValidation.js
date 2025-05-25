import { body, validationResult } from "express-validator";

const validateProfile = [
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
];

const handleValidationErrors = (req, res, next) => {
  console.log(req.body);
  const results = validationResult(req);
  if (!results.isEmpty()) {
    return res.status(400).json({ errors: results.errors });
  }
  next();
};

export { validateProfile, handleValidationErrors };
