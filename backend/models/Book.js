const mongoose = require( "mongoose");

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  category: String,
  quantity: Number,
});

module.exports = mongoose.model("Book", bookSchema);
