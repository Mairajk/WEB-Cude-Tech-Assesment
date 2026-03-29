import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Spinner from "./Spinner";

/**
 * ProtectedRoute Component (Higher Order Component pattern)
 * Guards routes that require authentication and/or specific roles
 * Redirects to login if not authenticated
 * Redirects to dashboard if authenticated but wrong role
 * @param {ReactNode} children - Component to render if authorized
 * @param {string} requiredRole - Optional role required to access route
 */
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();

  /**
   * Show spinner while auth state is being initialized
   * Prevents flash of redirect before auth check completes
   */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  /** Redirect to login if not authenticated */
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  /**
   * Redirect to dashboard if authenticated but doesn't have required role
   * e.g. author trying to access admin-only pages
   */
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
