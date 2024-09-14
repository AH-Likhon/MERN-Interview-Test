import React, { useEffect, useState } from "react";
import { Table, Spin } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import "../App.css";

const GetAllDrawings = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/v1/drawings"); // Replace with your API endpoint
        setData(res.data); // Assuming response.data contains the array of drawings
        console.log(res.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
      dataIndex: ["shapes", 0, "type"],
      key: "shapeType",
      align: "center",
    },
    {
      title: "Color",
      dataIndex: ["shapes", 0, "color"],
      key: "color",
      render: (color) => <span style={{ color }}>{color}</span>,
      align: "center",
    },
    {
      title: "Line Width",
      dataIndex: ["shapes", 0, "lineWidth"],
      key: "lineWidth",
      align: "center",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleString(),
      align: "center",
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
