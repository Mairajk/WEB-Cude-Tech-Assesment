import { Link } from "react-router-dom";
import Button from "./Button";

/**
 * NotFound Component
 * Displayed for any unknown routes via AppRoutes fallback
 */
const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <span className="text-8xl font-bold text-gray-200 block mb-2">404</span>
        <span className="text-4xl block mb-4">🔍</span>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Page Not Found
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Link to="/">
            <Button variant="primary">Go Home</Button>
          </Link>
          <Link to="/blog">
            <Button variant="secondary">Browse Blog</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
