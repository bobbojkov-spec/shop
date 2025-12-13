"use client";

import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography, Image, Tag, Space, Row, Col } from "antd";
import { Product } from "@/lib/types/admin";
import { use } from "react";

const { Title, Text } = Typography;

interface ShowPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProductShow({ params }: ShowPageProps) {
  const { id } = use(params);
  const { query } = useShow<Product>({
    resource: "products",
    id,
  });

  const { data, isLoading } = query;
  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Title level={5}>Name</Title>
          <Text>{record?.name}</Text>

          <Title level={5} style={{ marginTop: 16 }}>SKU</Title>
          <Text>{record?.sku}</Text>

          <Title level={5} style={{ marginTop: 16 }}>Price</Title>
          <Text>
            {record?.currency || 'EUR'} {typeof record?.price === 'number' 
              ? record.price.toFixed(2) 
              : parseFloat(record?.price || '0').toFixed(2)}
          </Text>

          <Title level={5} style={{ marginTop: 16 }}>Stock Quantity</Title>
          <Text>{record?.stockQuantity}</Text>

          <Title level={5} style={{ marginTop: 16 }}>Status</Title>
          <Tag color={record?.active ? "green" : "default"}>
            {record?.active ? "Active" : "Inactive"}
          </Tag>
        </Col>
        <Col xs={24} md={12}>
          <Title level={5}>Images</Title>
          <Space wrap>
            {record?.images && Array.isArray(record.images) && record.images.length > 0 ? (
              record.images.map((url, index) => (
                <Image
                  key={index}
                  src={url}
                  alt={`${record.name || 'Product'} ${index + 1}`}
                  width={100}
                  height={100}
                  style={{ objectFit: "cover", borderRadius: "4px" }}
                />
              ))
            ) : (
              <Text type="secondary">No images</Text>
            )}
          </Space>
        </Col>
      </Row>

      <Title level={5} style={{ marginTop: 16 }}>Description</Title>
      <Text>{record?.description}</Text>

      {record?.metaTitle && (
        <>
          <Title level={5} style={{ marginTop: 16 }}>SEO Meta Title</Title>
          <Text>{record.metaTitle}</Text>
        </>
      )}

      {record?.metaDescription && (
        <>
          <Title level={5} style={{ marginTop: 16 }}>SEO Meta Description</Title>
          <Text>{record.metaDescription}</Text>
        </>
      )}
    </Show>
  );
}

