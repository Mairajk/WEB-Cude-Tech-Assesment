import api from "./api";

/**
 * Auth Service
 * Handles all authentication related API calls
 * All methods return axios response objects
 */
const authService = {
  /**
   * Register a new user account
   * @param {object} userData - { name, email, password, role }
   * @returns {Promise} - { user, accessToken, refreshToken }
   */
  register: (userData) => api.post("/auth/register", userData),

  /**
   * Login with email and password
   * @param {object} credentials - { email, password }
   * @returns {Promise} - { user, accessToken, refreshToken }
   */
  login: (credentials) => api.post("/auth/login", credentials),

  /**
   * Logout current user
   * Invalidates refresh token on server
   * @returns {Promise}
   */
  logout: () => api.post("/auth/logout"),

  /**
   * Refresh access token using refresh token
   * @param {string} refreshToken
   * @returns {Promise} - { accessToken, refreshToken }
   */
  refreshToken: (refreshToken) => api.post("/auth/refresh", { refreshToken }),

  /**
   * Get currently authenticated user profile
   * @returns {Promise} - { user }
   */
  getMe: () => api.get("/auth/me"),
};

export default authService;
