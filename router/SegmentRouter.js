const express = require("express");
const { Segment } = require("../Schema/SegmentSchema");
const router = express.Router();

// Get all active segments for public display
router.get("/getSegments", async (req, res) => {
  try {
    const segments = await Segment.find({ isActive: true })
      .sort({ order: 1, createdAt: 1 })
      .select("-detailedInfo.relatedCourses -detailedInfo.resources"); // Exclude heavy data for list view

    res.status(200).json({ segments, success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get all segments (including inactive ones) for admin
router.get("/getAllSegments", async (req, res) => {
  const query = {};
  const { category, isActive } = req.query;

  if (category) {
    query["metadata.category"] = category;
  }
  if (isActive !== undefined) {
    query.isActive = isActive === "true";
  }

  try {
    const segments = await Segment.find(query).sort({ order: 1, createdAt: 1 });
    res.status(200).json({ segments, success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get single segment by ID with full details
router.get("/getSegment/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const segment = await Segment.findById(id);

    if (!segment) {
      return res.status(404).json({
        success: false,
        error: "Segment not found",
      });
    }

    res.status(200).json({ segment, success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get single segment by slug with full details
router.get("/getSegmentBySlug/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const segment = await Segment.findOne({ slug, isActive: true });

    if (!segment) {
      return res.status(404).json({
        success: false,
        error: "Segment not found",
      });
    }

    res.status(200).json({ segment, success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get core segments (Science, Technology, Entrepreneurship, Philosophy)
router.get("/getCoreSegments", async (req, res) => {
  try {
    const segments = await Segment.find({
      "metadata.category": "core",
      isActive: true,
    })
      .sort({ order: 1, createdAt: 1 })
      .select("-detailedInfo.relatedCourses -detailedInfo.resources");

    res.status(200).json({ segments, success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Add new segment
router.post("/addSegment", async (req, res) => {
  try {
    const newSegment = await Segment.create(req.body);
    res.status(201).json({
      message: "Segment added successfully",
      segment: newSegment,
      success: true,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Update segment
router.patch("/updateSegment/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedSegment = await Segment.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedSegment) {
      return res.status(404).json({
        success: false,
        error: "Segment not found",
      });
    }

    res.status(200).json({
      message: "Segment updated successfully",
      segment: updatedSegment,
      success: true,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Delete segment
router.delete("/deleteSegment/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSegment = await Segment.findByIdAndDelete(id);

    if (!deletedSegment) {
      return res.status(404).json({
        success: false,
        error: "Segment not found",
      });
    }

    res.status(200).json({
      message: "Segment deleted successfully",
      segment: deletedSegment,
      success: true,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Toggle segment active status
router.patch("/toggleSegment/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const segment = await Segment.findById(id);

    if (!segment) {
      return res.status(404).json({
        success: false,
        error: "Segment not found",
      });
    }

    segment.isActive = !segment.isActive;
    await segment.save();

    res.status(200).json({
      message: `Segment ${
        segment.isActive ? "activated" : "deactivated"
      } successfully`,
      segment,
      success: true,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Reorder segments
router.patch("/reorderSegments", async (req, res) => {
  try {
    const { segmentOrders } = req.body; // Array of { id, order }

    if (!Array.isArray(segmentOrders)) {
      return res.status(400).json({
        success: false,
        error: "segmentOrders must be an array",
      });
    }

    const updatePromises = segmentOrders.map(({ id, order }) =>
      Segment.findByIdAndUpdate(id, { order }, { new: true })
    );

    const updatedSegments = await Promise.all(updatePromises);

    res.status(200).json({
      message: "Segments reordered successfully",
      segments: updatedSegments,
      success: true,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Update segment statistics
router.patch("/updateStatistics/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { statistics } = req.body;

    const updatedSegment = await Segment.findByIdAndUpdate(
      id,
      { statistics },
      { new: true, runValidators: true }
    );

    if (!updatedSegment) {
      return res.status(404).json({
        success: false,
        error: "Segment not found",
      });
    }

    res.status(200).json({
      message: "Segment statistics updated successfully",
      segment: updatedSegment,
      success: true,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Add resource to segment
router.patch("/addResource/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { resource } = req.body;

    const segment = await Segment.findById(id);

    if (!segment) {
      return res.status(404).json({
        success: false,
        error: "Segment not found",
      });
    }

    segment.detailedInfo.resources.push(resource);
    await segment.save();

    res.status(200).json({
      message: "Resource added successfully",
      segment,
      success: true,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Add course to segment
router.patch("/addCourse/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { course } = req.body;

    const segment = await Segment.findById(id);

    if (!segment) {
      return res.status(404).json({
        success: false,
        error: "Segment not found",
      });
    }

    segment.detailedInfo.relatedCourses.push(course);
    await segment.save();

    res.status(200).json({
      message: "Course added successfully",
      segment,
      success: true,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get segments by category
router.get("/getSegmentsByCategory/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const segments = await Segment.find({
      "metadata.category": category,
      isActive: true,
    }).sort({ order: 1, createdAt: 1 });

    res.status(200).json({ segments, success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Search segments
router.get("/searchSegments", async (req, res) => {
  try {
    const { q, category } = req.query;
    let query = { isActive: true };

    if (q) {
      query.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { features: { $in: [new RegExp(q, "i")] } },
        { "metadata.tags": { $in: [new RegExp(q, "i")] } },
      ];
    }

    if (category) {
      query["metadata.category"] = category;
    }

    const segments = await Segment.find(query)
      .sort({ order: 1, createdAt: 1 })
      .select("-detailedInfo.relatedCourses -detailedInfo.resources");

    res.status(200).json({ segments, success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
