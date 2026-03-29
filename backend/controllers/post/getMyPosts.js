const Post = require("../../models/Post");

/**
 * @route   GET /api/posts/my
 * @desc    Get posts based on role
 *          Admin sees ALL posts from every author
 *          Author sees only their own posts
 * @access  Private (admin, author)
 */
const getMyPosts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    /**
     * Admins see all posts from all authors
     * Authors only see their own posts
     * This is the core role-based filter
     */
    const filter =
      req.user.role === "admin"
        ? {} /** No filter for admin — sees everything */
        : { author: req.user.id }; /** Authors see only their own */

    /**
     * Optionally filter by status
     * Works for both admin and author
     */
    if (status && ["draft", "published"].includes(status)) {
      filter.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sortOrder = order === "asc" ? 1 : -1;

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .populate("author", "name email")
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Post.countDocuments(filter),
    ]);

    res.status(200).json({
      posts,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalPosts: total,
        hasNext: Number(page) < Math.ceil(total / Number(limit)),
        hasPrev: Number(page) > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getMyPosts;
