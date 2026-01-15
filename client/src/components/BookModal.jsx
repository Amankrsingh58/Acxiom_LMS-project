import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const INITIAL_STATE = {
  title: "",
  author: "",
  isbn: "",
  category: "",
  publishedYear: new Date().getFullYear(),
  totalCopies: 1,
  availableCopies: 1,
  description: "",
  coverUrl: "",
};

const BookModal = ({ book, onSave, onClose }) => {
  const [formData, setFormData] = useState(INITIAL_STATE);

  /* ================= SYNC EDIT MODE ================= */
  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || "",
        author: book.author || "",
        isbn: book.isbn || "",
        category: book.category || "",
        publishedYear: book.publishedYear || new Date().getFullYear(),
        totalCopies: book.totalCopies || 1,
        availableCopies: book.totalCopies,
        description: book.description || "",
        coverUrl: book.coverUrl || "",
      });
    } else {
      setFormData(INITIAL_STATE);
    }
  }, [book]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value, type } = e.target;

    let parsedValue =
      type === "number" ? Math.max(0, Number(value)) : value;

    setFormData((prev) => {
      const updated = { ...prev, [name]: parsedValue };

      // Ensure availableCopies is never invalid
      if (name === "totalCopies") {
        updated.availableCopies = Math.min(
          updated.availableCopies,
          parsedValue
        );
      }

      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const categories = [
    "Fiction",
    "Non-Fiction",
    "Science Fiction",
    "Fantasy",
    "Mystery",
    "Romance",
    "Biography",
    "History",
    "Science",
    "Technology",
    "Philosophy",
    "Art",
    "Poetry",
    "Drama",
    "Other",
  ];

  /* ================= UI ================= */
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-bold text-gray-900">
            {book ? "Edit Book" : "Add New Book"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Title"
              required
              className="border p-2 rounded"
            />

            <input
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Author"
              required
              className="border p-2 rounded"
            />

            <input
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              placeholder="ISBN"
              required
              className="border p-2 rounded"
            />

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="border p-2 rounded"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <input
              type="number"
              name="publishedYear"
              value={formData.publishedYear}
              onChange={handleChange}
              className="border p-2 rounded"
            />

            <input
              type="number"
              name="totalCopies"
              value={formData.totalCopies}
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </div>

          <input
            name="coverUrl"
            value={formData.coverUrl}
            onChange={handleChange}
            placeholder="Cover URL"
            className="border p-2 rounded w-full"
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Description"
            className="border p-2 rounded w-full"
          />

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {book ? "Update Book" : "Add Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookModal;
