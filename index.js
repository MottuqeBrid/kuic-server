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
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/members", require("./router/MemberRouter"));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
