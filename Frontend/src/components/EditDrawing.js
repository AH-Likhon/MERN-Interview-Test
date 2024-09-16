/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Input, message, Spin } from "antd";
import {
  clearCanvas,
  fetchAllOrSpecificDrawing,
  handleCanvasClick,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  HandleSaveOrUpdateDrawing,
  redrawCanvas,
  setColor,
} from "../utils/DrawingUtils";

const EditDrawing = () => {
  const { id } = useParams();
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [drawing, setDrawing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shape, setShape] = useState(null); // Single shape object
  const [isPressed, setIsPressed] = useState(false);
  const [selectedShape, setSelectedShape] = useState(null);
  const [startPosition, setStartPosition] = useState(null);
  const [lineWidth, setLineWidth] = useState(5);
  const [drawingMode, setDrawingMode] = useState("line");
  const [title, setTitle] = useState("");

  const colors = useMemo(
    () => ["black", "red", "green", "orange", "blue", "yellow"],
    []
  );

  useEffect(() => {
    const fetchDrawing = async () => {
      try {
        const data = await fetchAllOrSpecificDrawing(`/api/v1/drawings/${id}`);
        setDrawing(data);
        setTitle(data.title);
        setShape(data.shape);
      } catch (error) {
        message.error("Error fetching drawing:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDrawing();
  }, [id]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      message.error("Failed to get canvas context");
      return;
    }

    context.lineCap = "round";
    context.lineWidth = lineWidth;
    contextRef.current = context;

    redrawCanvas(context, shape);
  }, [shape, colors, lineWidth]);

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

  const handleUpdateDrawing = async () => {
    const updatedDrawing = await HandleSaveOrUpdateDrawing(
      title,
      { ...shape, lineWidth },
      id
    );
    if (updatedDrawing) {
      clearCanvas(canvasRef, contextRef, {
        fillStyle: "white",
        resetShape: () => setShape(null),
      });
    }
  };

  const handleDrawingModeChange = (mode) => {
    setDrawingMode(mode);
    setStartPosition(null);
    if (mode !== "select") setSelectedShape(null);
  };

  return (
    <div className="App">
      {loading ? (
        <Spin size="large" />
      ) : (
        <>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter drawing title"
            className="mb-2 w-25"
          />
          <canvas
            ref={canvasRef}
            width={800}
            height={800}
            onMouseDown={beginDraw}
            onMouseMove={updateDraw}
            onMouseUp={endDraw}
            onClick={(e) =>
              handleCanvasClick(e, drawingMode, shape, setSelectedShape)
            }
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
            <Button variant="success" onClick={handleUpdateDrawing}>
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
            <Button onClick={() => handleDrawingModeChange("line")}>
              Line
            </Button>
            <Button onClick={() => handleDrawingModeChange("rectangle")}>
              Rectangle
            </Button>
            <Button onClick={() => handleDrawingModeChange("circle")}>
              Circle
            </Button>
            <Button onClick={() => handleDrawingModeChange("text")}>
              Text
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default EditDrawing;
