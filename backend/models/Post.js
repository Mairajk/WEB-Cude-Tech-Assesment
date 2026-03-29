const mongoose = require("mongoose");

/**
 * Post Schema
 * Defines the structure for blog post documents in MongoDB
 * Includes reference to User model for author relationship
 */
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters"],
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      minlength: [10, "Content must be at least 10 characters"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User" /** Reference to User model for population */,
      required: [true, "Author is required"],
    },
    status: {
      type: String,
      enum: {
        values: ["draft", "published"],
        message: "Status must be either draft or published",
      },
      default: "draft",
    },
    tags: {
      type: [String],
      validate: {
        validator: function (tags) {
          return tags.length <= 10; /** Max 10 tags per post */
        },
        message: "A post cannot have more than 10 tags",
      },
      set: function (tags) {
        /** Normalize tags: lowercase and trim whitespace */
        return tags.map((tag) => tag.toLowerCase().trim());
      },
    },
    slug: {
      type: String,
      unique: true /** URL-friendly version of the title */,
    },
    excerpt: {
      type: String,
      maxlength: [300, "Excerpt cannot exceed 300 characters"],
    },
  },
  {
    timestamps: true /** Automatically adds createdAt and updatedAt */,
  },
);

/**
 * MongoDB Text Index for full-text search functionality
 * Allows searching posts by title and tags efficiently
 * Title has higher weight (10) than tags (5) in search results
 */
postSchema.index(
  { title: "text", tags: "text" },
  { weights: { title: 10, tags: 5 } },
);

/**
 * Index on status and createdAt for faster filtered queries
 * Commonly used when fetching published posts sorted by date
 */
postSchema.index({ status: 1, createdAt: -1 });

/**
 * Index on author for faster author-specific post queries
 */
postSchema.index({ author: 1 });

/**
 * Pre-save middleware to auto-generate slug from title
 * and auto-generate excerpt from content if not provided
 */
postSchema.pre("save", function () {
  /** Generate slug only if title is modified */
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") /** Remove special characters */
      .replace(/\s+/g, "-") /** Replace spaces with hyphens */
      .replace(/-+/g, "-") /** Remove duplicate hyphens */
      .trim("-"); /** Remove leading/trailing hyphens */
  }

  /** Auto-generate excerpt from content if not provided */
  if (this.isModified("content") && !this.excerpt) {
    this.excerpt = this.content.substring(0, 297) + "...";
  }
});

module.exports = mongoose.model("Post", postSchema);
