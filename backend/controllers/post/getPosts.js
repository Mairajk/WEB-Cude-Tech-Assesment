const Post = require("../../models/Post");

/**
 * @route   GET /api/posts
 * @desc    Get all published posts with search, filter and pagination
 * @access  Public
 */
const getPosts = async (req, res, next) => {
  try {
    const {
      search,
      tags,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    /**
     * Base filter — public route only shows published posts
     * Additional filters are added conditionally below
     */
    const filter = { status: "published" };

    /**
     * Full-text search on title and tags
     * Uses MongoDB text index defined in Post model
     * Only applied when search query is provided
     */
    if (search) {
      filter.$text = { $search: search };
    }

    /**
     * Filter by tags if provided
     * Accepts comma-separated tags e.g. ?tags=react,javascript
     * $in matches posts that have ANY of the provided tags
     */
    if (tags) {
      const tagArray = tags.split(",").map((tag) => tag.trim().toLowerCase());
      filter.tags = { $in: tagArray };
    }

    /** Calculate how many documents to skip for pagination */
    const skip = (Number(page) - 1) * Number(limit);

    /** Build sort object dynamically */
    const sortOrder = order === "asc" ? 1 : -1;
    const sort = { [sortBy]: sortOrder };

    /**
     * Run both queries in parallel for better performance
     * - posts: paginated and filtered results
     * - total: count for pagination metadata
     */
    const [posts, total] = await Promise.all([
      Post.find(filter)
        .populate("author", "name email")
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .lean() /** lean() returns plain JS objects, faster than Mongoose docs */,
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

module.exports = getPosts;
