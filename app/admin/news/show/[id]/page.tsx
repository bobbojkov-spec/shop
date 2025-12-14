"use client";

import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography, Image, Tag } from "antd";
import { NewsArticle } from "@/lib/types/admin";
import { use } from "react";

const { Title, Text } = Typography;

interface ShowPageProps {
  params: {
    id: string;
  };
}

export default function NewsShow({ params }: ShowPageProps) {
  const { id } = params;
  const { query } = useShow<NewsArticle>({
    resource: "news",
    id,
  });

  const { data, isLoading } = query;
  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Title level={5}>Title</Title>
      <Text>{record?.title}</Text>

      <Title level={5} style={{ marginTop: 16 }}>Slug</Title>
      <Text>{record?.slug}</Text>

      <Title level={5} style={{ marginTop: 16 }}>Featured Image</Title>
      {record?.featuredImage && (
        <Image
          src={record.featuredImage}
          alt={record.title}
          width={400}
          style={{ marginTop: 8 }}
        />
      )}

      <Title level={5} style={{ marginTop: 16 }}>Excerpt</Title>
      <Text>{record?.excerpt}</Text>

      <Title level={5} style={{ marginTop: 16 }}>Content</Title>
      {record?.content ? (
        <div dangerouslySetInnerHTML={{ __html: record.content }} />
      ) : (
        <Text type="secondary">No content</Text>
      )}

      <Title level={5} style={{ marginTop: 16 }}>Status</Title>
      <Tag color={record?.publishStatus === "published" ? "green" : "orange"}>
        {record?.publishStatus?.toUpperCase()}
      </Tag>

      {record?.publishDate && (
        <>
          <Title level={5} style={{ marginTop: 16 }}>Publish Date</Title>
          <Text>{new Date(record.publishDate).toLocaleString()}</Text>
        </>
      )}
    </Show>
  );
}

