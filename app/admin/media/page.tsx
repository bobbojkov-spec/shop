"use client";

import { List, useTable, DeleteButton } from "@refinedev/antd";
import { Table, Space, Button, Image, Upload, Card, Row, Col } from "antd";
import { UploadOutlined, PictureOutlined } from "@ant-design/icons";
import { useNavigation } from "@refinedev/core";
import { MediaFile } from "@/lib/types/admin";

export default function MediaLibrary() {
  const { tableProps } = useTable<MediaFile>({
    resource: "media",
    syncWithLocation: true,
  });

  const { create } = useNavigation();

  return (
    <List
      headerButtons={[
        <Button
          type="primary"
          icon={<UploadOutlined />}
          onClick={() => create("media")}
        >
          Upload Media
        </Button>,
      ]}
    >
      <Table {...tableProps} rowKey="id">
        <Table.Column
          dataIndex="url"
          title="Preview"
          render={(url: string, record: MediaFile) => (
            record.mimeType?.startsWith("image/") ? (
              <Image
                src={url}
                alt={record.alt || record.filename}
                width={80}
                height={80}
                style={{ objectFit: "cover", borderRadius: "4px" }}
              />
            ) : (
              <div style={{ width: 80, height: 80, background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "4px" }}>
                <PictureOutlined style={{ fontSize: 24, color: "#999" }} />
              </div>
            )
          )}
          width={120}
        />
        <Table.Column
          dataIndex="filename"
          title="Filename"
          sorter
        />
        <Table.Column
          dataIndex="mimeType"
          title="Type"
          width={120}
        />
        <Table.Column
          dataIndex="size"
          title="Size"
          render={(size: number) => {
            if (size < 1024) return `${size} B`;
            if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
            return `${(size / (1024 * 1024)).toFixed(2)} MB`;
          }}
          width={100}
        />
        <Table.Column
          dataIndex="width"
          title="Dimensions"
          render={(width: number, record: MediaFile) => 
            width && record.height ? `${width} × ${record.height}` : "-"
          }
          width={120}
        />
        <Table.Column
          title="Actions"
          dataIndex="actions"
          render={(_, record: MediaFile) => (
            <Space>
              <Button
                size="small"
                onClick={() => {
                  navigator.clipboard.writeText(record.url);
                }}
              >
                Copy URL
              </Button>
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
}

