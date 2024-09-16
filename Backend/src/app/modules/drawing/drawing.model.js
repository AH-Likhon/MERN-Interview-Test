const mongoose = require("mongoose");

// Schema for a line, rectangle, circle, or text object
const shapeSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["line", "rectangle", "circle", "text"],
    required: true,
  },
  startPosition: { x: Number, y: Number },
  endPosition: { x: Number, y: Number },
  text: { type: String },
  radius: { type: Number },
  color: { type: String },
  lineWidth: { type: Number },
});

// Drawing Schema Model
const drawingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    shape: shapeSchema,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Drawing = mongoose.model("Drawing", drawingSchema);

module.exports = Drawing;
