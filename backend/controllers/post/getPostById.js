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

    /**
     * If post is a draft, only allow owner or admin to view it
     * Public users cannot access unpublished posts
     */
    if (post.status === "draft") {
      /** Check if user is authenticated */
      if (!req.user) {
        return next(createError("Post not found", 404));
      }

      /** Check if user is the owner or an admin */
      const isOwner = post.author._id.toString() === req.user.id;
      const isAdmin = req.user.role === "admin";

      if (!isOwner && !isAdmin) {
        return next(createError("Post not found", 404));
      }
    }

    res.status(200).json({ post });
  } catch (error) {
    next(error);
  }
};

module.exports = getPostById;
