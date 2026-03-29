import { NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

/**
 * Sidebar Component
 * Dashboard navigation sidebar
 * Shows different links based on user role
 */
const Sidebar = () => {
  const { user } = useAuth();

  /**
   * Sidebar links
   */
  const links = [
    { to: "/dashboard", label: "Overview", icon: "📊", end: true },
    {
      to: "/dashboard/posts",
      label: user?.role === "admin" ? "All Posts" : "My Posts",
      icon: "📝",
    },
    { to: "/dashboard/create-post", label: "New Post", icon: "✏️" },
  ];

  return (
    <aside className="w-64 min-h-screen bg-gray-50 border-r border-gray-200 flex flex-col">
      {/** User info section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-600 font-bold text-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full capitalize">
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/** Navigation Links */}
      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ to, label, icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-200"
              }`
            }
          >
            <span>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/** Bottom section */}
      <div className="p-4 border-t border-gray-200">
        <NavLink
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <span>🌐</span>
          View Blog
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
