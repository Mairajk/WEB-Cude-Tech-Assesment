const User = require("../../models/User");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../utils/generateTokens");
const { createError } = require("../../middleware/error");

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and return tokens
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    /**
     * Find user by email
     * Explicitly select password and refreshToken
     * since both are excluded by default (select: false)
     */
    const user = await User.findOne({ email }).select(
      "+password +refreshToken",
    );

    if (!user) {
      return next(createError("Invalid email or password", 401));
    }

    /** Use instance method defined in User model to compare passwords */
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return next(createError("Invalid email or password", 401));
    }

    /** Generate fresh pair of tokens on every successful login */
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    /** Rotate refresh token in DB on each login */
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = login;
