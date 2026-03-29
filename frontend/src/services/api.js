import axios from "axios";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../utils/constants";
import tokenManager from "../utils/tokenManager";

/**
 * Base Axios instance
 * All API calls go through this instance
 * Automatically attaches auth token to every request
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor
 * Automatically attaches access token to every outgoing request
 * No need to manually add Authorization header in each service
 */
api.interceptors.request.use(
  (config) => {
    const token = tokenManager.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * Extracts a safe user facing error message
 * Backend already sanitizes all messages before sending
 * We only handle network level failures here where
 * there is no response from the server at all
 * @param {Error} error - Axios error object
 * @returns {string} - Safe message to display
 */
const getErrorMessage = (error) => {
  /** No response at all means network or server down */
  if (!error.response) {
    return "Network error. Please check your connection.";
  }

  /** Backend message is already sanitized and safe to show */
  return error.response?.data?.message || "Something went wrong.";
};

/**
 * Determines if an error toast should be suppressed
 * Some errors are handled silently by specific components
 * e.g. 401 on auth check during app init should not show a toast
 * @param {object} error - Axios error object
 * @returns {boolean}
 */
const shouldSuppressToast = (error) => {
  const url = error.config?.url || "";
  const status = error.response?.status;

  /**
   * Suppress toast for:
   * - Auth token refresh failures (handled by redirect)
   * - getMe calls on app init (handled silently)
   * - 401 on refresh endpoint (user just needs to login)
   */
  const silentUrls = ["/auth/refresh", "/auth/me"];
  const isSilentUrl = silentUrls.some((u) => url.includes(u));

  return isSilentUrl && status === 401;
};

/** Queue for requests that failed while token was refreshing */
let isRefreshing = false;
let failedQueue = [];

/**
 * Process queued requests after token refresh completes
 * @param {Error|null} error
 * @param {string|null} token
 */
const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Response interceptor
 * SUCCESS: passes response through untouched
 * ERROR: centrally handles all API errors in one place
 * - Shows toast notifications for all errors
 * - Attempts token refresh on 401
 * - Redirects to login if refresh fails
 * This means NO error handling needed in individual services
 */
api.interceptors.response.use(
  (response) => {
    /**
     * Optionally show success toasts for mutations
     * Only show if backend sends a message and it's a mutating request
     */
    const method = response.config?.method?.toLowerCase();
    const mutatingMethods = ["post", "put", "patch", "delete"];
    const isMutation = mutatingMethods.includes(method);

    /**
     * Suppress success toast for auth endpoints
     * Login/register/logout have their own UX flow
     */
    const url = response.config?.url || "";
    const silentUrls = [
      "/auth/login",
      "/auth/register",
      "/auth/logout",
      "/auth/refresh",
      "/auth/me",
    ];
    const isSilentUrl = silentUrls.some((u) => url.includes(u));

    if (isMutation && !isSilentUrl && response.data?.message) {
      toast.success(response.data.message);
    }

    return response;
  },

  async (error) => {
    const originalRequest = error.config;

    /**
     * Handle 401 Unauthorized
     * Attempt token refresh before giving up
     */
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        /**
         * If refresh already in progress queue this request
         * It will be retried once refresh completes
         */
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = tokenManager.getRefreshToken();

        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        tokenManager.updateAccessToken(accessToken);
        tokenManager.setTokens(
          accessToken,
          newRefreshToken,
          tokenManager.getUser(),
        );

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        processQueue(null, accessToken);
        return api(originalRequest);
      } catch (refreshError) {
        /**
         * Refresh failed — clear everything and redirect
         * Show toast only if user was actively using the app
         * not during silent background refresh
         */
        processQueue(refreshError, null);
        tokenManager.clearTokens();
        toast.error("Session expired. Please login again.");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    /**
     * For all other errors show a toast notification
     * unless explicitly suppressed for specific endpoints
     */
    if (!shouldSuppressToast(error)) {
      const message = getErrorMessage(error);
      toast.error(message);
    }

    return Promise.reject(error);
  },
);

export default api;
