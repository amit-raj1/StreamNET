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
      <div className="flex">
        {showSidebar && (
          <div
            className={`fixed z-50 h-full transition-transform duration-300 ease-in-out ${
              sidebarVisible ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <Sidebar toggleSidebar={toggleSidebar} sidebarVisible={sidebarVisible} />
          </div>
        )}

        <div
          className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
            showSidebar && sidebarVisible ? "ml-64" : "ml-0"
          }`}
        >
          <div className="flex items-center w-full">
            <div className={`w-full`}>
              <Navbar />
            </div>
          </div>

          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </div>
  );
};
export default Layout;
