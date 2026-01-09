import React, { useState } from "react";
import { useLibrary } from "../hooks/useLibrary";
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react";
import BookModal from "./BookModal";

const Books = () => {
  const { books, addBook, updateBook, deleteBook } = useLibrary();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [viewingBook, setViewingBook] = useState(null);

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm);

    const matchesCategory =
      !categoryFilter || book.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(
    new Set(books.map((book) => book.category))
  );

  const handleAddBook = () => {
    setEditingBook(null);
    setIsModalOpen(true);
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setIsModalOpen(true);
  };

  const handleDeleteBook = (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      deleteBook(id);
    }
  };

  const handleSaveBook = (bookData) => {
    if (editingBook) {
      updateBook(editingBook.id, bookData);
    } else {
      addBook(bookData);
    }
    setIsModalOpen(false);
    setEditingBook(null);
  };

  const BookCard = ({ book }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {book.title}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            by {book.author}
          </p>
          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            {book.category}
          </span>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setViewingBook(book)}
            className="p-2 text-gray-500 hover:text-blue-600"
          >
            <Eye className="h-4 w-4" />
          </button>

          <button
            onClick={() => handleEditBook(book)}
            className="p-2 text-gray-500 hover:text-green-600"
          >
            <Edit className="h-4 w-4" />
          </button>

          <button
            onClick={() => handleDeleteBook(book.id)}
            className="p-2 text-gray-500 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>ISBN:</span>
          <span className="font-mono">{book.isbn}</span>
        </div>
        <div className="flex justify-between">
          <span>Published:</span>
          <span>{book.publishedYear}</span>
        </div>
        <div className="flex justify-between">
          <span>Available:</span>
          <span
            className={
              book.availableCopies > 0
                ? "text-green-600"
                : "text-red-600"
            }
          >
            {book.availableCopies}/{book.totalCopies}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Books Management
        </h2>

        <button
          onClick={handleAddBook}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Book</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search books by title, author, or ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No books found matching your criteria.
          </p>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <BookModal
          book={editingBook}
          onSave={handleSaveBook}
          onClose={() => {
            setIsModalOpen(false);
            setEditingBook(null);
          }}
        />
      )}

      {/* View Modal */}
      {viewingBook && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
            <h3 className="text-xl font-bold mb-4">
              {viewingBook.title}
            </h3>

            <div className="space-y-3 text-sm">
              <p><strong>Author:</strong> {viewingBook.author}</p>
              <p><strong>ISBN:</strong> {viewingBook.isbn}</p>
              <p><strong>Category:</strong> {viewingBook.category}</p>
              <p><strong>Published:</strong> {viewingBook.publishedYear}</p>
              <p><strong>Total Copies:</strong> {viewingBook.totalCopies}</p>
              <p>
                <strong>Available:</strong>{" "}
                <span
                  className={
                    viewingBook.availableCopies > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {viewingBook.availableCopies}
                </span>
              </p>

              {viewingBook.description && (
                <p className="text-gray-600">
                  {viewingBook.description}
                </p>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setViewingBook(null)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Books;
