const express = require("express");
const GallerySchema = require("../Schema/GallerySchema");
const router = express.Router();

router.post("/addGalleryItem", async (req, res) => {
  try {
    const newGalleryItem = await GallerySchema.create(req.body);
    res.status(201).json({
      message: "Gallery item added successfully",
      galleryItem: newGalleryItem,
      success: true,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});
router.get("/getGalleryItems", async (req, res) => {
  try {
    const galleryItems = await GallerySchema.find();
    res.status(200).json({ galleryItems, success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});
router.delete("/deleteGalleryItem/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedGalleryItem = await GallerySchema.findByIdAndDelete(id);
    res.status(200).json({
      message: "Gallery item deleted successfully",
      galleryItem: deletedGalleryItem,
      success: true,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});
router.get("/getGalleryItem/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const galleryItem = await GallerySchema.findById(id);
    res.status(200).json({ galleryItem, success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});
router.patch("/updateGalleryItem/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedGalleryItem = await GallerySchema.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      message: "Gallery item updated successfully",
      galleryItem: updatedGalleryItem,
      success: true,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
