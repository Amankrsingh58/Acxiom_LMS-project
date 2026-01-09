const Issue = require( "../models/Issue.js");
const Book = require ("../models/Book.js");

exports.issueBook = async (req, res) => {
  const issue = await Issue.create(req.body);
  await Book.findByIdAndUpdate(req.body.book, { $inc: { quantity: -1 } });
  res.json(issue);
};

exports.returnBook = async (req, res) => {
  const issue = await Issue.findByIdAndUpdate(
    req.params.id,
    { returned: true },
    { new: true }
  );
  await Book.findByIdAndUpdate(issue.book, { $inc: { quantity: 1 } });
  res.json(issue);
};
