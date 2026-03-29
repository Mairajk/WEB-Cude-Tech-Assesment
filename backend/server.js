const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/error");
const { generalLimiter, authLimiter } = require("./middleware/rateLimiter");

/** Import routes. */
const routes = require("./routes/index");

(async () => {
  /**
   * Load environment variables
   * Must be first before anything else
   */
  dotenv.config();

  /**
   * Establish MongoDB Atlas connection
   */
  await connectDB();

  const app = express();

  /**
   * Whitelist of allowed origins
   * Filter removes any undefined values
   * in case env variables are not set
   */
  const allowedOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_URL,
  ].filter(Boolean); /** Removes undefined/null/empty values */

  /**
   * Core middleware
   * - cors: cross-origin requests from frontend
   * - express.json: parse JSON bodies
   * - express.urlencoded: parse form data
   */
  app.use(
    cors({
      origin: (origin, callback) => {
        /**
         * Allow requests with no origin
         * This covers server-to-server calls, Postman, mobile apps
         * where origin header is not sent
         */
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`CORS blocked: ${origin} is not allowed`));
        }
      },
      credentials: true,
    }),
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  /**
   * Apply general rate limiter to all API routes
   * Stricter auth limiter applied specifically to auth routes
   */
  app.use("/api", generalLimiter);
  app.use("/api/auth", authLimiter);

  /**
   * Health check — server status only
   */
  app.get("/api/health", (req, res) => {
    res.status(200).json({ message: "Server is running ✅" });
  });

  /**
   * All API routes mounted under /api
   * Managed centrally in routes/index.js
   */
  app.use("/api", routes);

  /**
   * 404 handler for unmatched routes
   */
  app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
  });

  /**
   * Global error handler
   * Must always be the last middleware
   */
  app.use(errorHandler);

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})();
