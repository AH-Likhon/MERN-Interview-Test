import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { message, Spin } from "antd";
import {
  fetchAllOrSpecificDrawing,
  drawShapeOnCanvas,
} from "../utils/DrawingUtils";

const GetSpecificDrawing = () => {
  const { id } = useParams();
  const [drawing, setDrawing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrawing = async () => {
      try {
        const data = await fetchAllOrSpecificDrawing(`/api/v1/drawings/${id}`);
        setDrawing(data);
      } catch (error) {
        message.error("Error fetching drawing:", error);
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
            drawShapeOnCanvas(canvas, drawing.shape);
          }
        }}
      />
    </div>
  );
};

export default GetSpecificDrawing;
