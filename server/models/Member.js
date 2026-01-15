const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    address: String,
    membershipType: String,
    joinDate: String,
    isActive: Boolean,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Member", memberSchema);
