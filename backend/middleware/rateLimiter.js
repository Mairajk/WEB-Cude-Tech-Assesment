const rateLimit = require("express-rate-limit");

/**
 * General rate limiter
 * Applied to all API routes
 * Prevents abuse and DoS attacks
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000 /** 15 minutes */,
  max: 100 /** Max 100 requests per window per IP */,
  message: {
    message: "Too many requests from this IP. Please try again later.",
  },
  standardHeaders: true /** Return rate limit info in headers */,
  legacyHeaders: false,
});

/**
 * Strict rate limiter for auth routes
 * Prevents brute force attacks on login/register
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000 /** 15 minutes */,
  max: 10 /** Max 10 auth attempts per window */,
  message: {
    message: "Too many auth attempts. Please try again in 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { generalLimiter, authLimiter };
