const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  book: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
  issueDate: { type: Date, default: Date.now },
  returnDate: Date,
  returned: { type: Boolean, default: false },
});

module.exports = mongoose.model("Issue", issueSchema);
