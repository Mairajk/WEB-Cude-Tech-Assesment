const Post = require("../../models/Post");
const Comment = require("../../models/Comment");
const { createError } = require("../../middleware/error");

/**
 * @route   DELETE /api/posts/:id
 * @desc    Delete a post and all its associated comments
 * @access  Private (owner or admin only)
 */
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(createError("Post not found", 404));
    }

    /**
     * Authorization check
     * Only the post owner or an admin can delete the post
     */
    const isOwner = post.author.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return next(createError("Not authorized to delete this post", 403));
    }

    /**
     * Delete post and all associated comments in parallel
     * Keeps DB clean by removing orphaned comments
     */
    await Promise.all([
      Post.findByIdAndDelete(req.params.id),
      Comment.deleteMany({ post: req.params.id }),
    ]);

    res.status(200).json({
      message: "Post and associated comments deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = deletePost;
