import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Button from "../common/Button";

/**
 * Navbar Component
 * Uses NavLink instead of Link for active route highlighting
 * NavLink automatically applies active styles when route matches
 */
const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  /**
   * Reusable NavLink class generator
   * Returns active styles when route matches
   * Returns default styles otherwise
   * @param {boolean} isActive - Injected by NavLink automatically
   */
  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors pb-0.5 ${
      isActive
        ? "text-blue-600 border-b-2 border-blue-600"
        : "text-gray-600 hover:text-blue-600 border-b-2 border-transparent"
    }`;

  /**
   * Mobile NavLink class generator
   * Different styling for mobile menu items
   */
  const mobileNavLinkClass = ({ isActive }) =>
    `block px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
      isActive ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
    }`;

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    navigate("/");
    setLoggingOut(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/** Brand Logo */}
          <Link
            to="/"
            className="text-xl font-bold text-blue-600 tracking-tight"
          >
            📝 BlogMS
          </Link>

          {/** Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/blog" className={navLinkClass}>
              Blog
            </NavLink>

            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" end className={navLinkClass}>
                  Dashboard
                </NavLink>

                <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
                  {/** User avatar and name */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-700">
                        {user?.name}
                      </span>
                      <span className="text-xs text-gray-400 capitalize">
                        {user?.role}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="danger"
                    size="sm"
                    loading={loggingOut}
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/** Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/** Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 space-y-1">
            <NavLink
              to="/"
              end
              onClick={() => setMenuOpen(false)}
              className={mobileNavLinkClass}
            >
              Home
            </NavLink>
            <NavLink
              to="/blog"
              onClick={() => setMenuOpen(false)}
              className={mobileNavLinkClass}
            >
              Blog
            </NavLink>

            {isAuthenticated ? (
              <>
                <NavLink
                  to="/dashboard"
                  end
                  onClick={() => setMenuOpen(false)}
                  className={mobileNavLinkClass}
                >
                  Dashboard
                </NavLink>

                <div className="px-3 pt-2 border-t border-gray-100">
                  <Button
                    variant="danger"
                    size="sm"
                    loading={loggingOut}
                    onClick={handleLogout}
                    className="w-full"
                  >
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-2 px-3 pt-2 border-t border-gray-100">
                <Link to="/login" onClick={() => setMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
