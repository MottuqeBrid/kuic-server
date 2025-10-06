const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      enum: [
        "Advisor",
        "President",
        "General Secretary",
        "Vice President",
        "Treasurer",
        "Organizing Secretary",
        "Director",
      ],
      trim: true,
    },
    photo: {
      type: String,
      default: "/kuic.jpg",
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    messageType: {
      type: String,
      enum: ["advisor", "leader"],
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    socialMedia: {
      linkedin: {
        type: String,
        default: "",
        trim: true,
      },
      twitter: {
        type: String,
        default: "",
        trim: true,
      },
      facebook: {
        type: String,
        default: "",
        trim: true,
      },
      instagram: {
        type: String,
        default: "",
        trim: true,
      },
      email: {
        type: String,
        default: "",
        trim: true,
      },
    },
    metadata: {
      createdBy: {
        type: String,
        trim: true,
      },
      updatedBy: {
        type: String,
        trim: true,
      },
      tags: [
        {
          type: String,
          trim: true,
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
messageSchema.index({ isActive: 1, messageType: 1, order: 1 });
messageSchema.index({ role: 1 });

// Default values object for form initialization
const defaultValues = {
  name: "",
  title: "",
  role: "President",
  photo: "/kuic.jpg",
  message: "",
  messageType: "leader",
  isActive: true,
  order: 0,
  socialMedia: {
    linkedin: "",
    twitter: "",
    facebook: "",
    instagram: "",
    email: "",
  },
  metadata: {
    createdBy: "",
    updatedBy: "",
    tags: [],
  },
};

module.exports = {
  Message: mongoose.model("Message", messageSchema),
  defaultValues,
};
