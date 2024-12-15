import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import {
  MdDashboard,
  MdGroup,
  MdColorLens,
  MdRoute,
  MdInventory,
  MdAssessment,
  MdShoppingCart,
  MdAdminPanelSettings,
  MdClose,
  MdLogout,
} from "react-icons/md";

const menuItems = [
  { path: "/dashboard", name: "Dashboard", icon: MdDashboard },
  { path: "/party", name: "Party", icon: MdGroup },
  { path: "/color", name: "Color", icon: MdColorLens },
  { path: "/route", name: "Route", icon: MdRoute },
  { path: "/inventory", name: "Inventory", icon: MdInventory },
  { path: "/report", name: "Report", icon: MdAssessment },
  { path: "/orders", name: "Orders", icon: MdShoppingCart },
  { path: "/subadmin", name: "Sub Admin", icon: MdAdminPanelSettings },
];

const Sidebar = ({ setIsSidebarOpen, isMobile, onLogout }) => {
  return (
    <div className="h-screen w-64 bg-gray-800 text-white flex flex-col">
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700">
        <span className="text-xl font-semibold">Admin Panel</span>
        {isMobile && (
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-full hover:bg-gray-700 focus:outline-none"
          >
            <MdClose className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="mt-6 flex-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 hover:bg-gray-700 transition-colors duration-200 ${
                isActive ? "bg-gray-700 border-l-4 border-blue-500" : ""
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Info and Logout */}
      <div className="border-t border-gray-700">
        <div className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gray-600"></div>
            <div>
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-gray-400">admin@example.com</p>
            </div>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center px-6 py-3 text-red-400 hover:bg-gray-700 transition-colors duration-200"
        >
          <MdLogout className="w-5 h-5 mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  setIsSidebarOpen: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default Sidebar;
