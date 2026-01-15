const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
    },
    issueDate: String,
    dueDate: String,
    returnDate: String,
    status: {
      type: String,
      enum: ["issued", "returned", "overdue"],
      default: "issued",
    },
    fine: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
