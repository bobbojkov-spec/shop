"use client";

import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography, Image, Tag, Space } from "antd";
import { Category } from "@/lib/types/admin";
import { use } from "react";

const { Title, Text } = Typography;

interface ShowPageProps {
  params: {
    id: string;
  };
}

export default function CategoryShow({ params }: ShowPageProps) {
  const { id } = params;
  const { query } = useShow<Category>({
    resource: "categories",
    id,
  });

  const { data, isLoading } = query;
  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Title level={5}>Name</Title>
      <Text>{record?.name}</Text>

      <Title level={5} style={{ marginTop: 16 }}>Slug</Title>
      <Text>{record?.slug}</Text>

      <Title level={5} style={{ marginTop: 16 }}>Description</Title>
      <Text>{record?.description}</Text>

      {record?.image && (
        <>
          <Title level={5} style={{ marginTop: 16 }}>Image</Title>
          <Image
            src={record.image}
            alt={record.name}
            width={300}
            style={{ marginTop: 8 }}
          />
        </>
      )}

      <Title level={5} style={{ marginTop: 16 }}>Status</Title>
      <Space>
        <Tag color={record?.active ? "green" : "default"}>
          {record?.active ? "Active" : "Inactive"}
        </Tag>
        <Text>Order: {record?.order}</Text>
        {record?.parentId && <Tag>Has Parent</Tag>}
      </Space>
    </Show>
  );
}

