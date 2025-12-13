"use client";

import { useList } from "@refinedev/core";
import { Card, Row, Col, Statistic, Typography, Space, Table, Tag } from "antd";
import {
  ShoppingOutlined,
  DollarOutlined,
  FileTextOutlined,
  PictureOutlined,
  AppstoreOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import Link from "next/link";

const { Title } = Typography;

export default function AdminDashboard() {

  // Fetch counts
  const { result: productsResult } = useList({
    resource: "products",
    pagination: { pageSize: 1 },
  });

  const { result: newsResult } = useList({
    resource: "news",
    pagination: { pageSize: 1 },
  });

  const { result: slidesResult } = useList({
    resource: "hero-slides",
    pagination: { pageSize: 1 },
  });

  const productCount = productsResult?.total || 0;
  const newsCount = newsResult?.total || 0;
  const slidesCount = slidesResult?.total || 0;

  // Recent activity - will be populated from actual data
  const recentActivity: Array<{
    key: string;
    type: string;
    action: string;
    item: string;
    time: string;
  }> = [];

  const activityColumns = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type: string) => {
        const colors: Record<string, string> = {
          product: "blue",
          news: "green",
          slide: "orange",
        };
        return <Tag color={colors[type]}>{type.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
    },
    {
      title: "Item",
      dataIndex: "item",
      key: "item",
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2}>Dashboard</Title>

      <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
        <Col xs={24} sm={12} lg={6}>
          <Link href="/admin/products">
            <Card hoverable>
              <Statistic
                title="Total Products"
                value={productCount}
                prefix={<ShoppingOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Link>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Link href="/admin/news">
            <Card hoverable>
              <Statistic
                title="News Articles"
                value={newsCount}
                prefix={<FileTextOutlined />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Link>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Link href="/admin/hero-slides">
            <Card hoverable>
              <Statistic
                title="Hero Slides"
                value={slidesCount}
                prefix={<PictureOutlined />}
                valueStyle={{ color: "#fa8c16" }}
              />
            </Card>
          </Link>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={0}
              prefix={<DollarOutlined />}
              precision={2}
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
        <Col xs={24} lg={16}>
          <Card title="Recent Activity" extra={<ClockCircleOutlined />}>
            <Table
              dataSource={recentActivity}
              columns={activityColumns}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Quick Actions">
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <Link href="/admin/products/create">
                <Card size="small" hoverable>
                  Create New Product
                </Card>
              </Link>
              <Link href="/admin/news/create">
                <Card size="small" hoverable>
                  Create News Article
                </Card>
              </Link>
              <Link href="/admin/hero-slides/create">
                <Card size="small" hoverable>
                  Add Hero Slide
                </Card>
              </Link>
              <Link href="/admin/media">
                <Card size="small" hoverable>
                  Manage Media
                </Card>
              </Link>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
