const Book = require("../models/Book");
const Member = require("../models/Member");
const Transaction = require("../models/Transaction");

exports.getStats = async (req, res) => {
  const now = new Date();

  const transactions = await Transaction.find();

  const overdueIds = transactions
    .filter(
      (t) => t.status === "issued" && new Date(t.dueDate) < now
    )
    .map((t) => t._id);

  if (overdueIds.length) {
    await Transaction.updateMany(
      { _id: { $in: overdueIds } },
      { status: "overdue" }
    );
  }

  const updated = await Transaction.find();

  const issuedBooks = updated.filter(
    (t) => t.status === "issued" || t.status === "overdue"
  ).length;

  const bookIssueCount = {};
  updated.forEach((t) => {
    bookIssueCount[t.bookId] = (bookIssueCount[t.bookId] || 0) + 1;
  });

  res.json({
    totalBooks: await Book.countDocuments(),
    totalMembers: await Member.countDocuments(),
    issuedBooks,
    overdueBooks: overdueIds.length,
    recentTransactions: updated
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5),
    popularBooks: Object.entries(bookIssueCount)
      .map(([bookId, issueCount]) => ({ bookId, issueCount }))
      .sort((a, b) => b.issueCount - a.issueCount)
      .slice(0, 5),
  });
};
