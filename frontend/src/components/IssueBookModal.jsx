import React, { useState } from "react";
import { X, Search } from "lucide-react";
import { useLibrary } from "../hooks/useLibrary";

const IssueBookModal = ({ onClose }) => {
  const { books, members, issueBook } = useLibrary();

  const [selectedBookId, setSelectedBookId] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [dueDate, setDueDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 14); // Default 2 weeks
    return date.toISOString().split("T")[0];
  });
  const [bookSearch, setBookSearch] = useState("");
  const [memberSearch, setMemberSearch] = useState("");

  const availableBooks = books.filter(
    (book) =>
      book.availableCopies > 0 &&
      (book.title.toLowerCase().includes(bookSearch.toLowerCase()) ||
        book.author.toLowerCase().includes(bookSearch.toLowerCase()) ||
        book.isbn.includes(bookSearch))
  );

  const activeMembers = members.filter(
    (member) =>
      member.isActive &&
      (member.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
        member.email.toLowerCase().includes(memberSearch.toLowerCase()))
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedBookId || !selectedMemberId) {
      alert("Please select both a book and a member.");
      return;
    }

    const transaction = issueBook(
      selectedBookId,
      selectedMemberId,
      dueDate
    );

    if (transaction) {
      alert("Book issued successfully!");
      onClose();
    } else {
      alert("Failed to issue book. The book may not be available.");
    }
  };

  const selectedBook = books.find(
    (book) => book.id === selectedBookId
  );
  const selectedMember = members.find(
    (member) => member.id === selectedMemberId
  );

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-bold text-gray-900">Issue Book</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Book Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Book *
            </label>

            <div className="relative mb-3">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search books..."
                value={bookSearch}
                onChange={(e) => setBookSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg">
              {availableBooks.length > 0 ? (
                availableBooks.map((book) => (
                  <label
                    key={book.id}
                    className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                      selectedBookId === book.id ? "bg-orange-50" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="book"
                      value={book.id}
                      checked={selectedBookId === book.id}
                      onChange={(e) =>
                        setSelectedBookId(e.target.value)
                      }
                      className="mr-3 text-orange-600 focus:ring-orange-500"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {book.title}
                      </p>
                      <p className="text-sm text-gray-600">
                        by {book.author}
                      </p>
                      <p className="text-xs text-gray-500">
                        Available: {book.availableCopies}/
                        {book.totalCopies} | ISBN: {book.isbn}
                      </p>
                    </div>
                  </label>
                ))
              ) : (
                <p className="p-3 text-gray-500 text-center">
                  No available books found
                </p>
              )}
            </div>
          </div>

          {/* Member Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Member *
            </label>

            <div className="relative mb-3">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search members..."
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg">
              {activeMembers.length > 0 ? (
                activeMembers.map((member) => (
                  <label
                    key={member.id}
                    className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                      selectedMemberId === member.id
                        ? "bg-orange-50"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="member"
                      value={member.id}
                      checked={selectedMemberId === member.id}
                      onChange={(e) =>
                        setSelectedMemberId(e.target.value)
                      }
                      className="mr-3 text-orange-600 focus:ring-orange-500"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {member.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {member.email}
                      </p>
                      <p className="text-xs text-gray-500">
                        {member.membershipType
                          .charAt(0)
                          .toUpperCase() +
                          member.membershipType.slice(1)}
                      </p>
                    </div>
                  </label>
                ))
              ) : (
                <p className="p-3 text-gray-500 text-center">
                  No active members found
                </p>
              )}
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date *
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Summary */}
          {selectedBook && selectedMember && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">
                Issue Summary
              </h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <span className="font-medium">Book:</span>{" "}
                  {selectedBook.title}
                </p>
                <p>
                  <span className="font-medium">Author:</span>{" "}
                  {selectedBook.author}
                </p>
                <p>
                  <span className="font-medium">Member:</span>{" "}
                  {selectedMember.name}
                </p>
                <p>
                  <span className="font-medium">Due Date:</span>{" "}
                  {new Date(dueDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!selectedBookId || !selectedMemberId}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Issue Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IssueBookModal;
