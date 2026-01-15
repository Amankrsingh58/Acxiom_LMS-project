import React, { useState } from "react";
import {
  useGetTransactionsQuery,
  useGetBooksQuery,
  useGetMembersQuery,
  useReturnBookMutation,
} from "../services/api";
import { Search, Plus, RotateCcw, AlertCircle } from "lucide-react";
import IssueBookModal from "./IssueBookModal";

const Transactions = () => {
  const { data: transactions = [], isLoading: loadingTransactions } = useGetTransactionsQuery();
  const { data: books = [] } = useGetBooksQuery();
  const { data: members = [] } = useGetMembersQuery();
  const [returnBook] = useReturnBookMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);

  const filteredTransactions = transactions.filter((transaction) => {
    const book = books.find((b) => b._id === transaction.bookId);
    const member = members.find((m) => m._id === transaction.memberId);

    const matchesSearch =
      book?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book?.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member?.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      !statusFilter || transaction.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getBookTitle = (bookId) =>
    books.find((book) => book._id === bookId)?.title || "Unknown Book";

  const getMemberName = (memberId) =>
    members.find((member) => member._id === memberId)?.name || "Unknown Member";

  const getMemberEmail = (memberId) =>
    members.find((member) => member._id === memberId)?.email || "";

  const getStatusColor = (status) => {
    switch (status) {
      case "issued":
        return "bg-blue-100 text-blue-800";
      case "returned":
        return "bg-green-100 text-green-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const calculateDaysOverdue = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = now.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const calculateFine = (dueDate) => {
    const daysOverdue = calculateDaysOverdue(dueDate);
    return daysOverdue > 0 ? daysOverdue * 2 : 0;
  };

  const handleReturnBook = async (transaction) => {
    if (transaction.status === "returned") return;

    const fine =
      transaction.status === "overdue"
        ? calculateFine(transaction.dueDate)
        : 0;

    const confirmMessage =
      fine > 0
        ? `This book is ${calculateDaysOverdue(
            transaction.dueDate
          )} days overdue. Fine amount: $${fine}. Proceed with return?`
        : "Confirm book return?";

    if (window.confirm(confirmMessage)) {
      await returnBook({ id: transaction._id, fine });
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const TransactionCard = ({ transaction }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {getBookTitle(transaction.bookId)}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            {getMemberName(transaction.memberId)}
          </p>
          <p className="text-xs text-gray-500">
            {getMemberEmail(transaction.memberId)}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              transaction.status
            )}`}
          >
            {transaction.status}
          </span>

          {transaction.status !== "returned" && (
            <button
              onClick={() => handleReturnBook(transaction)}
              className="p-2 text-gray-500 hover:text-green-600"
              title="Return Book"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
        <div>
          <span className="font-medium">Issue Date:</span>
          <p>{formatDate(transaction.issueDate)}</p>
        </div>

        <div>
          <span className="font-medium">Due Date:</span>
          <p
            className={
              new Date(transaction.dueDate) < new Date() &&
              transaction.status !== "returned"
                ? "text-red-600 font-medium"
                : ""
            }
          >
            {formatDate(transaction.dueDate)}
          </p>
        </div>

        {transaction.returnDate && (
          <div className="col-span-2">
            <span className="font-medium">Return Date:</span>
            <p>{formatDate(transaction.returnDate)}</p>
          </div>
        )}

        {transaction.status === "overdue" && (
          <div className="col-span-2 bg-red-50 p-3 rounded-lg">
            <div className="flex items-center text-red-800">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span className="font-medium">
                {calculateDaysOverdue(transaction.dueDate)} days overdue
              </span>
            </div>
            <p className="text-sm text-red-600">
              Fine: ${calculateFine(transaction.dueDate)}
            </p>
          </div>
        )}

        {transaction.fine && transaction.fine > 0 && (
          <div className="col-span-2 bg-yellow-50 p-3 rounded-lg">
            <span className="font-medium text-yellow-800">
              Fine Paid:
            </span>
            <p className="text-yellow-700">${transaction.fine}</p>
          </div>
        )}
      </div>
    </div>
  );

  if (loadingTransactions) {
    return <p className="text-center text-gray-500">Loading transactions...</p>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Transactions
        </h2>

        <button
          onClick={() => setIsIssueModalOpen(true)}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-orange-700"
        >
          <Plus className="h-5 w-5" />
          <span>Issue Book</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search transactions..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">All Statuses</option>
            <option value="issued">Issued</option>
            <option value="overdue">Overdue</option>
            <option value="returned">Returned</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTransactions
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((transaction) => (
            <TransactionCard
              key={transaction._id}
              transaction={transaction}
            />
          ))}
      </div>

      {filteredTransactions.length === 0 && (
        <p className="text-center text-gray-500">
          No transactions found.
        </p>
      )}

      {/* Issue Book Modal */}
      {isIssueModalOpen && (
        <IssueBookModal
          onClose={() => setIsIssueModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Transactions;
