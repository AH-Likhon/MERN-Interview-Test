const express = require("express");
const connectDB = require("./src/config/db");
const cors = require("cors");
const routes = require("./src/app/routes");
const errorHandler = require("./src/app/middlewares/errorHandler");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/v1", routes);

// Global error handling middleware (optional)
app.use(errorHandler);

// Start the server
app.get("/", async (req, res) => {
  res.send("Hello World is working");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import cors from "cors";

// const app = express();
// dotenv.config();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // MongoDB connection
// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.error(err));

// app.get("/", async (req, res) => {
//   res.send("Hello World is working");
// });
// // Listen on port
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
