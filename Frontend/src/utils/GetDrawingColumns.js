import { Link } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Popconfirm } from "antd";

// Function to generate table columns
export const getDrawingColumns = (handleDelete, navigate) => {
  return [
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
      render: (text, record) => record.shape?.type || "N/A",
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
      render: (text, record) => record.shape?.lineWidth || "N/A",
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
};
