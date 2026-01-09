import React from "react";
import { useLibrary } from "../hooks/useLibrary";
import {
  Book,
  Users,
  BookOpen,
  AlertTriangle,
  Calendar,
  TrendingUp,
} from "lucide-react";

const Dashboard = () => {
  const { books, members, transactions, getDashboardStats } = useLibrary();
  const stats = getDashboardStats();

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div
      className="bg-white rounded-lg shadow-md p-6 border-l-4"
      style={{ borderLeftColor: color }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className="text-sm text-green-600 mt-1">{trend}</p>
          )}
        </div>
        <div
          className="p-3 rounded-full"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="h-6 w-6" style={{ color }} />
        </div>
      </div>
    </div>
  );

  const getBookTitle = (bookId) => {
    return books.find((book) => book.id === bookId)?.title || "Unknown Book";
  };

  const getMemberName = (memberId) => {
    return (
      members.find((member) => member.id === memberId)?.name ||
      "Unknown Member"
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Books"
          value={stats.totalBooks}
          icon={Book}
          color="#3b82f6"
          trend="+2 this month"
        />
        <StatCard
          title="Total Members"
          value={stats.totalMembers}
          icon={Users}
          color="#10b981"
          trend="+5 this month"
        />
        <StatCard
          title="Issued Books"
          value={stats.issuedBooks}
          icon={BookOpen}
          color="#f59e0b"
        />
        <StatCard
          title="Overdue Books"
          value={stats.overdueBooks}
          icon={AlertTriangle}
          color="#ef4444"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Recent Transactions
            </h3>
          </div>

          <div className="space-y-4">
            {stats.recentTransactions.length > 0 ? (
              stats.recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {getBookTitle(transaction.bookId)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {getMemberName(transaction.memberId)}
                    </p>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.status === "issued"
                          ? "bg-blue-100 text-blue-800"
                          : transaction.status === "returned"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {transaction.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(transaction.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">
                No recent transactions
              </p>
            )}
          </div>
        </div>

        {/* Popular Books */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              Popular Books
            </h3>
          </div>

          <div className="space-y-4">
            {stats.popularBooks.length > 0 ? (
              stats.popularBooks.map((item, index) => (
                <div
                  key={item.bookId}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {getBookTitle(item.bookId)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {item.issueCount} issue
                        {item.issueCount !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">
                No data available
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors duration-200">
            <Book className="h-8 w-8 text-blue-600 mb-2" />
            <p className="font-medium text-gray-900">Add New Book</p>
            <p className="text-sm text-gray-600">
              Add books to the collection
            </p>
          </button>

          <button className="p-4 border border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors duration-200">
            <Users className="h-8 w-8 text-green-600 mb-2" />
            <p className="font-medium text-gray-900">Register Member</p>
            <p className="text-sm text-gray-600">
              Add new library members
            </p>
          </button>

          <button className="p-4 border border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors duration-200">
            <BookOpen className="h-8 w-8 text-orange-600 mb-2" />
            <p className="font-medium text-gray-900">Issue Book</p>
            <p className="text-sm text-gray-600">
              Issue books to members
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
