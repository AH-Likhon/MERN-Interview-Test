import React, { useEffect, useState } from "react";
import { Table, Spin, Popconfirm, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import "../App.css";

const GetAllDrawings = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/v1/drawings"); // Replace with your API endpoint
        setData(res.data); // Assuming response.data contains the array of drawings
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle delete functionality
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/v1/drawings/${id}`);
      message.success("Drawing deleted successfully");
      setData(data.filter((drawing) => drawing._id !== id)); // Update UI after deletion
    } catch (error) {
      message.error("Failed to delete drawing");
      // console.error("Error deleting drawing:", error);
    }
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      align: "center",
      render: (text, record) => (
        <Link
          style={{ color: "rgb(0 0 0 / 88%)", textDecoration: "none" }}
          to={`/drawings/${record._id}`}
        >
          {text}
        </Link>
      ),
    },
    {
      title: "Shape Type",
      key: "shapeType",
      align: "center",
      render: (text, record) => record.shape?.type || "N/A", // Accessing shape object directly
    },
    {
      title: "Color",
      key: "color",
      align: "center",
      render: (text, record) => (
        <span style={{ color: record.shape?.color || "#000" }}>
          {record.shape?.color || "N/A"}
        </span>
      ),
    },
    {
      title: "Line Width",
      key: "lineWidth",
      align: "center",
      render: (text, record) => record.shape?.lineWidth || "N/A", // Accessing shape object directly
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleString(),
      align: "center",
    },
    {
      title: "Update",
      key: "update",
      align: "center",
      render: (text, record) => (
        <EditOutlined
          style={{ color: "#1890ff", cursor: "pointer" }}
          onClick={() => navigate(`/drawings/${record._id}/edit`)}
        />
      ),
    },
    {
      title: "Delete",
      key: "delete",
      align: "center",
      render: (text, record) => (
        <Popconfirm
          title="Are you sure you want to delete this drawing?"
          onConfirm={() => handleDelete(record._id)}
          okText="Yes"
          cancelText="No"
        >
          <DeleteOutlined style={{ color: "#ff4d4f", cursor: "pointer" }} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="App">
      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          columns={columns}
          dataSource={data}
          rowKey="_id"
          pagination={{ pageSize: 7 }}
          bordered
          className="w-75"
        />
      )}
    </div>
  );
};

export default GetAllDrawings;
