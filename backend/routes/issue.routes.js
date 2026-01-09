const express = require ("express");
const { issueBook, returnBook } = require ("../controllers/issue.controller.js");
const authMiddleware = require("../middlewares/auth.middleware.js");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) =>
  res.json(await (await import("../models/Issue.js")).default.find()
    .populate("user")
    .populate("book"))
);

router.post("/", authMiddleware, issueBook);
router.put("/return/:id", authMiddleware, returnBook);

module.exports = router;
