const Member = require("../models/Member");

exports.getMembers = async (req, res) => {
  res.json(await Member.find());
};

exports.addMember = async (req, res) => {
  res.status(201).json(await Member.create(req.body));
};

exports.updateMember = async (req, res) => {
  res.json(
    await Member.findByIdAndUpdate(req.params.id, req.body, { new: true })
  );
};

exports.deleteMember = async (req, res) => {
  await Member.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};
