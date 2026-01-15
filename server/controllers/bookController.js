const Book = require("../models/Book");
const Transaction = require("../models/Transaction");

exports.getBooks = async (req, res) => {
  res.json(await Book.find());
};

exports.addBook = async (req, res) => {
  const { title, author, isbn, category, publishedYear, totalCopies, description, coverUrl } = req.body;
  if (!title || !author || !isbn || !category || !publishedYear || !totalCopies) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  res.status(201).json(await Book.create({
    title,
    author,
    isbn,
    category,
    publishedYear,
    totalCopies,
    availableCopies: totalCopies,
    description,
    coverUrl
  }));
};

exports.updateBook = async (req, res) => {
  res.json(
    await Book.findByIdAndUpdate(req.params.id, req.body, { new: true })
  );
};

exports.deleteBook = async (req, res) => {
  const active = await Transaction.findOne({
    bookId: req.params.id,
    status: { $ne: "returned" },
  });

  if (active) {
    return res.status(400).json({ message: "Book is currently issued" });
  }

  await Book.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};
