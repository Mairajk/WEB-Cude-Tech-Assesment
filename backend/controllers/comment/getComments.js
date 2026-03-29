const Comment = require("../../models/Comment");
const Post = require("../../models/Post");
const { createError } = require("../../middleware/error");

/**
 * @route   GET /api/posts/:id/comments
 * @desc    Get all comments for a specific post
 * @access  Public
 */
const getComments = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(createError("Post not found", 404));
    }

    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    /**
     * Run both queries in parallel for better performance
     * - comments: paginated results with author details
     * - total: count for pagination metadata
     */
    const [comments, total] = await Promise.all([
      Comment.find({ post: req.params.id })
        .populate("author", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Comment.countDocuments({ post: req.params.id }),
    ]);

    res.status(200).json({
      comments,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalComments: total,
        hasNext: Number(page) < Math.ceil(total / Number(limit)),
        hasPrev: Number(page) > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getComments;
