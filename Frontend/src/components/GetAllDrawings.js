import React, { useEffect, useState } from "react";
import { Table, Spin, message } from "antd";
import axios from "axios";
import "../App.css";
import { fetchAllOrSpecificDrawing } from "../utils/DrawingUtils";
import { getDrawingColumns } from "../utils/GetDrawingColumns";
import { useNavigate } from "react-router-dom";

const GetAllDrawings = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllDrawings = async () => {
      try {
        const drawings = await fetchAllOrSpecificDrawing("/api/v1/drawings");
        setData(drawings);
      } catch (error) {
        message.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllDrawings();
  }, []);

  // Handle delete functionality
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/v1/drawings/${id}`);
      message.success("Drawing deleted successfully");
      setData(data.filter((drawing) => drawing._id !== id));
    } catch (error) {
      message.error("Failed to delete drawing");
    }
  };

  const columns = getDrawingColumns(handleDelete, navigate);
  return (
    <div className="App">
      {loading ? (
        <Spin size="large" />
      ) : (
        <>
          <h1
            style={{ fontWeight: "bold" }}
          >{`Total Drawings: ${data.length}`}</h1>
          <Table
            columns={columns}
            dataSource={data}
            rowKey="_id"
            pagination={{ pageSize: 7 }}
            bordered
            className="w-75"
          />
        </>
      )}
    </div>
  );
};

export default GetAllDrawings;
