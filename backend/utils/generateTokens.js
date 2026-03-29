const jwt = require("jsonwebtoken");

/**
 * Generates a short-lived access token for API authentication
 * Access tokens expire quickly for security reasons
 * @param {string} userId - The MongoDB user ID to encode in the token
 * @returns {string} - Signed JWT access token
 */
const generateAccessToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "60m" } /** Short-lived for security */,
  );
};

/**
 * Generates a long-lived refresh token used to get new access tokens
 * Stored in DB to allow invalidation (logout)
 * @param {string} userId - The MongoDB user ID to encode in the token
 * @returns {string} - Signed JWT refresh token
 */
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" } /** Long-lived, stored in DB */,
  );
};

module.exports = { generateAccessToken, generateRefreshToken };
