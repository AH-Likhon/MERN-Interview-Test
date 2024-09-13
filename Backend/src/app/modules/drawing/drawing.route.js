const express = require("express");
const {
  createDrawing,
  getAllDrawings,
  getDrawingById,
  updateDrawingById,
  deleteDrawingById,
} = require("./drawing.controller");

const router = express.Router();

// Routes for CRUD operations
router.post("/", createDrawing);
router.get("/", getAllDrawings);
router.get("/:id", getDrawingById);
router.put("/:id", updateDrawingById);
router.delete("/:id", deleteDrawingById);

module.exports = router;
