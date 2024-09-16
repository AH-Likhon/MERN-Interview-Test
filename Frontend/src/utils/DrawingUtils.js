import { message } from "antd";
import axios from "axios";
import Swal from "sweetalert2";

const drawShape = (context, shape) => {
  if (!shape) return;

  context.strokeStyle = shape.color;
  context.lineWidth = shape.lineWidth || 5;

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
      context.rect(
        shape.startPosition.x,
        shape.startPosition.y,
        shape.endPosition.x - shape.startPosition.x,
        shape.endPosition.y - shape.startPosition.y
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
      context.font = shape.font || "20px Arial";
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
};

export const drawShapeOnCanvas = (canvas, shape) => {
  if (!canvas || !shape) return;

  const context = canvas.getContext("2d");
  drawShape(context, shape);
};

export const redrawCanvas = (context, shape) => {
  if (!shape || !context) return;

  // Clear the canvas before redrawing
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);

  // Redraw the shape
  drawShape(context, shape);
};

export const clearCanvas = (canvasRef, contextRef, options = {}) => {
  const canvas = canvasRef.current;
  const context = contextRef.current || canvas.getContext("2d");

  if (!canvas || !context) return;

  // Clear the canvas
  if (options.clearRect) {
    context.clearRect(0, 0, canvas.width, canvas.height);
  } else {
    context.fillStyle = options.fillStyle || "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Additional logic, like resetting shapes, if needed
  if (options.resetShape) {
    options.resetShape();
  }
};

export const setColor = (color, contextRef) => {
  contextRef.current.strokeStyle = color;
};

export const handleMouseDown = async (
  e,
  contextRef,
  setIsPressed,
  setShape,
  drawingMode,
  lineWidth
) => {
  const { offsetX: x, offsetY: y } = e.nativeEvent;
  setIsPressed(true);

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
        color: contextRef.current.strokeStyle,
        font: `${lineWidth * 5}px Arial`, // Font size based on line width
      });

      const context = contextRef.current;
      context.fillStyle = context.strokeStyle;
      context.font = `${lineWidth * 5}px Arial`;
      context.fillText(text, x, y);
    }
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

export const handleMouseMove = (e, isPressed, setShape, shape) => {
  if (!isPressed || !shape) return;
  const { offsetX: x, offsetY: y } = e.nativeEvent;

  setShape((prevShape) => ({
    ...prevShape,
    endPosition: { x, y },
  }));
};

export const handleMouseUp = (contextRef, setIsPressed, drawingMode) => {
  drawingMode !== "text" && contextRef.current.closePath();
  setIsPressed(false);
};

export const HandleSaveOrUpdateDrawing = async (title, shape, id = null) => {
  if (!title.trim()) {
    message.error("Please enter a title for your drawing!");
    return;
  }

  try {
    const res = id
      ? await axios.put(`/api/v1/drawings/${id}`, { title, shape })
      : await axios.post("/api/v1/drawings", { title, shape });

    message.success(
      id ? "Drawing updated successfully!" : "Drawing saved successfully!"
    );
    return res.data;
  } catch (error) {
    message.error("Failed to save the drawing.");
  }
};

export const fetchAllOrSpecificDrawing = async (url, params = {}) => {
  try {
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    message.error(error?.message);
  }
};

export const handleCanvasClick = (e, drawingMode, shape, setSelectedShape) => {
  if (drawingMode === "select") {
    const { offsetX: x, offsetY: y } = e.nativeEvent;

    const clickedShape = shape;

    if (clickedShape) {
      switch (clickedShape.type) {
        case "line":
          if (
            Math.abs(
              (clickedShape.endPosition.y - clickedShape.startPosition.y) * x -
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
