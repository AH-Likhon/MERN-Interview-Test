const mongoose = require("mongoose");

// Define the structure for a line, rectangle, circle, or text object
const shapeSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["line", "rectangle", "circle", "text"],
    required: true,
  },
  startPosition: { x: Number, y: Number }, // Common for all shapes
  endPosition: { x: Number, y: Number }, // For line, rectangle, and circle
  text: { type: String }, // Only for text type
  radius: { type: Number }, // Only for circle type
  color: { type: String }, // Optional, for color of lines/shapes
  lineWidth: { type: Number }, // Optional, thickness of lines/shapes
});

const drawingSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  shapes: [shapeSchema], // Each drawing can contain multiple shapes
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Drawing = mongoose.model("Drawing", drawingSchema);

module.exports = Drawing;
