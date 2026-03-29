import { Link } from "react-router-dom";

/**
 * Footer Component
 * Simple footer with links and copyright
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/** Brand */}
          <Link to="/" className="text-lg font-bold text-blue-600">
            📝 BlogMS
          </Link>

          {/** Links */}
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/blog"
              className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
            >
              Blog
            </Link>
            <Link
              to="/login"
              className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
            >
              Login
            </Link>
          </div>

          {/** Copyright */}
          <p className="text-sm text-gray-400">
            © {currentYear} BlogMS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
