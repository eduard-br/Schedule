import React from "react";
import { Link } from "react-router-dom";
import { Button, Typography } from "antd";

const { Title, Paragraph } = Typography;

const HomePage = () => {
  return (
    <div
      style={{
        textAlign: "center",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #e3fdfd 0%, #ffcdcd 100%)",
        padding: "0 20px",
      }}
    >
      <Title level={1} style={{ fontSize: "48px", color: "#001529" }}>
        Добро пожаловать в приложение расписания курсов!
      </Title>
      <Paragraph style={{ fontSize: "18px", maxWidth: "600px", color: "#555" }}>
        Управляйте своим временем с легкостью! Создавайте расписания курсов с
        помощью удобного и интуитивного интерфейса.
      </Paragraph>
      <Link to="/schedule">
        <Button
          type="primary"
          size="large"
          style={{
            padding: "10px 40px",
            fontSize: "18px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            borderRadius: "8px",
            background: "#1890ff",
          }}
        >
          Перейти на создание расписаний
        </Button>
      </Link>
    </div>
  );
};

export default HomePage;
