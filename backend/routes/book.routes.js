const express = require("express");
const router = express.Router();

const {
  addBook,
  getBooks,
  updateBook,
  deleteBook
} = require("../controllers/book.controller");
const authMiddleware = require("../middlewares/auth.middleware");



router.get("/", authMiddleware, getBooks);
router.post("/", authMiddleware, addBook);
router.put("/:id", authMiddleware, updateBook);
router.delete("/:id", authMiddleware, deleteBook);

module.exports = router;
