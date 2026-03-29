const Post = require("../../models/Post");
const { createError } = require("../../middleware/error");

/**
 * @route   POST /api/posts
 * @desc    Create a new blog post
 * @access  Private (admin, author)
 */
const createPost = async (req, res, next) => {
  try {
    const { title, content, tags, status, excerpt } = req.body;

    /**
     * Attach authenticated user as author
     * req.user is injected by protect middleware
     */
    const post = await Post.create({
      title,
      content,
      tags,
      status,
      excerpt,
      author: req.user.id,
    });

    /** Populate author details before sending response */
    await post.populate("author", "name email");

    res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = createPost;
