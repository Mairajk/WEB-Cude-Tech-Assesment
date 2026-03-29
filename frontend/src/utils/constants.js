/**
 * Base API URL
 * Points to our Express backend
 */
export const API_BASE_URL = "http://localhost:5000/api";

/**
 * Local storage keys
 * Centralized to avoid typos across the app
 */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "blog_access_token",
  REFRESH_TOKEN: "blog_refresh_token",
  USER: "blog_user",
};

/**
 * User roles
 */
export const ROLES = {
  ADMIN: "admin",
  AUTHOR: "author",
};

/**
 * Post statuses
 */
export const POST_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
};

/**
 * Pagination defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
};
