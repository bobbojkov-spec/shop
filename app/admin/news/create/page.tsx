"use client";

import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Select, DatePicker, InputNumber } from "antd";
import { NewsArticle } from "@/lib/types/admin";
import dayjs from "dayjs";

export default function NewsCreate() {
  const { formProps, saveButtonProps } = useForm<NewsArticle>();

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true }]}
        >
          <Input placeholder="Enter article title" />
        </Form.Item>

        <Form.Item
          label="Slug"
          name="slug"
          rules={[{ required: true }]}
        >
          <Input placeholder="article-slug-url" />
        </Form.Item>

        <Form.Item
          label="Featured Image URL"
          name="featuredImage"
          initialValue="/images/blog-1s.jpg"
        >
          <Input placeholder="Enter image URL" />
        </Form.Item>

        <Form.Item
          label="Excerpt"
          name="excerpt"
        >
          <Input.TextArea rows={3} placeholder="Short description" />
        </Form.Item>

        <Form.Item
          label="Content"
          name="content"
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={10} placeholder="Full article content (HTML supported)" />
        </Form.Item>

        <Form.Item
          label="Publish Status"
          name="publishStatus"
          initialValue="draft"
        >
          <Select>
            <Select.Option value="draft">Draft</Select.Option>
            <Select.Option value="published">Published</Select.Option>
            <Select.Option value="archived">Archived</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Publish Date"
          name="publishDate"
        >
          <DatePicker showTime style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Author"
          name="author"
        >
          <Input placeholder="Author name" />
        </Form.Item>
      </Form>
    </Create>
  );
}

