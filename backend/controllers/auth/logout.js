const User = require("../../models/User");
const { createError } = require("../../middleware/error");

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user by invalidating their refresh token in DB
 * @access  Private
 */
const logout = async (req, res, next) => {
  try {
    /**
     * Nullify the refresh token in DB
     * This prevents the token from being reused
     * even if someone intercepts it
     */
    await User.findByIdAndUpdate(
      req.user.id,
      { refreshToken: null },
      { new: true },
    );

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = logout;
