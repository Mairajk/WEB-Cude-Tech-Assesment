const User = require("../../models/User");

/**
 * @route   GET /api/auth/me
 * @desc    Return currently authenticated user's profile
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    /**
     * req.user.id is attached by protect middleware
     * Re-fetch from DB to ensure latest data is returned
     */
    const user = await User.findById(req.user.id);

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getMe;
