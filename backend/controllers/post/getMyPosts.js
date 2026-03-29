const Post = require("../../models/Post");

/**
 * @route   GET /api/posts/my
 * @desc    Get all posts by the authenticated author (draft + published)
 * @access  Private (author, admin)
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
     * Filter by authenticated user's ID
     * Admins see all their posts, authors see only their own
     */
    const filter = { author: req.user.id };

    /**
     * Optionally filter by status
     * If not provided, returns both draft and published
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
