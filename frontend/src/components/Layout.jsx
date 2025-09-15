import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useState } from "react";
import { useThemeStore } from "../store/useThemeStore";

const Layout = ({ children, showSidebar = false }) => {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const { theme } = useThemeStore();

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className="min-h-screen" data-theme={theme}>
      {/* Navbar takes full width at the top */}
      <div className="w-full">
        <Navbar />
      </div>

      {/* Content area below navbar */}
      <div className="flex h-[calc(100vh-4rem)]"> {/* 4rem = navbar height (h-16) */}
        {/* Sidebar */}
        {showSidebar && (
          <div className={`transition-all duration-300 ease-in-out ${
            sidebarVisible ? "w-64" : "w-16"
          }`}>
            <Sidebar toggleSidebar={toggleSidebar} sidebarVisible={sidebarVisible} />
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-base-100">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;