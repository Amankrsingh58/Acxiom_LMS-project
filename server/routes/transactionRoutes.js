const express = require("express");
const {
  getTransactions,
  issueBook,
  returnBook,
} = require("../controllers/transactionController.js");

const router = express.Router();

router.get("/", getTransactions);
router.post("/issue", issueBook);
router.post("/return", returnBook);

module.exports = router;
