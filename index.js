const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 3000;

// middleware

app.use(cookieParser());

app.set("trust proxy", 1); // <--- important for proxies
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://kuic-server.vercel.app",
      "https://kuic.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

connectDB();

// routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/members", require("./router/MemberRouter"));
app.use("/api/events", require("./router/EventsRouter"));
app.use("/api/faqs", require("./router/FAQsRouter"));
app.use("/api/gallery", require("./router/GalleryRouter"));
app.use("/api/carousel", require("./router/CarouselRouter"));
app.use("/api/messages", require("./router/MessageRouter"));
app.use("/api/segments", require("./router/SegmentRouter"));
// Start server only after database connection
const startServer = async () => {
  try {
    // Wait for mongoose connection to be ready
    if (mongoose.connection.readyState !== 1) {
      await new Promise((resolve) => {
        mongoose.connection.on("connected", resolve);
      });
    }

    app.listen(port, () => {
      console.log(`Server listening at http://localhost:${port}`);
      console.log(
        `Database connection state: ${mongoose.connection.readyState}`
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
