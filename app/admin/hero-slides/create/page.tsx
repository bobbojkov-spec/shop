"use client";

import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Switch, InputNumber, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { HeroSlide } from "@/lib/types/admin";

export default function HeroSlideCreate() {
  const { formProps, saveButtonProps } = useForm<HeroSlide>();

  return (
    <Create saveButtonProps={saveButtonProps}>
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
          initialValue="/images/h3-slide-1.jpg"
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

