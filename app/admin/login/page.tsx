"use client";

import { AuthPage } from "@refinedev/antd";
import { Card, Typography } from "antd";

const { Title } = Typography;

export default function LoginPage() {
  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      minHeight: "100vh",
      background: "#f0f2f5"
    }}>
      <Card style={{ width: 400, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        <Title level={2} style={{ textAlign: "center", marginBottom: 32 }}>
          Admin Login
        </Title>
        <AuthPage
          type="login"
          formProps={{
            initialValues: {
              email: "admin@example.com",
              password: "admin",
            },
          }}
        />
        <div style={{ marginTop: 16, textAlign: "center", color: "#999", fontSize: 12 }}>
          <p>Default credentials: admin@example.com / admin</p>
          <p style={{ marginTop: 8 }}>Auth will be implemented with your backend</p>
        </div>
      </Card>
    </div>
  );
}

