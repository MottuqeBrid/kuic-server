const express = require("express");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: ["http://localhost:5173", "https://kuic.vercel.app"],
    credentials: true,
  })
);
app.use(express.json());

mongoose.connect(process.env.MONGO_URL);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/members", require("./router/MemberRouter"));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
