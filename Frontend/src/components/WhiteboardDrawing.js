import React, { useEffect, useMemo, useRef, useState } from "react";
import "../App.css";
import { Button, Input } from "antd";
import {
  clearCanvas,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  HandleSaveOrUpdateDrawing,
  redrawCanvas,
  setColor,
} from "../utils/DrawingUtils";

const Whiteboard = () => {
  const colors = useMemo(
    () => ["black", "red", "green", "orange", "blue", "yellow"],
    []
  );
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isPressed, setIsPressed] = useState(false);
  const [drawingTitle, setDrawingTitle] = useState("");
  const [shape, setShape] = useState(null);
  const [drawingMode, setDrawingMode] = useState("line");
  const [lineWidth, setLineWidth] = useState(5);

  const beginDraw = async (e) => {
    handleMouseDown(
      e,
      contextRef,
      setIsPressed,
      setShape,
      drawingMode,
      lineWidth
    );
  };

  const updateDraw = (e) => {
    handleMouseMove(e, isPressed, setShape, shape);
  };

  const endDraw = () => {
    handleMouseUp(contextRef, setIsPressed, drawingMode);
  };

  const handleSaveDrawing = async () => {
    const savedDrawing = await HandleSaveOrUpdateDrawing(drawingTitle, {
      ...shape,
      lineWidth,
    });
    if (savedDrawing) {
      clearCanvas(canvasRef, contextRef, {
        fillStyle: "white",
        resetShape: () => setShape(null),
      });
      setDrawingTitle("");
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.strokeStyle = colors[0];
    context.lineWidth = lineWidth;
    contextRef.current = context;
  }, [colors, lineWidth]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    redrawCanvas(context, shape);
  }, [shape]);

  return (
    <div className="App">
      <h1 style={{ fontWeight: "bold" }}>Start Your Drawing</h1>
      <Input
        type="text"
        value={drawingTitle}
        onChange={(e) => setDrawingTitle(e.target.value)}
        placeholder="Enter drawing title"
        className="form-control w-50"
      />
      <canvas
        ref={canvasRef}
        onMouseDown={beginDraw}
        onMouseMove={updateDraw}
        onMouseUp={endDraw}
      />
      <div className="buttons">
        <Button
          variant="secondary"
          onClick={() =>
            clearCanvas(canvasRef, contextRef, {
              fillStyle: "white",
              resetShape: () => setShape(null),
            })
          }
        >
          CLR
        </Button>
        <Button variant="success" onClick={handleSaveDrawing}>
          Save Drawing
        </Button>
        {colors.map((color, index) => (
          <Button
            key={`${color}+${index}`}
            onClick={() => setColor(color, contextRef)}
            style={{ backgroundColor: color }}
          ></Button>
        ))}
        <select
          onChange={(e) => setLineWidth(Number(e.target.value))}
          value={lineWidth}
        >
          {[1, 2, 5, 10, 15, 20].map((width) => (
            <option key={width} value={width}>
              {width}
            </option>
          ))}
        </select>
        <Button variant="secondary" onClick={() => setDrawingMode("line")}>
          Line
        </Button>
        <Button variant="dark" onClick={() => setDrawingMode("rectangle")}>
          Rectangle
        </Button>
        <Button variant="primary" onClick={() => setDrawingMode("circle")}>
          Circle
        </Button>
        <Button variant="info" onClick={() => setDrawingMode("text")}>
          Text
        </Button>
      </div>
    </div>
  );
};

export default Whiteboard;
