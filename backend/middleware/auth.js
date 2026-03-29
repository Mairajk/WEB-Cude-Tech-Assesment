const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Middleware to protect routes by verifying JWT access token
 * Extracts token from Authorization header (Bearer scheme)
 * Attaches the authenticated user object to req.user
 */
const protect = async (req, res, next) => {
  try {
    /** Extract token from Authorization header */
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access denied. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];

    /**
     * Verify the token using JWT_SECRET
     * Throws error if token is expired or tampered with
     */
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    /**
     * Fetch user from DB to ensure they still exist
     * Excludes password and refreshToken from the result
     */
    const user = await User.findById(decoded.id).select(
      "-password -refreshToken",
    );

    if (!user) {
      return res.status(401).json({
        message: "User no longer exists.",
      });
    }

    /** Attach user to request for use in downstream controllers */
    req.user = user;
    next();
  } catch (error) {
    /** Handle specific JWT errors with clear messages */
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired. Please refresh your token.",
      });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid token.",
      });
    }

    return res.status(500).json({
      message: "Authentication error.",
    });
  }
};

/**
 * Middleware factory for role-based authorization
 * Accepts multiple roles and checks if authenticated user has one of them
 * Must be used AFTER the protect middleware
 * @param {...string} roles - Allowed roles (e.g., 'admin', 'author')
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role: ${roles.join(" or ")}`,
      });
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };
