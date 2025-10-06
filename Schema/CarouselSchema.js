const mongoose = require("mongoose");

const carouselSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    cta: {
      type: String,
      trim: true,
      default: "",
    },
    ctaLink: {
      type: String,
      trim: true,
      default: "",
    },
    overlay: {
      type: String,
      trim: true,
      default: "from-black/60 via-black/30 to-transparent",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    slideSettings: {
      showCTA: {
        type: Boolean,
        default: true,
      },
      autoPlay: {
        type: Boolean,
        default: true,
      },
      transitionTime: {
        type: Number,
        default: 800,
      },
      interval: {
        type: Number,
        default: 5000,
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
      category: {
        type: String,
        enum: ["event", "general", "hero", "promotion", "announcement"],
        default: "general",
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
carouselSchema.index({ isActive: 1, order: 1 });
carouselSchema.index({ "metadata.category": 1 });

// Default values object for form initialization
const defaultValues = {
  title: "",
  subtitle: "",
  description: "",
  image: "",
  cta: "",
  ctaLink: "",
  overlay: "from-black/60 via-black/30 to-transparent",
  isActive: true,
  order: 0,
  slideSettings: {
    showCTA: true,
    autoPlay: true,
    transitionTime: 800,
    interval: 5000,
  },
  metadata: {
    createdBy: "",
    updatedBy: "",
    category: "hero",
    tags: [],
  },
};

module.exports = {
  Carousel: mongoose.model("Carousel", carouselSchema),
  defaultValues,
};
