import { STORAGE_KEYS } from "./constants";

/**
 * Token Manager Utility
 * Centralized management of JWT tokens in localStorage
 * Used by axios interceptors and auth context
 */
const tokenManager = {
  /**
   * Get access token from localStorage
   * @returns {string|null} - Access token or null
   */
  getAccessToken: () => localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),

  /**
   * Get refresh token from localStorage
   * @returns {string|null} - Refresh token or null
   */
  getRefreshToken: () => localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),

  /**
   * Get user object from localStorage
   * @returns {object|null} - Parsed user object or null
   */
  getUser: () => {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  },

  /**
   * Store both tokens and user in localStorage
   * Called after successful login or registration
   * @param {string} accessToken
   * @param {string} refreshToken
   * @param {object} user
   */
  setTokens: (accessToken, refreshToken, user) => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  /**
   * Update only the access token
   * Called after token refresh without full re-login
   * @param {string} accessToken
   */
  updateAccessToken: (accessToken) => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  },

  /**
   * Clear all auth data from localStorage
   * Called on logout
   */
  clearTokens: () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  /**
   * Check if user is currently authenticated
   * @returns {boolean}
   */
  isAuthenticated: () => !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
};

export default tokenManager;
