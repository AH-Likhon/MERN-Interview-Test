const mongoose = require("mongoose");

// Schema for a Line
const lineSchema = new mongoose.Schema({
  start: { x: Number, y: Number },
  end: { x: Number, y: Number },
  color: { type: String, default: "#000000" },
  thickness: { type: Number, default: 2 },
});

// Schema for a Shape
const shapeSchema = new mongoose.Schema({
  type: { type: String, enum: ["rectangle", "circle"], required: true },
  position: { x: Number, y: Number },
  dimensions: { width: Number, height: Number },
  radius: Number, // For circles
  color: { type: String, default: "#000000" },
  thickness: { type: Number, default: 2 },
});

// Schema for Text Annotation
const textAnnotationSchema = new mongoose.Schema({
  position: { x: Number, y: Number },
  text: { type: String, required: true },
  fontSize: { type: Number, default: 12 },
  color: { type: String, default: "#000000" },
});

// Schema for a Drawing (Whiteboard)
const drawingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  lines: [lineSchema],
  shapes: [shapeSchema],
  textAnnotations: [textAnnotationSchema],
  createdAt: { type: Date, default: Date.now },
});

const Drawing = mongoose.model("Drawing", drawingSchema);

module.exports = Drawing;
