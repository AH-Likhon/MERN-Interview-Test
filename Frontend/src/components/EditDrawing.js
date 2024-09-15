/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button, Input, message, Spin } from "antd";
import Swal from "sweetalert2";

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
        const res = await axios.get(`/api/v1/drawings/${id}`);
        setDrawing(res.data);
        setTitle(res.data.title);
        setShape(res.data.shape); // Fetch and set single shape
      } catch (error) {
        console.error("Error fetching drawing:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDrawing();
  }, [id]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      console.error("Canvas not found");
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      console.error("Failed to get canvas context");
      return;
    }

    context.lineCap = "round";
    context.lineWidth = lineWidth;
    contextRef.current = context;

    const redrawCanvas = () => {
      if (contextRef.current && shape) {
        const ctx = contextRef.current;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = shape.color;
        ctx.lineWidth = shape.lineWidth || lineWidth;

        switch (shape.type) {
          case "line":
            ctx.beginPath();
            ctx.moveTo(shape.startPosition.x, shape.startPosition.y);
            ctx.lineTo(shape.endPosition.x, shape.endPosition.y);
            ctx.stroke();
            ctx.closePath();
            break;
          case "rectangle":
            ctx.beginPath();
            ctx.rect(
              shape.startPosition.x,
              shape.startPosition.y,
              shape.endPosition.x - shape.startPosition.x,
              shape.endPosition.y - shape.startPosition.y
            );
            ctx.stroke();
            ctx.closePath();
            break;
          case "circle":
            ctx.beginPath();
            const radius = Math.sqrt(
              Math.pow(shape.endPosition.x - shape.startPosition.x, 2) +
                Math.pow(shape.endPosition.y - shape.startPosition.y, 2)
            );
            ctx.arc(
              shape.startPosition.x,
              shape.startPosition.y,
              radius,
              0,
              2 * Math.PI
            );
            ctx.stroke();
            ctx.closePath();
            break;
          case "text":
            ctx.font = "20px Arial";
            ctx.fillStyle = shape.color;
            ctx.fillText(
              shape.text,
              shape.startPosition.x,
              shape.startPosition.y
            );
            break;
          default:
            break;
        }
      }
    };

    redrawCanvas();
  }, [shape, colors, lineWidth]);

  const setColor = (newColor) => {
    contextRef.current.strokeStyle = newColor;
  };

  const handleMouseDown = (e) => {
    const { offsetX: x, offsetY: y } = e.nativeEvent;
    setStartPosition({ x, y });
    setIsPressed(true);

    if (drawingMode === "text") {
      Swal.fire({
        title: "Enter your text",
        input: "text",
        inputPlaceholder: "Type your text here",
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return "You need to write something!";
          }
        },
      }).then(({ value: text }) => {
        if (text) {
          setShape({
            type: "text",
            startPosition: { x, y },
            text,
            color: contextRef.current.strokeStyle,
            font: "20px Arial",
          });
        }
      });
    } else {
      setShape({
        type: drawingMode,
        color: contextRef.current.strokeStyle,
        lineWidth,
        startPosition: { x, y },
        endPosition: { x, y },
      });
    }
  };

  const handleMouseMove = (e) => {
    if (!isPressed) return;
    const { offsetX: x, offsetY: y } = e.nativeEvent;

    if (shape && drawingMode !== "text") {
      setShape((prevShape) => ({
        ...prevShape,
        endPosition: { x, y },
      }));
    }
  };

  const handleMouseUp = () => {
    if (drawingMode !== "text") {
      contextRef.current.closePath();
    }
    setIsPressed(false);
  };

  const handleCanvasClick = (e) => {
    if (drawingMode === "select") {
      const { offsetX: x, offsetY: y } = e.nativeEvent;

      const clickedShape = shape; // Only one shape to check

      if (clickedShape) {
        switch (clickedShape.type) {
          case "line":
            // Simple hit test for line
            if (
              Math.abs(
                (clickedShape.endPosition.y - clickedShape.startPosition.y) *
                  x -
                  (clickedShape.endPosition.x - clickedShape.startPosition.x) *
                    y +
                  clickedShape.endPosition.x * clickedShape.startPosition.y -
                  clickedShape.endPosition.y * clickedShape.startPosition.x
              ) /
                Math.sqrt(
                  Math.pow(
                    clickedShape.endPosition.y - clickedShape.startPosition.y,
                    2
                  ) +
                    Math.pow(
                      clickedShape.endPosition.x - clickedShape.startPosition.x,
                      2
                    )
                ) <
              5
            ) {
              setSelectedShape(clickedShape);
            } else {
              setSelectedShape(null);
            }
            break;
          case "rectangle":
            if (
              x >= clickedShape.startPosition.x &&
              x <= clickedShape.endPosition.x &&
              y >= clickedShape.startPosition.y &&
              y <= clickedShape.endPosition.y
            ) {
              setSelectedShape(clickedShape);
            } else {
              setSelectedShape(null);
            }
            break;
          case "circle":
            const dx = x - clickedShape.startPosition.x;
            const dy = y - clickedShape.startPosition.y;
            if (dx * dx + dy * dy <= Math.pow(clickedShape.radius, 2)) {
              setSelectedShape(clickedShape);
            } else {
              setSelectedShape(null);
            }
            break;
          default:
            setSelectedShape(null);
            break;
        }
      } else {
        setSelectedShape(null);
      }
    }
  };

  const handleSaveDrawing = async () => {
    if (!title.trim()) {
      message.error("Please enter a title for your drawing!");
      return;
    }

    try {
      await axios.put(`/api/v1/drawings/${id}`, {
        title,
        shape, // Send the single shape object
      });
      message.success("Drawing updated successfully!");

      // Reset all fields after saving
      clearCanvas();
      setTitle(""); // Reset title
      setShape(null); // Clear the shape

      // Clear the canvas
      if (contextRef.current && canvasRef.current) {
        contextRef.current.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
      }
    } catch (error) {
      message.error("Failed to update the drawing.");
    }
  };

  const clearCanvas = () => {
    setShape(null);
    if (contextRef.current && canvasRef.current) {
      contextRef.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    }
  };

  const handleDrawingModeChange = (mode) => {
    setDrawingMode(mode);
    setStartPosition(null); // Reset start position
    if (mode !== "select") setSelectedShape(null); // Clear selected shape
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
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onClick={handleCanvasClick}
          />
          <div className="buttons">
            <Button variant="secondary" onClick={clearCanvas}>
              CLR
            </Button>
            <Button variant="success" onClick={handleSaveDrawing}>
              Save Drawing
            </Button>
            {colors.map((color, index) => (
              <Button
                key={`${color}-${index}`}
                onClick={() => setColor(color)}
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
