const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    FullName: {
      type: String,
      required: true,
    },
    Discipline: {
      type: String,
      required: true,
    },
    YearBatch: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      required: true,
    },
    PhoneNumber: {
      type: String,
      required: true,
    },
    PhotoURL: {
      type: String,
      default: "",
    },
    JoinDate: {
      type: Date,
      default: Date.now,
    },
    TimeLine: {
      type: String,
      default: "",
    },
    EndDate: {
      type: Date,
      default: null,
    },
    Status: {
      type: String,
      enum: ["Active", "Inactive", "Ex-Member"],
      default: "Active",
    },
    Position: {
      type: String,
      default: "General",
    },
    Bio: {
      type: String,
      default: "",
    },
    SocialMedia: {
      LinkedIn: {
        type: String,
        default: "",
      },
      Twitter: {
        type: String,
        default: "",
      },
      Facebook: {
        type: String,
        default: "",
      },
      Instagram: {
        type: String,
        default: "",
      },
      PersonalWebsite: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Member", memberSchema);
