const Comment = require("../../models/Comment");
const Post = require("../../models/Post");
const { createError } = require("../../middleware/error");

/**
 * @route   POST /api/posts/:id/comments
 * @desc    Add a comment to a specific post
 * @access  Private (any authenticated user)
 */
const addComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(createError("Post not found", 404));
    }

    /**
     * Only allow comments on published posts
     * Draft posts are not publicly visible
     */
    if (post.status !== "published") {
      return next(createError("Cannot comment on unpublished posts", 403));
    }

    /**
     * Create comment with authenticated user as author
     * req.user is injected by protect middleware
     */
    const comment = await Comment.create({
      content: req.body.content,
      author: req.user.id,
      post: req.params.id,
    });

    /** Populate author details before sending response */
    await comment.populate("author", "name email");

    res.status(201).json({
      message: "Comment added successfully",
      comment,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = addComment;
