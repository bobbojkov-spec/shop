"use client";

import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber, Switch, TreeSelect } from "antd";
import { Category } from "@/lib/types/admin";
import { use } from "react";

interface EditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function CategoryEdit({ params }: EditPageProps) {
  const { id } = use(params);
  const { formProps, saveButtonProps } = useForm<Category>({
    resource: "categories",
    id,
  });

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true }]}
        >
          <Input placeholder="Category name" />
        </Form.Item>

        <Form.Item
          label="Slug"
          name="slug"
          rules={[{ required: true }]}
        >
          <Input placeholder="category-slug" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
        >
          <Input.TextArea rows={4} placeholder="Category description" />
        </Form.Item>

        <Form.Item
          label="Parent Category"
          name="parentId"
        >
          <TreeSelect
            placeholder="Select parent category (optional)"
            allowClear
            treeDefaultExpandAll
            treeData={[]}
            notFoundContent="No categories available"
          />
        </Form.Item>

        <Form.Item
          label="Image URL"
          name="image"
        >
          <Input placeholder="Category image URL" />
        </Form.Item>

        <Form.Item
          label="Order"
          name="order"
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Active"
          name="active"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </Form>
    </Edit>
  );
}

