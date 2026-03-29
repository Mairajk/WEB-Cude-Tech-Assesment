import { createContext, useState, useCallback } from "react";
import postService from "../services/postService";

/**
 * Post Context
 * Provides global post state and CRUD methods
 * Shared across dashboard, blog and post detail pages
 */
export const PostContext = createContext(null);

/**
 * Post Provider Component
 * Manages post list state, pagination and loading states
 */
export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all published posts with optional filters
   * @param {object} params - { search, tags, page, limit, sortBy, order }
   */
  const fetchPosts = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await postService.getPosts(params);
      setPosts(response.data.posts);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch authenticated user's posts
   * @param {object} params - { page, limit, status }
   */
  const fetchMyPosts = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await postService.getMyPosts(params);
      setMyPosts(response.data.posts);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch your posts");
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new post
   * Uses optimistic update — adds temp post immediately
   * then replaces with real data from API
   * @param {object} postData - { title, content, tags, status }
   */
  const createPost = useCallback(async (postData) => {
    /** Optimistic update with temporary ID */
    const tempPost = { ...postData, _id: "temp-id", isOptimistic: true };
    setMyPosts((prev) => [tempPost, ...prev]);

    try {
      const response = await postService.createPost(postData);
      const newPost = response.data.post;

      /** Replace temp post with real post from API */
      setMyPosts((prev) =>
        prev.map((post) => (post._id === "temp-id" ? newPost : post)),
      );
      return { success: true, post: newPost };
    } catch (err) {
      /** Revert optimistic update on failure */
      setMyPosts((prev) => prev.filter((post) => post._id !== "temp-id"));
      const message = err.response?.data?.message || "Failed to create post";
      setError(message);
      return { success: false, message };
    }
  }, []);

  /**
   * Update an existing post
   * Uses optimistic update for instant UI feedback
   * @param {string} id - Post ID
   * @param {object} postData - Updated fields
   */
  const updatePost = useCallback(
    async (id, postData) => {
      /** Store original post for rollback */
      const originalPosts = myPosts;

      /** Optimistically update local state */
      setMyPosts((prev) =>
        prev.map((post) => (post._id === id ? { ...post, ...postData } : post)),
      );

      try {
        const response = await postService.updatePost(id, postData);
        const updatedPost = response.data.post;

        /** Replace with actual server response */
        setMyPosts((prev) =>
          prev.map((post) => (post._id === id ? updatedPost : post)),
        );
        return { success: true, post: updatedPost };
      } catch (err) {
        /** Rollback to original state on failure */
        setMyPosts(originalPosts);
        const message = err.response?.data?.message || "Failed to update post";
        setError(message);
        return { success: false, message };
      }
    },
    [myPosts],
  );

  /**
   * Delete a post by ID
   * Uses optimistic update — removes from UI immediately
   * @param {string} id - Post ID to delete
   */
  const deletePost = useCallback(
    async (id) => {
      /** Store original for rollback */
      const originalPosts = myPosts;

      /** Optimistically remove from list */
      setMyPosts((prev) => prev.filter((post) => post._id !== id));

      try {
        await postService.deletePost(id);
        return { success: true };
      } catch (err) {
        /** Rollback on failure */
        setMyPosts(originalPosts);
        const message = err.response?.data?.message || "Failed to delete post";
        setError(message);
        return { success: false, message };
      }
    },
    [myPosts],
  );

  /**
   * Update post status (draft/published)
   * Refetches current filtered list after update
   * This ensures filtered views stay accurate
   * e.g. if on "published" filter and user unpublishes
   * the post correctly disappears from the list
   * @param {string} id - Post ID
   * @param {string} status - New status
   * @param {object} currentParams - Current filter params to refetch with
   */
  const updatePostStatus = useCallback(
    async (id, status, currentParams = {}) => {
      try {
        await postService.updatePostStatus(id, status);

        /**
         * Refetch list with current filter params
         * Keeps filtered views accurate after status change
         */
        await fetchMyPosts(currentParams);
        return { success: true };
      } catch (err) {
        const message =
          err.response?.data?.message || "Failed to update status";
        setError(message);
        return { success: false, message };
      }
    },
    [fetchMyPosts],
  );

  /** Clear post errors */
  const clearError = useCallback(() => setError(null), []);

  const value = {
    posts,
    myPosts,
    pagination,
    loading,
    error,
    fetchPosts,
    fetchMyPosts,
    createPost,
    updatePost,
    deletePost,
    updatePostStatus,
    clearError,
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};
