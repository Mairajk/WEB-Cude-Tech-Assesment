import api from "./api";

/**
 * Post Service
 * Handles all blog post related API calls
 */
const postService = {
  /**
   * Get all published posts with optional filters
   * @param {object} params - { search, tags, page, limit, sortBy, order }
   * @returns {Promise} - { posts, pagination }
   */
  getPosts: (params = {}) => api.get("/posts", { params }),

  /**
   * Get authenticated user's posts (draft + published)
   * @param {object} params - { page, limit, status }
   * @returns {Promise} - { posts, pagination }
   */
  getMyPosts: (params = {}) => api.get("/posts/my", { params }),

  /**
   * Get a single post by ID
   * @param {string} id - Post ID
   * @returns {Promise} - { post }
   */
  getPostById: (id) => api.get(`/posts/${id}`),

  /**
   * Create a new post
   * @param {object} postData - { title, content, tags, status, excerpt }
   * @returns {Promise} - { message, post }
   */
  createPost: (postData) => api.post("/posts", postData),

  /**
   * Update an existing post
   * @param {string} id - Post ID
   * @param {object} postData - Fields to update
   * @returns {Promise} - { message, post }
   */
  updatePost: (id, postData) => api.put(`/posts/${id}`, postData),

  /**
   * Delete a post by ID
   * @param {string} id - Post ID
   * @returns {Promise} - { message }
   */
  deletePost: (id) => api.delete(`/posts/${id}`),

  /**
   * Update post status (draft/published)
   * @param {string} id - Post ID
   * @param {string} status - New status
   * @returns {Promise} - { message, post }
   */
  updatePostStatus: (id, status) =>
    api.patch(`/posts/${id}/status`, { status }),
};

export default postService;
