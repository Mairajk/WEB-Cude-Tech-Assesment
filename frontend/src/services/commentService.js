import api from "./api";

/**
 * Comment Service
 * Handles all comment related API calls
 */
const commentService = {
  /**
   * Get all comments for a specific post
   * @param {string} postId - Post ID
   * @param {object} params - { page, limit }
   * @returns {Promise} - { comments, pagination }
   */
  getComments: (postId, params = {}) =>
    api.get(`/posts/${postId}/comments`, { params }),

  /**
   * Add a comment to a post
   * @param {string} postId - Post ID
   * @param {object} commentData - { content }
   * @returns {Promise} - { message, comment }
   */
  addComment: (postId, commentData) =>
    api.post(`/posts/${postId}/comments`, commentData),
};

export default commentService;
