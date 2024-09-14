import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Swal from "sweetalert2";
import "../App.css";

const Whiteboard = () => {
  const colors = useMemo(
    () => ["black", "red", "green", "orange", "blue", "yellow"],
    []
  );
  const canvasReference = useRef(null);
  const contextReference = useRef(null);
  const [isPressed, setIsPressed] = useState(false);
  const [drawingTitle, setDrawingTitle] = useState("");
  const [shapes, setShapes] = useState([]);
  const [drawingMode, setDrawingMode] = useState("line");

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
        setShapes((prevShapes) => [
          ...prevShapes,
          {
            type: "text",
            startPosition: { x, y },
            text,
            color: contextReference.current.strokeStyle,
            font: "20px Arial",
          },
        ]);

        Swal.fire(`You entered: ${text}`);
      }
    } else {
      contextReference.current.moveTo(x, y);
      setIsPressed(true);
      setShapes((prevShapes) => [
        ...prevShapes,
        {
          type: drawingMode,
          startPosition: { x, y },
          endPosition: { x, y },
          color: contextReference.current.strokeStyle,
          lineWidth: contextReference.current.lineWidth,
        },
      ]);
    }
  };

  const updateDraw = (e) => {
    if (!isPressed && drawingMode !== "text") return;
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    const context = contextReference.current;
    context.lineTo(x, y);
    context.stroke();
    setShapes((prevShapes) => {
      const updatedShapes = [...prevShapes];
      const lastShape = updatedShapes.pop();
      if (lastShape) {
        lastShape.endPosition = { x, y };
        updatedShapes.push(lastShape);
      }
      return updatedShapes;
    });
  };

  const endDraw = () => {
    if (drawingMode !== "text") {
      contextReference.current.closePath();
    }
    setIsPressed(false);
  };

  const saveDrawing = async () => {
    if (!drawingTitle.trim()) {
      toast.warn("Please enter a title for your drawing!", {
        position: "top-center", // This will center the toast at the top
        autoClose: 3000, // Auto close after 3 seconds
      });
      return;
    }
    try {
      const res = await axios.post("/api/v1/drawings", {
        title: drawingTitle,
        shapes,
      });
      console.log("Drawing saved:", res);

      toast.success(`Drawing saved successfully!`, {
        position: "top-center", // This will center the toast at the top
        autoClose: 3000, // Auto close after 3 seconds
      });
      clearCanvas();
      setDrawingTitle("");
      setShapes([]);
    } catch (error) {
      // console.error("Error saving drawing:", error?.response?.data?.error);
      toast.error(error?.response?.data?.error, {
        position: "top-center", // This will center the toast at the top
        autoClose: 3000, // Auto close after 3 seconds
      });
    }
  };

  useEffect(() => {
    const canvas = canvasReference.current;
    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.strokeStyle = colors[0];
    context.lineWidth = 5;
    contextReference.current = context;
  }, [colors]);

  const setColor = (color) => {
    contextReference.current.strokeStyle = color;
  };

  useEffect(() => {
    const canvas = canvasReference.current;
    const context = canvas.getContext("2d");

    const redrawCanvas = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      shapes.forEach((shape) => {
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
      });
    };

    redrawCanvas();
  }, [shapes]);

  return (
    <div className="App">
      <input
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
          {" "}
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

      <ToastContainer />
    </div>
  );
};

export default Whiteboard;
