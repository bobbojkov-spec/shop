"use client";

import { Create, useForm } from "@refinedev/antd";
import { Form, Upload, Input, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { MediaFile } from "@/lib/types/admin";
import type { UploadProps } from "antd";

export default function MediaUpload() {
  const { formProps, saveButtonProps } = useForm<MediaFile>();

  const uploadProps: UploadProps = {
    name: "file",
    action: "/api/media/upload",
    onChange(info) {
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
        const url = info.file.response?.url;
        if (url && formProps.form) {
          formProps.form.setFieldsValue({ url });
        }
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Upload File"
          name="file"
          rules={[{ required: true }]}
        >
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          label="File URL"
          name="url"
          rules={[{ required: true }]}
        >
          <Input placeholder="File URL (auto-filled after upload)" />
        </Form.Item>

        <Form.Item
          label="Alt Text"
          name="alt"
        >
          <Input placeholder="Alt text for images" />
        </Form.Item>

        <Form.Item
          label="Caption"
          name="caption"
        >
          <Input.TextArea rows={2} placeholder="File caption" />
        </Form.Item>
      </Form>
    </Create>
  );
}

