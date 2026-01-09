import React, { useState } from "react";
import { Menu, X, Library, Book, Users, BarChart3, BookOpen } from "lucide-react";

const Layout = ({ children, currentPage, onPageChange }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", id: "dashboard", icon: BarChart3 },
    { name: "Books", id: "books", icon: Book },
    { name: "Members", id: "members", icon: Users },
    { name: "Transactions", id: "transactions", icon: BookOpen },
  ];

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={closeSidebar}
          />
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 bg-blue-600 text-white">
          <div className="flex items-center space-x-2">
            <Library className="h-8 w-8" />
            <span className="font-bold text-xl">LibraryMS</span>
          </div>
          <button className="lg:hidden" onClick={closeSidebar}>
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-8">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id);
                  closeSidebar();
                }}
                className={`w-full flex items-center px-6 py-3 text-left transition-colors duration-200 ${
                  currentPage === item.id
                    ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:pl-0">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                className="lg:hidden mr-4 p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-semibold text-gray-900 capitalize">
                {currentPage}
              </h1>
            </div>
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

        <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
