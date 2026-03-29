import Navbar from "./Navbar";
import Footer from "./Footer";

/**
 * PublicLayout Component
 * Wraps all public facing pages
 * Includes Navbar and Footer with main content in between
 * @param {ReactNode} children - Page content
 */
const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
