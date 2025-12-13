"use client";

import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Select, Space, Button } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { PageContent } from "@/lib/types/admin";

export default function PageCreate() {
  const { formProps, saveButtonProps } = useForm<PageContent>();

  return (
    <Create saveButtonProps={saveButtonProps}>
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
          initialValue="/images/about-us-img-1-1.jpg"
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
    </Create>
  );
}

