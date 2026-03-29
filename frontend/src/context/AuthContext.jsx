import { createContext, useState, useEffect, useCallback } from "react";
import tokenManager from "../utils/tokenManager";
import authService from "../services/authService";
import toast from "react-hot-toast";

/**
 * Auth Context
 * Provides global authentication state and methods
 * to all components in the application tree
 */
export const AuthContext = createContext(null);

/**
 * Auth Provider Component
 * Wraps the entire app to provide auth state globally
 * Handles initial auth state from localStorage on app load
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Initialize auth state from localStorage on app mount
   * This keeps user logged in across page refreshes
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = tokenManager.getUser();
        const accessToken = tokenManager.getAccessToken();

        if (storedUser && accessToken) {
          /**
           * Verify token is still valid by fetching current user
           * If token expired, axios interceptor will auto-refresh
           */
          const response = await authService.getMe();
          setUser(response.data.user);
        }
      } catch (err) {
        /**
         * If verification fails clear everything
         * User will need to login again
         */
        tokenManager.clearTokens();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Register a new user account
   * Stores tokens and sets user state on success
   * @param {object} userData - { name, email, password, role }
   */
  const register = useCallback(async (userData) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authService.register(userData);
      const { user, accessToken, refreshToken } = response.data;
      tokenManager.setTokens(accessToken, refreshToken, user);
      setUser(user);
      toast.success("Welcome to BlogMS! 🎉");
      return { success: true };
    } catch (err) {
      /**
       * Toast already shown by interceptor
       * Just store message for inline form display
       */
      const message = err.response?.data?.message || "Registration failed";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Login existing user
   * Stores tokens and sets user state on success
   * @param {object} credentials - { email, password }
   */
  const login = useCallback(async (credentials) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authService.login(credentials);
      const { user, accessToken, refreshToken } = response.data;
      tokenManager.setTokens(accessToken, refreshToken, user);
      setUser(user);
      toast.success(`Welcome back, ${user.name}! 👋`);
      return { success: true };
    } catch (err) {
      /** Toast already shown by interceptor */
      const message = err.response?.data?.message || "Login failed";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Logout current user
   * Clears tokens from DB via API and clears local state
   */
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (err) {
      /**
       * Even if API call fails still clear local state
       * User should always be able to logout
       */
      console.error("Logout API error:", err);
    } finally {
      tokenManager.clearTokens();
      setUser(null);
    }
  }, []);

  /**
   * Clear any auth errors
   * Called when user starts typing after an error
   */
  const clearError = useCallback(() => setError(null), []);

  /**
   * Check if current user has a specific role
   * @param {string} role - Role to check against
   * @returns {boolean}
   */
  const hasRole = useCallback((role) => user?.role === role, [user]);

  /**
   * Check if current user is an admin
   * @returns {boolean}
   */
  const isAdmin = useCallback(() => user?.role === "admin", [user]);

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    clearError,
    hasRole,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
