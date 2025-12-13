"use client";

import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography, Image, Tag } from "antd";
import { PageContent } from "@/lib/types/admin";
import { use } from "react";

const { Title: PageTitle, Text: PageText } = Typography;
const { Title, Text } = Typography;

interface ShowPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PageShow({ params }: ShowPageProps) {
  const { id } = use(params);
  const { query } = useShow<PageContent>({
    resource: "pages",
    id,
  });

  const { data, isLoading } = query;
  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <PageTitle level={5}>Title</PageTitle>
      <PageText>{record?.title}</PageText>

      <PageTitle level={5} style={{ marginTop: 16 }}>Slug</PageTitle>
      <PageText>{record?.slug}</PageText>

      <PageTitle level={5} style={{ marginTop: 16 }}>Page Type</PageTitle>
      <Tag>{record?.pageType?.toUpperCase()}</Tag>

      {record?.heroImage && (
        <>
          <PageTitle level={5} style={{ marginTop: 16 }}>Hero Image</PageTitle>
          <Image
            src={record.heroImage}
            alt={record.title}
            width={400}
            style={{ marginTop: 8 }}
          />
        </>
      )}

      <PageTitle level={5} style={{ marginTop: 16 }}>Content</PageTitle>
      {record?.content ? (
        <div dangerouslySetInnerHTML={{ __html: record.content }} />
      ) : (
        <PageText type="secondary">No content</PageText>
      )}

      {record?.metaTitle && (
        <>
          <PageTitle level={5} style={{ marginTop: 16 }}>SEO Meta Title</PageTitle>
          <PageText>{record.metaTitle}</PageText>
        </>
      )}

      {record?.metaDescription && (
        <>
          <PageTitle level={5} style={{ marginTop: 16 }}>SEO Meta Description</PageTitle>
          <PageText>{record.metaDescription}</PageText>
        </>
      )}
    </Show>
  );
}

