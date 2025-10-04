const express = require("express");
const FAQsSchema = require("../Schema/FAQsSchema");
const router = express.Router();

router.post("/addFAQ", async (req, res) => {
  try {
    const newFAQ = await FAQsSchema.create(req.body);
    res.status(201).json({
      message: "FAQ added successfully",
      faq: newFAQ,
      success: true,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get("/getFAQs", async (req, res) => {
  try {
    const faqs = await FAQsSchema.find();
    res.status(200).json({ faqs, success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get("/getFAQ/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const faq = await FAQsSchema.findById(id);
    res.status(200).json({ faq, success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});
router.patch("/updateFAQ/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFAQ = await FAQsSchema.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      message: "FAQ updated successfully",
      faq: updatedFAQ,
      success: true,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});
router.delete("/deleteFAQ/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const faq = await FAQsSchema.findByIdAndDelete(id);
    res
      .status(200)
      .json({ message: "FAQ deleted successfully", success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
