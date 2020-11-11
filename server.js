const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const app = express();
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

// Define port
const PORT = process.env.PORT || 3000;

// Define express server and middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
  }));

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/tastytreat",
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("successfully connected to database");
  }
);
// Specify API routes
const userRouter = require("./routes/User");
app.use("/user", userRouter);

app.use(cors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
  }));
  
// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));
}

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

// Start the express server
app.listen(PORT, () => {
  console.log("express server started");
});
