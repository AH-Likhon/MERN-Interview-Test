import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Whiteboard from "./components/WhiteboardDrawing";
import GetAllDrawings from "./components/GetAllDrawings";
import GetSpecificDrawing from "./components/GetSpecificDrawing";
import Navbar from "./common/Navbar/Navbar";
import EditDrawing from "./components/EditDrawing";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Whiteboard />} />
        <Route path="/drawings" element={<GetAllDrawings />} />
        <Route path="/drawings/:id" element={<GetSpecificDrawing />} />
        <Route path="/drawings/:id/edit" element={<EditDrawing />} />
      </Routes>
    </Router>
  );
}

export default App;
