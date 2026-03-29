const express = require("express");
const router = express.Router();
const getPostStats = require("../controllers/stats/getPostStats");
const { protect, authorizeRoles } = require("../middleware/auth");

/**
 * @route   GET /api/stats/posts
 * @desc    Get blog statistics
 * @access  Private (admin only)
 */
router.get("/posts", protect, authorizeRoles("admin"), getPostStats);

module.exports = router;
