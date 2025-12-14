"use client";

import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Select } from "antd";
import { PageContent } from "@/lib/types/admin";
import { use } from "react";

interface EditPageProps {
  params: {
    id: string;
  };
}

export default function PageEdit({ params }: EditPageProps) {
  const { id } = params;
  const { formProps, saveButtonProps } = useForm<PageContent>({
    resource: "pages",
    id,
  });

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Page Type"
          name="pageType"
          rules={[{ required: true }]}
        >
          <Select>
            <Select.Option value="home">Home</Select.Option>
            <Select.Option value="about">About Us</Select.Option>
            <Select.Option value="contact">Contact</Select.Option>
            <Select.Option value="custom">Custom</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true }]}
        >
          <Input placeholder="Page title" />
        </Form.Item>

        <Form.Item
          label="Slug"
          name="slug"
          rules={[{ required: true }]}
        >
          <Input placeholder="page-slug-url" />
        </Form.Item>

        <Form.Item
          label="Hero Image URL"
          name="heroImage"
        >
          <Input placeholder="Hero image URL" />
        </Form.Item>

        <Form.Item
          label="Content"
          name="content"
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={12} placeholder="Rich text content (HTML supported)" />
        </Form.Item>

        <Form.Item
          label="SEO Meta Title"
          name="metaTitle"
        >
          <Input placeholder="SEO title" />
        </Form.Item>

        <Form.Item
          label="SEO Meta Description"
          name="metaDescription"
        >
          <Input.TextArea rows={2} placeholder="SEO description" />
        </Form.Item>
      </Form>
    </Edit>
  );
}

