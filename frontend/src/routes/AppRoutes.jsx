import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ErrorBoundary from "../components/common/ErrorBoundary";
import ProtectedRoute from "../components/common/ProtectedRoute";
import NotFound from "../components/common/NotFound";

/** Public Pages */
import HomePage from "../pages/public/HomePage";
import BlogPage from "../pages/public/BlogPage";

/** Auth Pages */
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

/** Dashboard Pages */
import DashboardPage from "../pages/dashboard/DashboardPage";
import MyPostsPage from "../pages/dashboard/MyPostsPage";

/** Post Pages */
import CreatePostPage from "../pages/post/CreatePostPage";
import EditPostPage from "../pages/post/EditPostPage";
import PostDetailPage from "../pages/post/PostDetailPage";

/**
 * AppRoutes Component
 * Central routing configuration for the entire app
 * Each route is wrapped in an ErrorBoundary for isolated error handling
 */
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/** Public Routes */}
        <Route
          path="/"
          element={
            <ErrorBoundary>
              <HomePage />
            </ErrorBoundary>
          }
        />
        <Route
          path="/blog"
          element={
            <ErrorBoundary>
              <BlogPage />
            </ErrorBoundary>
          }
        />
        <Route
          path="/blog/:id"
          element={
            <ErrorBoundary>
              <PostDetailPage />
            </ErrorBoundary>
          }
        />

        {/** Auth Routes */}
        <Route
          path="/login"
          element={
            <ErrorBoundary>
              <LoginPage />
            </ErrorBoundary>
          }
        />
        <Route
          path="/register"
          element={
            <ErrorBoundary>
              <RegisterPage />
            </ErrorBoundary>
          }
        />

        {/** Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ErrorBoundary>
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            </ErrorBoundary>
          }
        />
        <Route
          path="/dashboard/posts"
          element={
            <ErrorBoundary>
              <ProtectedRoute>
                <MyPostsPage />
              </ProtectedRoute>
            </ErrorBoundary>
          }
        />
        <Route
          path="/dashboard/create-post"
          element={
            <ErrorBoundary>
              <ProtectedRoute>
                <CreatePostPage />
              </ProtectedRoute>
            </ErrorBoundary>
          }
        />
        <Route
          path="/dashboard/edit-post/:id"
          element={
            <ErrorBoundary>
              <ProtectedRoute>
                <EditPostPage />
              </ProtectedRoute>
            </ErrorBoundary>
          }
        />

        {/** 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
