const Post = require("../../models/Post");
const { createError } = require("../../middleware/error");

/**
 * @route   PATCH /api/posts/:id/status
 * @desc    Toggle post status between draft and published
 * @access  Private (owner or admin only)
 */
const updatePostStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    /** Validate status value explicitly */
    if (!status || !["draft", "published"].includes(status)) {
      return next(createError("Status must be either draft or published", 400));
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(createError("Post not found", 404));
    }

    /**
     * Authorization check
     * Only the post owner or an admin can change the status
     */
    const isOwner = post.author.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return next(
        createError("Not authorized to update this post status", 403),
      );
    }

    post.status = status;
    await post.save();

    res.status(200).json({
      message: `Post ${status === "published" ? "published" : "moved to draft"} successfully`,
      post: {
        id: post._id,
        title: post.title,
        status: post.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = updatePostStatus;
