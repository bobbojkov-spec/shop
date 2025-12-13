"use client";

import { Create, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber, Switch, Select, TreeSelect } from "antd";
import { Category } from "@/lib/types/admin";

export default function CategoryCreate() {
  const { formProps, saveButtonProps } = useForm<Category>();

  return (
    <Create saveButtonProps={saveButtonProps}>
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
          initialValue="/images/product-3-300x300.jpg"
        >
          <Input placeholder="Category image URL" />
        </Form.Item>

        <Form.Item
          label="Order"
          name="order"
          initialValue={0}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Active"
          name="active"
          valuePropName="checked"
          initialValue={true}
        >
          <Switch />
        </Form.Item>
      </Form>
    </Create>
  );
}

