const  mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: String,
    author: String,
    isbn: String,
    category: String,
    publishedYear: Number,
    totalCopies: Number,
    availableCopies: Number,
    description: String,
    coverUrl: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
