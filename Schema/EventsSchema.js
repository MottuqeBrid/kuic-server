const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    short_dec: {
      type: String,
      trim: true,
    },
    thumb: {
      type: String,
    },
    images: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ["upcoming", "past", "completed"],
      default: "upcoming",
    },
    description: {
      type: String,
      trim: true,
    },
    maxAttendees: {
      type: Number,
    },
    currentAttendees: {
      type: Number,
    },
    price: {
      type: String,
    },
    registrationDeadline: {
      type: String,
    },
    organizer: {
      type: String,
      trim: true,
    },
    contactEmail: {
      type: String,
      trim: true,
    },
    contactPhone: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    guests: [
      {
        name: { type: String },
        title: { type: String, trim: true },
        bio: { type: String, trim: true },
        image: { type: String },
        social: {
          linkedin: { type: String },
          twitter: { type: String },
          instagram: { type: String },
          facebook: { type: String },
          website: { type: String },
        },
      },
    ],
    agenda: [
      {
        time: { type: String },
        event: { type: String, trim: true },
        speaker: { type: String, trim: true },
      },
    ],
    regLink: {
      type: String,
    },
    isPinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
