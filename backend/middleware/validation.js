const { body, validationResult } = require("express-validator");

/**
 * Runs validation result check after express-validator rules
 * Must be used as last middleware in every validation chain
 * Collects all errors and returns them in a consistent format
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array().map((err) => err.msg),
    });
  }

  next();
};

/**
 * Validation rules for user registration
 * Each rule targets a specific field in req.body
 */
const registerRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("role")
    .optional()
    .isIn(["admin", "author"])
    .withMessage("Role must be either admin or author"),
];

/**
 * Validation rules for user login
 */
const loginRules = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("Password is required"),
];

/**
 * Validation rules for post creation and update
 */
const postRules = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 5, max: 200 })
    .withMessage("Title must be between 5 and 200 characters"),

  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 10 })
    .withMessage("Content must be at least 10 characters"),

  body("tags")
    .optional()
    .isArray({ max: 10 })
    .withMessage("Tags must be an array with max 10 items"),

  body("status")
    .optional()
    .isIn(["draft", "published"])
    .withMessage("Status must be either draft or published"),

  body("excerpt")
    .optional()
    .isLength({ max: 300 })
    .withMessage("Excerpt cannot exceed 300 characters"),
];

/**
 * Validation rules for comment creation
 */
const commentRules = [
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Comment content is required")
    .isLength({ min: 2, max: 500 })
    .withMessage("Comment must be between 2 and 500 characters"),
];

module.exports = {
  validate,
  registerRules,
  loginRules,
  postRules,
  commentRules,
};
