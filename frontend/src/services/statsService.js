import api from "./api";

/**
 * Stats Service
 * Handles all statistics related API calls
 * Only accessible by admin users
 */
const statsService = {
  /**
   * Get blog statistics and top authors
   * @returns {Promise} - { stats, topAuthors }
   */
  getPostStats: () => api.get("/stats/posts"),
};

export default statsService;
