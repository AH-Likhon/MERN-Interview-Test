const Drawing = require("./drawing.model");

// Create a new drawing
const createDrawing = async (req, res) => {
  try {
    // Check if a drawing with the same title already exists
    const existingDrawing = await Drawing.findOne({ title: req.body.title });
    // console.log(req.body);

    if (existingDrawing) {
      return res.status(400).json({
        error: "Title already exists. Please choose a different title.",
      });
    }

    // If the title is unique, save the new drawing
    const drawing = new Drawing(req.body);
    await drawing.save();
    res.status(201).send(drawing);
  } catch (error) {
    res.status(500).send({ error });
  }
};

// Get all drawings
const getAllDrawings = async (req, res) => {
  try {
    const drawings = await Drawing.find().sort({ updatedAt: -1 });
    res.send(drawings);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get a specific drawing by ID
const getDrawingById = async (req, res) => {
  try {
    const drawing = await Drawing.findById(req.params.id);
    if (!drawing) return res.status(404).send({ message: "Drawing not found" });
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
    if (!drawing) return res.status(404).send({ message: "Drawing not found" });
    res.send(drawing);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete a drawing by ID
const deleteDrawingById = async (req, res) => {
  try {
    const drawing = await Drawing.findByIdAndDelete(req.params.id);
    if (!drawing) return res.status(404).send({ message: "Drawing not found" });
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
