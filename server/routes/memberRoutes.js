const express =require( "express");
const {
  getMembers,
  addMember,
  updateMember,
  deleteMember,
} = require("../controllers/memberController.js");

const router = express.Router();

router.get("/", getMembers);
router.post("/", addMember);
router.put("/:id", updateMember);
router.delete("/:id", deleteMember);

module.exports = router;