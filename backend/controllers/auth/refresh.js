const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../utils/generateTokens");
const { createError } = require("../../middleware/error");

/**
 * @route   POST /api/auth/refresh
 * @desc    Issue new access token using a valid refresh token
 * @access  Public
 */
const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return next(createError("Refresh token is required", 400));
    }

    /**
     * Verify refresh token signature using its own secret
     * Separate secret from access token for added security
     */
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    /**
     * Find user and verify stored refresh token matches
     * This lets us invalidate tokens on logout
     */
    const user = await User.findById(decoded.id).select("+refreshToken");

    if (!user || user.refreshToken !== refreshToken) {
      return next(createError("Invalid refresh token", 401));
    }

    /** Generate rotated token pair */
    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    /** Save rotated refresh token to DB */
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(
        createError("Refresh token expired. Please login again.", 401),
      );
    }
    next(error);
  }
};

module.exports = refresh;
