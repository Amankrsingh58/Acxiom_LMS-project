const Book = require("../models/Book");

// ADD BOOK (Admin)
exports.addBook = async (req, res) => {
  try {
    const book = await Book.create({
      ...req.body,
      availableCopies: req.body.totalCopies
    });

    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL BOOKS (Admin / Student)
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE BOOK (Admin)
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE BOOK (Admin)
exports.deleteBook = async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "Book deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
