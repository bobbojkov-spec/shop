"use client";

import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Card } from "antd";
import { SiteSettings } from "@/lib/types/admin";
import { useOne } from "@refinedev/core";

export default function SettingsPage() {
  const { data, isLoading } = useOne<SiteSettings>({
    resource: "settings",
    id: "1",
  });

  const { formProps, saveButtonProps } = useForm<SiteSettings>({
    resource: "settings",
    id: "1",
    queryOptions: {
      enabled: !isLoading && !!data,
    },
  });

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Card title="General Settings" style={{ marginBottom: 24 }}>
          <Form.Item
            label="Site Name"
            name="siteName"
            rules={[{ required: true }]}
          >
            <Input placeholder="Site name" />
          </Form.Item>

          <Form.Item
            label="Logo URL"
            name="logo"
          >
            <Input placeholder="Logo image URL" />
          </Form.Item>

          <Form.Item
            label="Favicon URL"
            name="favicon"
          >
            <Input placeholder="Favicon URL" />
          </Form.Item>
        </Card>

        <Card title="Contact Information" style={{ marginBottom: 24 }}>
          <Form.Item
            label="Contact Email"
            name="contactEmail"
            rules={[{ required: true, type: "email" }]}
          >
            <Input placeholder="contact@example.com" />
          </Form.Item>

          <Form.Item
            label="Contact Phone"
            name="contactPhone"
          >
            <Input placeholder="+1 234 567 8900" />
          </Form.Item>
        </Card>

        <Card title="Social Links" style={{ marginBottom: 24 }}>
          <Form.Item
            label="Facebook"
            name={["socialLinks", "facebook"]}
          >
            <Input placeholder="https://facebook.com/yourpage" />
          </Form.Item>

          <Form.Item
            label="Instagram"
            name={["socialLinks", "instagram"]}
          >
            <Input placeholder="https://instagram.com/yourpage" />
          </Form.Item>

          <Form.Item
            label="Twitter"
            name={["socialLinks", "twitter"]}
          >
            <Input placeholder="https://twitter.com/yourpage" />
          </Form.Item>

          <Form.Item
            label="LinkedIn"
            name={["socialLinks", "linkedin"]}
          >
            <Input placeholder="https://linkedin.com/company/yourpage" />
          </Form.Item>
        </Card>

        <Card title="Footer Content" style={{ marginBottom: 24 }}>
          <Form.Item
            label="Footer Content"
            name="footerContent"
          >
            <Input.TextArea rows={4} placeholder="Footer HTML/text content" />
          </Form.Item>
        </Card>

        <Card title="SEO Defaults" style={{ marginBottom: 24 }}>
          <Form.Item
            label="Default Meta Title"
            name={["seoDefaults", "metaTitle"]}
          >
            <Input placeholder="Default SEO title" />
          </Form.Item>

          <Form.Item
            label="Default Meta Description"
            name={["seoDefaults", "metaDescription"]}
          >
            <Input.TextArea rows={2} placeholder="Default SEO description" />
          </Form.Item>
        </Card>
      </Form>
    </Edit>
  );
}

