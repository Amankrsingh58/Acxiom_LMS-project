const Transaction = require("../models/Transaction");
const Book = require("../models/Book");

exports.getTransactions = async (req, res) => {
  res.json(await Transaction.find());
};

exports.issueBook = async (req, res) => {
  const { bookId, memberId, dueDate } = req.body;
  if (!bookId || !memberId || !dueDate) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const book = await Book.findById(bookId);
  if (!book || book.availableCopies <= 0) {
    return res.status(400).json({ message: "Book not available" });
  }

  const transaction = await Transaction.create({
    bookId,
    memberId,
    issueDate: new Date().toISOString(),
    dueDate,
    status: "issued",
  });

  book.availableCopies -= 1;
  await book.save();

  res.status(201).json(transaction);
};

exports.returnBook = async (req, res) => {
  const { id, fine } = req.body;
console.log(id, fine);
  if (!id) {
    return res.status(400).json({ message: "Missing transactionId" });
  }
  const transaction = await Transaction.findById(id);
  if (!transaction || transaction.status === "returned") {
    return res.status(400).json({ message: "Invalid transaction" });
  }

  transaction.status = "returned";
  transaction.returnDate = new Date().toISOString();
  transaction.fine = fine;
  await transaction.save();

  const book = await Book.findById(transaction.bookId);
  if (book) {
    book.availableCopies += 1;
    await book.save();
  }

  res.json(transaction);
};
