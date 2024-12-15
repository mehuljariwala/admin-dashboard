import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "./Sidebar";
import PropTypes from "prop-types";

const Layout = ({ onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Overlay for mobile */}
      <AnimatePresence mode="wait">
        {isMobile && isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-20"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {(isSidebarOpen || !isMobile) && (
          <motion.div
            initial={isMobile ? { x: -250 } : false}
            animate={{ x: 0 }}
            exit={isMobile ? { x: -250 } : false}
            transition={{ duration: 0.3 }}
            className={`${isMobile ? "fixed" : "relative"} z-30`}
          >
            <Sidebar
              setIsSidebarOpen={setIsSidebarOpen}
              isMobile={isMobile}
              onLogout={onLogout}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`flex-1 flex flex-col overflow-hidden `}>
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            {isMobile && (
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            )}
            <div
              className={`flex items-center space-x-4 ${
                isMobile ? "" : "ml-4"
              }`}
            >
              <span className="text-gray-700">Admin Panel</span>
              <div className="w-8 h-8 rounded-full bg-gray-200"></div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

Layout.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default Layout;
