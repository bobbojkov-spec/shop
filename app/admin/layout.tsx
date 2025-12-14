"use client";

import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerProvider from "@refinedev/nextjs-router";
import dataProvider from "@refinedev/simple-rest";
import { customDataProvider } from "@/lib/data-provider";
import { ConfigProvider, App, Layout, Menu, Button } from "antd";
import { 
  DashboardOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PictureOutlined,
  FileTextOutlined,
  FileImageOutlined,
  SettingOutlined,
  BookOutlined,
  BgColorsOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { resources } from "@/lib/resources";
import "@refinedev/antd/dist/reset.css";

const { Header, Sider, Content } = Layout;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle menu toggle
  const handleMenuToggle = () => {
    setCollapsed(!collapsed);
  };

  const menuItems = [
    {
      key: "/admin",
      icon: <DashboardOutlined />,
      label: collapsed && !isMobile ? null : <Link href="/admin">Dashboard</Link>,
    },
    {
      type: "divider" as const,
    },
    {
      key: "/admin/products",
      icon: <ShoppingOutlined />,
      label: collapsed && !isMobile ? null : <Link href="/admin/products">Products</Link>,
    },
    {
      key: "/admin/categories",
      icon: <AppstoreOutlined />,
      label: collapsed && !isMobile ? null : <Link href="/admin/categories">Categories</Link>,
    },
    {
      key: "/admin/orders",
      icon: <ShoppingCartOutlined />,
      label: collapsed && !isMobile ? null : <Link href="/admin/orders">Orders</Link>,
    },
    {
      type: "divider" as const,
    },
    {
      key: "/admin/hero-slides",
      icon: <BgColorsOutlined />,
      label: collapsed && !isMobile ? null : <Link href="/admin/hero-slides">Hero Slides</Link>,
    },
    {
      key: "/admin/media",
      icon: <FileImageOutlined />,
      label: collapsed && !isMobile ? null : <Link href="/admin/media">Media</Link>,
    },
    {
      key: "/admin/news",
      icon: <FileTextOutlined />,
      label: collapsed && !isMobile ? null : <Link href="/admin/news">News</Link>,
    },
    {
      key: "/admin/pages",
      icon: <BookOutlined />,
      label: collapsed && !isMobile ? null : <Link href="/admin/pages">Pages</Link>,
    },
    {
      type: "divider" as const,
    },
    {
      key: "/admin/settings",
      icon: <SettingOutlined />,
      label: collapsed && !isMobile ? null : <Link href="/admin/settings">Settings</Link>,
    },
    {
      type: "divider" as const,
    },
    {
      key: "/admin/test",
      icon: <AppstoreOutlined />,
      label: collapsed && !isMobile ? null : <Link href="/admin/test">Test</Link>,
    },
    {
      key: "/admin/test-simple",
      icon: <AppstoreOutlined />,
      label: collapsed && !isMobile ? null : <Link href="/admin/test-simple">Test Simple</Link>,
    },
  ];

  return (
    <RefineKbarProvider>
      <ConfigProvider>
        <App>
          <Refine
            routerProvider={routerProvider}
            dataProvider={customDataProvider}
            resources={resources}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              projectId: "shop-admin",
            }}
          >
            <Layout style={{ minHeight: "100vh" }}>
              <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={setCollapsed}
                width={200}
                collapsedWidth={isMobile ? 0 : 80}
                breakpoint="md"
                onBreakpoint={(broken) => {
                  setIsMobile(broken);
                  if (broken) {
                    setCollapsed(true);
                  }
                }}
                style={{
                  background: "#fff",
                  borderRight: "1px solid #f0f0f0",
                  position: isMobile ? "fixed" : "relative",
                  left: isMobile && collapsed ? "-200px" : 0,
                  height: "100vh",
                  zIndex: isMobile ? 1000 : 1,
                  transition: "all 0.2s",
                }}
                trigger={null}
              >
                <div 
                  style={{ 
                    padding: collapsed && !isMobile ? "16px 8px" : "16px", 
                    fontSize: collapsed && !isMobile ? "14px" : "18px", 
                    fontWeight: "bold",
                    textAlign: collapsed && !isMobile ? "center" : "left",
                    whiteSpace: collapsed && !isMobile ? "nowrap" : "normal",
                    overflow: collapsed && !isMobile ? "hidden" : "visible",
                  }}
                >
                  {collapsed && !isMobile ? "SA" : "Shop Admin"}
                </div>
                <Menu
                  mode="inline"
                  selectedKeys={[pathname || "/admin"]}
                  items={menuItems}
                  style={{ borderRight: 0 }}
                  inlineCollapsed={collapsed && !isMobile}
                />
              </Sider>
              <Layout>
                <Header style={{ background: "#fff", padding: "0 24px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: "16px" }}>
                  <Button
                    type="text"
                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={handleMenuToggle}
                    style={{ fontSize: "16px", width: 64, height: 64 }}
                  />
                  {isMobile && !collapsed && (
                    <div
                      style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "rgba(0, 0, 0, 0.45)",
                        zIndex: 999,
                      }}
                      onClick={handleMenuToggle}
                    />
                  )}
                  <h1 style={{ margin: 0, fontSize: "20px", fontWeight: 500 }}>Admin Panel</h1>
                </Header>
                <Content style={{ margin: "24px", padding: "24px", background: "#fff", borderRadius: "8px" }}>
                  {children}
                </Content>
              </Layout>
            </Layout>
            <RefineKbar />
          </Refine>
        </App>
      </ConfigProvider>
    </RefineKbarProvider>
  );
}
