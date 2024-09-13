const Drawing = require("./drawing.model");

// Create a new drawing
const createDrawing = async (req, res) => {
  try {
    const drawing = new Drawing(req.body);
    await drawing.save();
    res.status(201).send(drawing);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get all drawings
const getAllDrawings = async (req, res) => {
  try {
    const drawings = await Drawing.find();
    res.send(drawings);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get a specific drawing by ID
const getDrawingById = async (req, res) => {
  try {
    const drawing = await Drawing.findById(req.params.id);
    if (!drawing) return res.status(404).send();
    res.send(drawing);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update a drawing by ID
const updateDrawingById = async (req, res) => {
  try {
    const drawing = await Drawing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!drawing) return res.status(404).send();
    res.send(drawing);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete a drawing by ID
const deleteDrawingById = async (req, res) => {
  try {
    const drawing = await Drawing.findByIdAndDelete(req.params.id);
    if (!drawing) return res.status(404).send();
    res.send(drawing);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  createDrawing,
  getAllDrawings,
  getDrawingById,
  updateDrawingById,
  deleteDrawingById,
};
