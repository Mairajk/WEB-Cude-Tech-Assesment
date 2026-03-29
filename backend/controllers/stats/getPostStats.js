const Post = require("../../models/Post");
const Comment = require("../../models/Comment");
const User = require("../../models/User");

/**
 * @route   GET /api/stats/posts
 * @desc    Get blog statistics using MongoDB aggregation pipeline
 * @access  Private (admin only)
 */
const getPostStats = async (req, res, next) => {
  try {
    /**
     * Run all aggregation queries in parallel for performance
     * Each query targets a specific metric
     */
    const [postStats, topAuthors, totalComments, totalUsers] =
      await Promise.all([
        /**
         * Aggregation pipeline to get post counts by status
         * Groups all posts and counts total, published, and draft
         */
        Post.aggregate([
          {
            $group: {
              _id: null,
              totalPosts: { $sum: 1 },
              publishedPosts: {
                $sum: { $cond: [{ $eq: ["$status", "published"] }, 1, 0] },
              },
              draftPosts: {
                $sum: { $cond: [{ $eq: ["$status", "draft"] }, 1, 0] },
              },
            },
          },
          {
            /** Remove the default _id field from response */
            $project: {
              _id: 0,
              totalPosts: 1,
              publishedPosts: 1,
              draftPosts: 1,
            },
          },
        ]),

        /**
         * Aggregation pipeline to find top authors by post count
         * Joins with User collection to get author details
         */
        Post.aggregate([
          {
            /** Group posts by author and count their posts */
            $group: {
              _id: "$author",
              postCount: { $sum: 1 },
              publishedCount: {
                $sum: { $cond: [{ $eq: ["$status", "published"] }, 1, 0] },
              },
            },
          },
          {
            /** Join with User collection to get name and email */
            $lookup: {
              from: "users",
              localField: "_id",
              foreignField: "_id",
              as: "authorDetails",
            },
          },
          {
            /** Flatten the authorDetails array to a single object */
            $unwind: "$authorDetails",
          },
          {
            /** Shape the output to only include needed fields */
            $project: {
              _id: 0,
              name: "$authorDetails.name",
              email: "$authorDetails.email",
              postCount: 1,
              publishedCount: 1,
            },
          },
          {
            /** Sort by post count descending to get top authors first */
            $sort: { postCount: -1 },
          },
          {
            /** Limit to top 5 authors */
            $limit: 5,
          },
        ]),

        /** Simple count queries for comments and users */
        Comment.countDocuments(),
        User.countDocuments(),
      ]);

    /**
     * postStats is an array with one element from aggregation
     * Use default values if no posts exist yet
     */
    const stats = postStats[0] || {
      totalPosts: 0,
      publishedPosts: 0,
      draftPosts: 0,
    };

    res.status(200).json({
      stats: {
        ...stats,
        totalComments,
        totalUsers,
      },
      topAuthors,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getPostStats;
