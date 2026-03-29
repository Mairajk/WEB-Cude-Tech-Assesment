import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { PostProvider } from "./context/PostContext";
import AppRoutes from "./routes/AppRoutes";
import ErrorBoundary from "./components/common/ErrorBoundary";
import PageLoader from "./components/common/PageLoader";
import useAuth from "./hooks/useAuth";

/**
 * Inner app component
 * Needs to be separate so it can consume AuthContext
 * Shows PageLoader while auth state is being initialized
 */
const InnerApp = () => {
  const { loading } = useAuth();

  if (loading) return <PageLoader />;

  return <AppRoutes />;
};

/**
 * Root application component
 * Toaster must be at root level so toasts work everywhere
 * Top level ErrorBoundary catches any uncaught errors
 */
const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <PostProvider>
          <InnerApp />
          {/**
           * Toaster renders toast notifications globally
           * position top-right is standard UX convention
           * gutter controls spacing between stacked toasts
           */}
          <Toaster
            position="top-right"
            gutter={8}
            toastOptions={{
              /** Default duration for all toasts */
              duration: 4000,
              style: {
                fontSize: "14px",
                maxWidth: "400px",
                borderRadius: "10px",
                padding: "12px 16px",
              },
              success: {
                duration: 3000,
                style: {
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  color: "#15803d",
                },
                iconTheme: {
                  primary: "#16a34a",
                  secondary: "#f0fdf4",
                },
              },
              error: {
                duration: 5000,
                style: {
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  color: "#dc2626",
                },
                iconTheme: {
                  primary: "#dc2626",
                  secondary: "#fef2f2",
                },
              },
            }}
          />
        </PostProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
