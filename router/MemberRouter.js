const express = require("express");
const MemberSchema = require("../Schema/MemberSchema");
const router = express.Router();

router.post("/addMember", async (req, res) => {
  try {
    const newMember = await MemberSchema.create(req.body);
    res.status(201).json({
      message: "Member added successfully",
      member: newMember,
      success: true,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get("/getMembers", async (req, res) => {
  const query = {};
  const { Status } = req.query;
  if (Status) {
    query.Status = Status;
  }
  try {
    const members = await MemberSchema.find(query);
    res.status(200).json({ members, success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete("/deleteMember/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMember = await MemberSchema.findByIdAndDelete(id);
    res.status(200).json({
      message: "Member deleted successfully",
      member: deletedMember,
      success: true,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get("/getMember/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const member = await MemberSchema.findById(id);
    res.status(200).json({ member, success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.patch("/updateMember/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedMember = await MemberSchema.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({
      message: "Member updated successfully",
      member: updatedMember,
      success: true,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
