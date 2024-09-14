import React, { useState } from "react";
import { Layout, Menu, Drawer, Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "antd/dist/reset.css"; // Make sure to import Ant Design styles
import "./Navbar.css";

const { Header } = Layout;

const Navbar = () => {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => setVisible(true);
  const onClose = () => setVisible(false);

  return (
    <Layout className="layout">
      <Header className="navbar">
        <div className="logo">
          <Link className="link" to="/">
            WhiteBoard App
          </Link>
        </div>
        <Button className="menu-button" type="primary" onClick={showDrawer}>
          <MenuOutlined />
        </Button>
        <Drawer
          title="Navigation"
          placement="right"
          onClose={onClose}
          visible={visible}
        >
          <Menu mode="inline" theme="dark" onClick={onClose}>
            <Menu.Item key="1">
              <Link className="link" to="/">
                Home
              </Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link className="link" to="/drawings">
                Drawing
              </Link>
            </Menu.Item>
          </Menu>
        </Drawer>
      </Header>
    </Layout>
  );
};

export default Navbar;
