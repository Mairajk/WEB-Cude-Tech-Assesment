const User = require("../../models/User");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../utils/generateTokens");
const { createError } = require("../../middleware/error");

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user account
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    /** Check if user already exists with this email */
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(createError("Email already registered", 400));
    }

    /**
     * Create new user
     * Password hashing is handled automatically by
     * the pre-save middleware in User model
     */
    const user = await User.create({ name, email, password, role });

    /** Generate both tokens for immediate login after registration */
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    /** Store refresh token in DB for validation during refresh requests */
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.status(201).json({
      message: "Registration successful",
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

module.exports = register;
