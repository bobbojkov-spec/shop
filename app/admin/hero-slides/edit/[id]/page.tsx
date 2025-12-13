"use client";

import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Switch, InputNumber } from "antd";
import { HeroSlide } from "@/lib/types/admin";
import { use } from "react";

interface EditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function HeroSlideEdit({ params }: EditPageProps) {
  const { id } = use(params);
  const { formProps, saveButtonProps } = useForm<HeroSlide>({
    resource: "hero-slides",
    id,
  });

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true }]}
        >
          <Input placeholder="Enter slide title" />
        </Form.Item>

        <Form.Item
          label="Subtitle"
          name="subtitle"
        >
          <Input placeholder="Enter subtitle" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
        >
          <Input.TextArea rows={4} placeholder="Enter description" />
        </Form.Item>

        <Form.Item
          label="Background Image URL"
          name="backgroundImage"
          rules={[{ required: true }]}
        >
          <Input placeholder="Enter image URL" />
        </Form.Item>

        <Form.Item
          label="CTA Text"
          name="ctaText"
        >
          <Input placeholder="e.g., Learn More" />
        </Form.Item>

        <Form.Item
          label="CTA Link"
          name="ctaLink"
        >
          <Input placeholder="/shop or /about-us" />
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

