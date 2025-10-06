const express = require("express");
const { Message } = require("../Schema/MessageSchema");
const router = express.Router();

// Get all messages (advisor and leaders) for public display
router.get("/getMessages", async (req, res) => {
  try {
    const messages = await Message.find({ isActive: true }).sort({
      messageType: 1,
      order: 1,
      createdAt: 1,
    });

    // Separate advisor and leaders
    const advisor = messages.find((msg) => msg.messageType === "advisor");
    const leaders = messages.filter((msg) => msg.messageType === "leader");

    res.status(200).json({
      advisor: advisor || null,
      leaders,
      success: true,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get advisor message only
router.get("/getAdvisorMessage", async (req, res) => {
  try {
    const advisor = await Message.findOne({
      messageType: "advisor",
      isActive: true,
    });

    res.status(200).json({ advisor, success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get leader messages only
router.get("/getLeaderMessages", async (req, res) => {
  try {
    const leaders = await Message.find({
      messageType: "leader",
      isActive: true,
    }).sort({ order: 1, createdAt: 1 });

    res.status(200).json({ leaders, success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get all messages (including inactive ones) for admin
router.get("/getAllMessages", async (req, res) => {
  const query = {};
  const { messageType, role, isActive } = req.query;

  if (messageType) {
    query.messageType = messageType;
  }
  if (role) {
    query.role = role;
  }
  if (isActive !== undefined) {
    query.isActive = isActive === "true";
  }

  try {
    const messages = await Message.find(query).sort({
      messageType: 1,
      order: 1,
      createdAt: 1,
    });
    res.status(200).json({ messages, success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get single message by ID
router.get("/getMessage/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        error: "Message not found",
      });
    }

    res.status(200).json({ message, success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Add new message
router.post("/addMessage", async (req, res) => {
  try {
    // If adding an advisor message, deactivate existing advisor
    if (req.body.messageType === "advisor") {
      await Message.updateMany({ messageType: "advisor" }, { isActive: false });
    }

    const newMessage = await Message.create(req.body);
    res.status(201).json({
      message: "Message added successfully",
      data: newMessage,
      success: true,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Update message
router.patch("/updateMessage/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // If updating to advisor type, deactivate other advisors
    if (req.body.messageType === "advisor") {
      await Message.updateMany(
        { messageType: "advisor", _id: { $ne: id } },
        { isActive: false }
      );
    }

    const updatedMessage = await Message.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedMessage) {
      return res.status(404).json({
        success: false,
        error: "Message not found",
      });
    }

    res.status(200).json({
      message: "Message updated successfully",
      data: updatedMessage,
      success: true,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Delete message
router.delete("/deleteMessage/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMessage = await Message.findByIdAndDelete(id);

    if (!deletedMessage) {
      return res.status(404).json({
        success: false,
        error: "Message not found",
      });
    }

    res.status(200).json({
      message: "Message deleted successfully",
      data: deletedMessage,
      success: true,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Toggle message active status
router.patch("/toggleMessage/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        error: "Message not found",
      });
    }

    message.isActive = !message.isActive;
    await message.save();

    res.status(200).json({
      message: `Message ${
        message.isActive ? "activated" : "deactivated"
      } successfully`,
      data: message,
      success: true,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Reorder messages (for leaders)
router.patch("/reorderMessages", async (req, res) => {
  try {
    const { messageOrders } = req.body; // Array of { id, order }

    if (!Array.isArray(messageOrders)) {
      return res.status(400).json({
        success: false,
        error: "messageOrders must be an array",
      });
    }

    const updatePromises = messageOrders.map(({ id, order }) =>
      Message.findByIdAndUpdate(id, { order }, { new: true })
    );

    const updatedMessages = await Promise.all(updatePromises);

    res.status(200).json({
      message: "Messages reordered successfully",
      data: updatedMessages,
      success: true,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get messages by role
router.get("/getMessagesByRole/:role", async (req, res) => {
  try {
    const { role } = req.params;
    const messages = await Message.find({
      role: role,
      isActive: true,
    }).sort({ order: 1, createdAt: 1 });

    res.status(200).json({ messages, success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
