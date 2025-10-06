const express = require("express");
const { Carousel } = require("../Schema/CarouselSchema");
const router = express.Router();

// Get all active carousel slides (ordered)
router.get("/getSlides", async (req, res) => {
  try {
    const slides = await Carousel.find({ isActive: true }).sort({
      order: 1,
      createdAt: 1,
    });
    res.status(200).json({ slides, success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get all carousel slides (including inactive ones)
router.get("/getAllSlides", async (req, res) => {
  const query = {};
  const { category, isActive } = req.query;

  if (category) {
    query["metadata.category"] = category;
  }
  if (isActive !== undefined) {
    query.isActive = isActive === "true";
  }

  try {
    const slides = await Carousel.find(query).sort({ order: 1, createdAt: 1 });
    res.status(200).json({ slides, success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get single carousel slide by ID
router.get("/getSlide/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const slide = await Carousel.findById(id);

    if (!slide) {
      return res.status(404).json({
        success: false,
        error: "Slide not found",
      });
    }

    res.status(200).json({ slide, success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Add new carousel slide
router.post("/addSlide", async (req, res) => {
  try {
    const newSlide = await Carousel.create(req.body);
    res.status(201).json({
      message: "Carousel slide added successfully",
      slide: newSlide,
      success: true,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Update carousel slide
router.patch("/updateSlide/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedSlide = await Carousel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedSlide) {
      return res.status(404).json({
        success: false,
        error: "Slide not found",
      });
    }

    res.status(200).json({
      message: "Carousel slide updated successfully",
      slide: updatedSlide,
      success: true,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Delete carousel slide
router.delete("/deleteSlide/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSlide = await Carousel.findByIdAndDelete(id);

    if (!deletedSlide) {
      return res.status(404).json({
        success: false,
        error: "Slide not found",
      });
    }

    res.status(200).json({
      message: "Carousel slide deleted successfully",
      slide: deletedSlide,
      success: true,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Toggle slide active status
router.patch("/toggleSlide/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const slide = await Carousel.findById(id);

    if (!slide) {
      return res.status(404).json({
        success: false,
        error: "Slide not found",
      });
    }

    slide.isActive = !slide.isActive;
    await slide.save();

    res.status(200).json({
      message: `Slide ${
        slide.isActive ? "activated" : "deactivated"
      } successfully`,
      slide,
      success: true,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Reorder slides
router.patch("/reorderSlides", async (req, res) => {
  try {
    const { slideOrders } = req.body; // Array of { id, order }

    if (!Array.isArray(slideOrders)) {
      return res.status(400).json({
        success: false,
        error: "slideOrders must be an array",
      });
    }

    const updatePromises = slideOrders.map(({ id, order }) =>
      Carousel.findByIdAndUpdate(id, { order }, { new: true })
    );

    const updatedSlides = await Promise.all(updatePromises);

    res.status(200).json({
      message: "Slides reordered successfully",
      slides: updatedSlides,
      success: true,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
