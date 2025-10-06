const mongoose = require("mongoose");

const segmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
      required: true,
      enum: [
        "FaFlask",
        "FaCode",
        "FaRocket",
        "FaBookOpen",
        "FaLightbulb",
        "FaCog",
        "FaBrain",
        "FaGraduationCap",
      ],
      default: "FaRocket",
    },
    accentColor: {
      type: String,
      required: true,
      default: "bg-blue-500",
      trim: true,
    },
    features: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    detailedInfo: {
      overview: {
        type: String,
        default: "",
        trim: true,
      },
      objectives: [
        {
          type: String,
          trim: true,
        },
      ],
      prerequisites: [
        {
          type: String,
          trim: true,
        },
      ],
      learningOutcomes: [
        {
          type: String,
          trim: true,
        },
      ],
      relatedCourses: [
        {
          title: {
            type: String,
            trim: true,
          },
          description: {
            type: String,
            trim: true,
          },
          duration: {
            type: String,
            trim: true,
          },
          level: {
            type: String,
            enum: ["Beginner", "Intermediate", "Advanced"],
            default: "Beginner",
          },
        },
      ],
      resources: [
        {
          title: {
            type: String,
            trim: true,
          },
          type: {
            type: String,
            enum: ["book", "website", "video", "article", "tool", "course"],
            required: true,
          },
          url: {
            type: String,
            trim: true,
          },
          description: {
            type: String,
            trim: true,
          },
        },
      ],
    },
    statistics: {
      enrolledMembers: {
        type: Number,
        default: 0,
      },
      completedProjects: {
        type: Number,
        default: 0,
      },
      activeProjects: {
        type: Number,
        default: 0,
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
        enum: ["core", "specialized", "workshop", "seminar"],
        default: "core",
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
segmentSchema.index({ isActive: 1, order: 1 });
segmentSchema.index({ slug: 1 });
segmentSchema.index({ "metadata.category": 1 });

// Pre-save middleware to generate slug from title
segmentSchema.pre("save", function (next) {
  if (this.isModified("title") && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .trim("-");
  }
  next();
});

// Default values object for form initialization
const defaultValues = {
  title: "",
  description: "",
  icon: "FaRocket",
  accentColor: "bg-blue-500",
  features: [""],
  isActive: true,
  order: 0,
  slug: "",
  detailedInfo: {
    overview: "",
    objectives: [""],
    prerequisites: [""],
    learningOutcomes: [""],
    relatedCourses: [],
    resources: [],
  },
  statistics: {
    enrolledMembers: 0,
    completedProjects: 0,
    activeProjects: 0,
  },
  metadata: {
    createdBy: "",
    updatedBy: "",
    category: "core",
    tags: [],
  },
};

module.exports = {
  Segment: mongoose.model("Segment", segmentSchema),
  defaultValues,
};
