import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Whiteboard from "./components/WhiteboardDrawing";
import GetAllDrawings from "./components/GetAllDrawings";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Whiteboard />} />
          <Route path="/drawings" element={<GetAllDrawings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
