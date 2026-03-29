const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/**
 * User Schema
 * Defines the structure for user documents in MongoDB
 * Includes automatic password hashing before saving
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false /** Never return password in queries by default */,
    },
    role: {
      type: String,
      enum: {
        values: ["admin", "author"],
        message: "Role must be either admin or author",
      },
      default: "author",
    },
    refreshToken: {
      type: String,
      select: false /** Never return refresh token in queries by default */,
    },
  },
  {
    timestamps: true /** Automatically adds createdAt and updatedAt fields */,
  },
);

/**
 * Pre-save middleware to hash password before storing
 * Only runs if the password field was modified to avoid
 * re-hashing an already hashed password on other updates
 * No next() needed — async functions auto-signal completion
 */
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  /** Generate salt with cost factor of 12 for strong hashing */
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Instance method to compare entered password with hashed password
 * Used during login to verify credentials
 * @param {string} enteredPassword - Plain text password from login form
 * @returns {boolean} - True if passwords match
 */
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
