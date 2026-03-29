const Post = require("../../models/Post");
const { createError } = require("../../middleware/error");

/**
 * @route   GET /api/posts/:id
 * @desc    Get a single post by ID
 * @access  Public (published) / Private (draft - owner or admin only)
 */
const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "name email")
      .lean();

    if (!post) {
      return next(createError("Post not found", 404));
    }

    res.status(200).json({ post });
  } catch (error) {
    next(error);
  }
};

module.exports = getPostById;
