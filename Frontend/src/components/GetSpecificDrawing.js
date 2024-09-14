import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Spin } from "antd";

const GetSpecificDrawing = () => {
  const { id } = useParams();
  const [drawing, setDrawing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrawing = async () => {
      try {
        const res = await axios.get(`/api/v1/drawings/${id}`);
        setDrawing(res.data);
      } catch (error) {
        console.error("Error fetching drawing:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDrawing();
  }, [id]);

  if (loading) return <Spin className="App" size="large" />;

  if (!drawing) return <div>Drawing not found</div>;

  return (
    <div className="App">
      <h1>{drawing.title}</h1>
      <canvas
        width={800}
        height={800}
        ref={(canvas) => {
          if (canvas) {
            const context = canvas.getContext("2d");
            drawing.shapes.forEach((shape) => {
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
                  context.font = "20px Arial";
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
          }
        }}
      />
    </div>
  );
};

export default GetSpecificDrawing;
