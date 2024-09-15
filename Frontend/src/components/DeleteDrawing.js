import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Spin, Button, message } from "antd";

const DeleteDrawing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [drawing, setDrawing] = useState(null);

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

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/v1/drawings/${id}`);
      message.success("Drawing deleted successfully!");
      navigate("/drawings"); // Redirect to drawings list after deletion
    } catch (error) {
      message.error("Failed to delete drawing.");
      console.error("Error deleting drawing:", error);
    }
  };

  if (loading) return <Spin className="App" size="large" />;
  if (!drawing) return <div>Drawing not found</div>;

  return (
    <div className="App">
      <h1>Are you sure you want to delete this drawing?</h1>
      <h2>{drawing.title}</h2>

      <Button type="primary" danger onClick={handleDelete}>
        Delete Drawing
      </Button>
    </div>
  );
};

export default DeleteDrawing;
