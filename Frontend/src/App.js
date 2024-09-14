import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Whiteboard from "./components/WhiteboardDrawing";
import GetAllDrawings from "./components/GetAllDrawings";
import GetSpecificDrawing from "./components/GetSpecificDrawing";
import Navbar from "./common/Navbar/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Whiteboard />} />
        <Route path="/drawings" element={<GetAllDrawings />} />
        <Route path="/drawings/:id" element={<GetSpecificDrawing />} />
      </Routes>
    </Router>
  );
}

export default App;
