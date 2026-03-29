const express = require("express");

const createPost = require("../controllers/post/createPost");
const getPosts = require("../controllers/post/getPosts");
const getMyPosts = require("../controllers/post/getMyPosts");
const getPostById = require("../controllers/post/getPostById");
const updatePost = require("../controllers/post/updatePost");
const deletePost = require("../controllers/post/deletePost");
const updatePostStatus = require("../controllers/post/updatePostStatus");
const getComments = require("../controllers/comment/getComments");
const addComment = require("../controllers/comment/addComment");

const { protect, authorizeRoles } = require("../middleware/auth");
const {
  validate,
  postRules,
  commentRules,
} = require("../middleware/validation");

const router = express.Router();

/**
 * @route   GET /api/posts
 * @desc    Get all published posts (public)
 */
router.get("/", getPosts);

/**
 * @route   GET /api/posts/my
 * @desc    Get authenticated user's posts (draft + published)
 * @note    Must be defined BEFORE /:id to avoid conflict
 */
router.get("/my", protect, getMyPosts);

/**
 * @route   GET /api/posts/:id
 * @desc    Get single post by ID
 */
router.get("/:id", getPostById);

/**
 * @route   POST /api/posts
 * @desc    Create new post
 */
router.post(
  "/",
  protect,
  authorizeRoles("admin", "author"),
  postRules,
  validate,
  createPost,
);

/**
 * @route   PUT /api/posts/:id
 * @desc    Update post
 */
router.put(
  "/:id",
  protect,
  authorizeRoles("admin", "author"),
  postRules,
  validate,
  createPost,
);

/**
 * @route   DELETE /api/posts/:id
 * @desc    Delete post
 */
router.delete("/:id", protect, authorizeRoles("admin", "author"), deletePost);

/**
 * @route   PATCH /api/posts/:id/status
 * @desc    Update post status (publish/unpublish)
 */
router.patch(
  "/:id/status",
  protect,
  authorizeRoles("admin", "author"),
  updatePostStatus,
);

/**
 * @route   GET /api/posts/:id/comments
 * @desc    Get all comments for a post
 * @access  Public
 */
router.get("/:id/comments", getComments);

/**
 * @route   POST /api/posts/:id/comments
 * @desc    Add a comment to a post
 * @access  Private (any authenticated user)
 */
router.post("/:id/comments", protect, commentRules, validate, addComment);

module.exports = router;
