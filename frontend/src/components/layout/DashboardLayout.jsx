import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

/**
 * DashboardLayout Component
 * Wraps all authenticated dashboard pages
 * Includes Navbar at top and Sidebar on the left
 * @param {ReactNode} children - Dashboard page content
 */
const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-5xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
