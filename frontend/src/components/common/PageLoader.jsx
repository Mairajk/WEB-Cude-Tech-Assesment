import Spinner from "./Spinner";

/**
 * PageLoader Component
 * Full page loading screen shown during initial auth check
 * Prevents flash of unauthenticated content on refresh
 */
const PageLoader = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <span className="text-4xl mb-4">📝</span>
      <Spinner size="lg" />
      <p className="text-sm text-gray-400 mt-4">Loading BlogMS...</p>
    </div>
  );
};

export default PageLoader;
