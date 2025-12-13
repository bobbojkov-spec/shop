"use client";

import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography, Image, Tag, Space } from "antd";
import { HeroSlide } from "@/lib/types/admin";
import { use } from "react";

const { Title, Text } = Typography;

interface ShowPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function HeroSlideShow({ params }: ShowPageProps) {
  const { id } = use(params);
  const { query } = useShow<HeroSlide>({
    resource: "hero-slides",
    id,
  });

  const { data, isLoading } = query;
  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Title level={5}>Title</Title>
      <Text>{record?.title}</Text>

      <Title level={5} style={{ marginTop: 16 }}>Subtitle</Title>
      <Text>{record?.subtitle}</Text>

      <Title level={5} style={{ marginTop: 16 }}>Description</Title>
      <Text>{record?.description}</Text>

      <Title level={5} style={{ marginTop: 16 }}>Background Image</Title>
      {record?.backgroundImage && (
        <Image
          src={record.backgroundImage}
          alt={record.title}
          width={400}
          style={{ marginTop: 8 }}
        />
      )}

      <Title level={5} style={{ marginTop: 16 }}>CTA</Title>
      <Space>
        <Text>Text: {record?.ctaText}</Text>
        <Text>Link: {record?.ctaLink}</Text>
      </Space>

      <Title level={5} style={{ marginTop: 16 }}>Status</Title>
      <Space>
        <Tag color={record?.active ? "green" : "default"}>
          {record?.active ? "Active" : "Inactive"}
        </Tag>
        <Text>Order: {record?.order}</Text>
      </Space>
    </Show>
  );
}

