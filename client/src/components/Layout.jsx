import React, { useState } from "react";
import { Menu, X, Library, Book, Users, BarChart3, BookOpen } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearAuth } from "../services/slices/AuthSlice";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const navigation = [
    { name: "Dashboard", to: "/dashboard", icon: BarChart3 },
    { name: "Books", to: "/books", icon: Book },
    { name: "Members", to: "/members", icon: Users },
    { name: "Transactions", to: "/transactions", icon: BookOpen },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem("isAuthenticated");
    dispatch(clearAuth());
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 bg-blue-600 text-white">
          <div className="flex items-center space-x-2">
            <Library className="h-8 w-8" />
            <span className="font-bold text-xl">LibraryMS</span>
          </div>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-8 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `w-full flex items-center px-6 py-3 transition-colors duration-200 ${
                    isActive
                      ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.name}
              </NavLink>
            );
          })}

          {/* Logout */}
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-6 py-3 text-left text-red-600 hover:bg-red-50"
            >
              <Users className="h-5 w-5 mr-3" />
              Sign Out
            </button>
          )}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 lg:px-8">
            <button
              className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
