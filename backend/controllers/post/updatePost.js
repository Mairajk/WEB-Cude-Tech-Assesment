const Post = require("../../models/Post");
const { createError } = require("../../middleware/error");

/**
 * @route   PUT /api/posts/:id
 * @desc    Update a post by ID
 * @access  Private (owner or admin only)
 */
const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(createError("Post not found", 404));
    }

    /**
     * Authorization check
     * Only the post owner or an admin can update the post
     */
    const isOwner = post.author.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return next(createError("Not authorized to update this post", 403));
    }

    const { title, content, tags, excerpt } = req.body;

    /**
     * Update only the fields that were provided
     * Spread existing values and override with new ones
     */
    if (title) post.title = title;
    if (content) post.content = content;
    if (tags) post.tags = tags;
    if (excerpt) post.excerpt = excerpt;

    /**
     * Save triggers pre-save middleware
     * Automatically regenerates slug if title changed
     */
    await post.save();
    await post.populate("author", "name email");

    res.status(200).json({
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = updatePost;
