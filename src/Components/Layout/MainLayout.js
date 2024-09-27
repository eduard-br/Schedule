import React from "react";
import { Layout, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";

const { Header, Content, Footer } = Layout;

const MainLayout = ({ children }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    { label: <Link to="/">Home</Link>, key: "/" },
    { label: <Link to="/schedule">Schedule</Link>, key: "/schedule" },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          background: "#001529",
          padding: "0 50px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          className="logo"
          style={{ color: "#fff", fontWeight: "bold", fontSize: "24px" }}
        >
          Course Scheduler
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[currentPath]}
          items={menuItems}
          style={{ marginLeft: "auto", minWidth: "200px" }}
        />
      </Header>
      <Content style={{ padding: "0 50px", marginTop: "20px" }}>
        <div style={{ padding: 24, background: "#fff", minHeight: 380 }}>
          {children}
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Course Scheduler ©2024 Created by Eduard
      </Footer>
    </Layout>
  );
};

export default MainLayout;
