const mongoose = require("mongoose");

/**
 * Comment Schema
 * Defines the structure for comment documents in MongoDB
 * Links to both User (author) and Post models
 */
const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Comment content is required"],
      trim: true,
      minlength: [2, "Comment must be at least 2 characters"],
      maxlength: [500, "Comment cannot exceed 500 characters"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User" /** Reference to User model */,
      required: [true, "Comment author is required"],
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post" /** Reference to Post model */,
      required: [true, "Post reference is required"],
    },
  },
  {
    timestamps: true /** Automatically adds createdAt and updatedAt */,
  },
);

/**
 * Index on post for faster comment lookup per post
 * Most common query is fetching all comments for a specific post
 */
commentSchema.index({ post: 1, createdAt: -1 });

module.exports = mongoose.model("Comment", commentSchema);
