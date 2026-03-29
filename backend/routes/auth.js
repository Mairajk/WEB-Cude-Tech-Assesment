const express = require("express");
const router = express.Router();

const register = require("../controllers/auth/register");
const login = require("../controllers/auth/login");
const refresh = require("../controllers/auth/refresh");
const logout = require("../controllers/auth/logout");
const getMe = require("../controllers/auth/getMe");

const {
  validate,
  registerRules,
  loginRules,
} = require("../middleware/validation");

const { protect } = require("../middleware/auth");

/**
 * @route   POST /api/auth/register
 * @access  Public
 */
router.post("/register", registerRules, validate, register);

/**
 * @route   POST /api/auth/login
 * @access  Public
 */
router.post("/login", loginRules, validate, login);

/**
 * @route   POST /api/auth/refresh
 * @access  Public
 */
router.post("/refresh", refresh);

/**
 * @route   POST /api/auth/logout
 * @access  Private
 */
router.post("/logout", protect, logout);

/**
 * @route   GET /api/auth/me
 * @access  Private
 */
router.get("/me", protect, getMe);

module.exports = router;
