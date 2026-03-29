const express = require("express");
const router = express.Router();
const authRoutes = require("./auth");
const postRoutes = require("./post");
const statsRoutes = require("./stats");

/**
 * Master route registry
 * All API routes centrally registered here
 * server.js only imports this single file
 */
router.use("/auth", authRoutes);
router.use("/posts", postRoutes);
router.use("/stats", statsRoutes);

module.exports = router;
