import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../App.css";
import { Button, Input, message } from "antd";

const Whiteboard = () => {
  const colors = useMemo(
    () => ["black", "red", "green", "orange", "blue", "yellow"],
    []
  );
  const canvasReference = useRef(null);
  const contextReference = useRef(null);
  const [isPressed, setIsPressed] = useState(false);
  const [drawingTitle, setDrawingTitle] = useState("");
  const [shape, setShape] = useState(null);
  const [drawingMode, setDrawingMode] = useState("line");
  const [lineWidth, setLineWidth] = useState(5); // Dynamic line width state

  const clearCanvas = () => {
    const canvas = canvasReference.current;
    const context = canvas.getContext("2d");
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

  const beginDraw = async (e) => {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    contextReference.current.beginPath();

    if (drawingMode === "text") {
      const { value: text } = await Swal.fire({
        title: "Enter your text",
        input: "text",
        inputPlaceholder: "Type your text here",
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return "You need to write something!";
          }
        },
      });

      if (text) {
        setShape({
          type: "text",
          startPosition: { x, y },
          text,
          color: contextReference.current.strokeStyle,
          font: "20px Arial",
        });

        Swal.fire(`You entered: ${text}`);
      }
    } else {
      contextReference.current.moveTo(x, y);
      setIsPressed(true);
      setShape({
        type: drawingMode,
        startPosition: { x, y },
        endPosition: { x, y },
        color: contextReference.current.strokeStyle,
        lineWidth: lineWidth, // Use dynamic line width
      });
    }
  };

  const updateDraw = (e) => {
    if (!isPressed && drawingMode !== "text") return;
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    const context = contextReference.current;
    context.lineTo(x, y);
    context.stroke();
    if (shape && shape.type !== "text") {
      setShape((prevShape) => ({
        ...prevShape,
        endPosition: { x, y },
      }));
    }
  };

  const endDraw = () => {
    if (drawingMode !== "text") {
      contextReference.current.closePath();
    }
    setIsPressed(false);
  };

  const saveDrawing = async () => {
    if (!drawingTitle.trim()) {
      message.warning("Please enter a title for your drawing!");
      return;
    }
    try {
      const res = await axios.post("/api/v1/drawings", {
        title: drawingTitle,
        shape: { ...shape, lineWidth }, // Ensure lineWidth is included
      });
      console.log("Drawing saved:", shape, drawingTitle);
      res.status === 201 && message.success(`Drawing saved successfully!`);
      clearCanvas();
      setDrawingTitle("");
      setShape(null); // Reset the shape
    } catch (error) {
      // console.log(error?.response?.data?.error?.message);
      error?.response?.data?.error?.message &&
        message.error("Draw the shape on the box!");
    }
  };

  useEffect(() => {
    const canvas = canvasReference.current;
    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.strokeStyle = colors[0];
    context.lineWidth = lineWidth;
    contextReference.current = context;
  }, [colors, lineWidth]); // Include lineWidth in dependencies

  const setColor = (color) => {
    contextReference.current.strokeStyle = color;
  };

  useEffect(() => {
    const canvas = canvasReference.current;
    const context = canvas.getContext("2d");

    const redrawCanvas = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      if (shape) {
        context.strokeStyle = shape.color;
        context.lineWidth = shape.lineWidth;

        switch (shape.type) {
          case "line":
            context.beginPath();
            context.moveTo(shape.startPosition.x, shape.startPosition.y);
            context.lineTo(shape.endPosition.x, shape.endPosition.y);
            context.stroke();
            context.closePath();
            break;
          case "rectangle":
            context.beginPath();
            const width = shape.endPosition.x - shape.startPosition.x;
            const height = shape.endPosition.y - shape.startPosition.y;
            context.rect(
              shape.startPosition.x,
              shape.startPosition.y,
              width,
              height
            );
            context.stroke();
            context.closePath();
            break;
          case "circle":
            context.beginPath();
            const radius = Math.sqrt(
              Math.pow(shape.endPosition.x - shape.startPosition.x, 2) +
                Math.pow(shape.endPosition.y - shape.startPosition.y, 2)
            );
            context.arc(
              shape.startPosition.x,
              shape.startPosition.y,
              radius,
              0,
              2 * Math.PI
            );
            context.stroke();
            context.closePath();
            break;
          case "text":
            context.font = shape.font;
            context.fillStyle = shape.color;
            context.fillText(
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
  }, [shape]);

  return (
    <div className="App">
      <Input
        type="text"
        value={drawingTitle}
        onChange={(e) => setDrawingTitle(e.target.value)}
        placeholder="Enter drawing title"
        className="form-control w-50"
      />
      <canvas
        ref={canvasReference}
        onMouseDown={beginDraw}
        onMouseMove={updateDraw}
        onMouseUp={endDraw}
      />
      <div className="buttons">
        <Button variant="secondary" onClick={clearCanvas}>
          CLR
        </Button>
        <Button variant="success" onClick={saveDrawing}>
          Save Drawing
        </Button>
        {colors.map((color, index) => (
          <Button
            key={`${color}+${index}`}
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
