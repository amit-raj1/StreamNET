import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, HomeIcon, ShipWheelIcon, UsersIcon, Book, ChevronLeft, ChevronRight, ShieldIcon, HeadphonesIcon, TicketIcon, HelpCircleIcon } from "lucide-react";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside className={`${isCollapsed ? 'w-16' : 'w-64'} bg-base-200 border-r border-base-300 flex flex-col h-screen sticky top-0 z-30 lg:static lg:z-auto transition-all duration-300 ease-in-out`}>
      {/* Header with toggle button */}
      <div className="p-5 border-b border-base-300 flex items-center justify-between">
        {!isCollapsed && (
          <Link to="/" className="flex items-center gap-2.5">
            <ShipWheelIcon className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              StreamNET
            </span>
          </Link>
        )}
        
        {isCollapsed && (
          <div className="flex justify-center w-full">
            <ShipWheelIcon className="size-9 text-primary" />
          </div>
        )}
        
        <button
          onClick={toggleSidebar}
          className="btn btn-ghost btn-sm p-1 hover:bg-base-300"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="size-5" />
          ) : (
            <ChevronLeft className="size-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {authUser?.isAdmin ? (
          /* Admin Navigation */
          <>
            <Link
              to="/admin"
              className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
                currentPath === "/admin" ? "btn-active" : ""
              } ${isCollapsed ? 'tooltip tooltip-right' : ''}`}
              data-tip={isCollapsed ? "Admin Dashboard" : ""}
            >
              <ShieldIcon className="size-5 text-base-content opacity-70 flex-shrink-0" />
              {!isCollapsed && <span>Admin Dashboard</span>}
            </Link>

            <Link
              to="/admin/tickets"
              className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
                currentPath === "/admin/tickets" ? "btn-active" : ""
              } ${isCollapsed ? 'tooltip tooltip-right' : ''}`}
              data-tip={isCollapsed ? "Ticket Management" : ""}
            >
              <TicketIcon className="size-5 text-base-content opacity-70 flex-shrink-0" />
              {!isCollapsed && <span>Ticket Management</span>}
            </Link>

            {/* Only show Create Admin for Master Admin */}
            {authUser?.isMasterAdmin && (
              <Link
                to="/admin/create"
                className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
                  currentPath === "/admin/create" ? "btn-active" : ""
                } ${isCollapsed ? 'tooltip tooltip-right' : ''}`}
                data-tip={isCollapsed ? "Create Admin" : ""}
              >
                <UsersIcon className="size-5 text-base-content opacity-70 flex-shrink-0" />
                {!isCollapsed && <span>Create Admin</span>}
              </Link>
            )}
          </>
        ) : (
          /* User Navigation */
          <>
            <Link
              to="/"
              className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
                currentPath === "/" || currentPath === "/home" ? "btn-active" : ""
              } ${isCollapsed ? 'tooltip tooltip-right' : ''}`}
              data-tip={isCollapsed ? "Home" : ""}
            >
              <HomeIcon className="size-5 text-base-content opacity-70 flex-shrink-0" />
              {!isCollapsed && <span>Home</span>}
            </Link>

            <Link
              to="/friends"
              className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
                currentPath === "/friends" ? "btn-active" : ""
              } ${isCollapsed ? 'tooltip tooltip-right' : ''}`}
              data-tip={isCollapsed ? "Friends" : ""}
            >
              <UsersIcon className="size-5 text-base-content opacity-70 flex-shrink-0" />
              {!isCollapsed && <span>Friends</span>}
            </Link>

            <Link
              to="/notifications"
              className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
                currentPath === "/notifications" ? "btn-active" : ""
              } ${isCollapsed ? 'tooltip tooltip-right' : ''}`}
              data-tip={isCollapsed ? "Notifications" : ""}
            >
              <BellIcon className="size-5 text-base-content opacity-70 flex-shrink-0" />
              {!isCollapsed && <span>Notifications</span>}
            </Link>

            <Link
              to="/support"
              className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
                currentPath === "/support" ? "btn-active" : ""
              } ${isCollapsed ? 'tooltip tooltip-right' : ''}`}
              data-tip={isCollapsed ? "Support & Tickets" : ""}
            >
              <HelpCircleIcon className="size-5 text-base-content opacity-70 flex-shrink-0" />
              {!isCollapsed && <span>Support & Tickets</span>}
            </Link>
          </>
        )}
      </nav>

      {/* USER PROFILE SECTION */}
      <div className="p-4 border-t border-base-300 mt-auto">
        {!isCollapsed ? (
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="w-10 rounded-full">
                <img src={authUser?.profilePic} alt="User Avatar" />
              </div>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{authUser?.fullName}</p>
              <p className="text-xs text-success flex items-center gap-1">
                <span className="size-2 rounded-full bg-success inline-block" />
                Online
              </p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center tooltip tooltip-right" data-tip={authUser?.fullName}>
            <div className="avatar">
              <div className="w-10 rounded-full">
                <img src={authUser?.profilePic} alt="User Avatar" />
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;