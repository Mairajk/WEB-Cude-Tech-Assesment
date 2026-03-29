import { useState, useCallback } from "react";

/**
 * Generic API hook for handling any API call
 * Manages loading, error and data states automatically
 * Used for one-off API calls that don't need global state
 * @returns {object} - { data, loading, error, execute, reset }
 */
const useApi = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Execute any async API function
   * @param {Function} apiFunc - Async function to call
   * @param {...any} args - Arguments to pass to the function
   * @returns {object} - { success, data, message }
   */
  const execute = useCallback(async (apiFunc, ...args) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFunc(...args);
      setData(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Reset state back to initial values
   * Useful when navigating away or unmounting
   */
  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  return { data, loading, error, execute, reset };
};

export default useApi;
