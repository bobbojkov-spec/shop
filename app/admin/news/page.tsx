"use client";

import { List, useTable, EditButton, DeleteButton, ShowButton } from "@refinedev/antd";
import { Table, Space, Button, Tag, Image } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigation } from "@refinedev/core";

export default function NewsList() {
  const { tableProps } = useTable({
    syncWithLocation: true,
  });

  const { create } = useNavigation();

  return (
    <List
      headerButtons={[
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => create("news")}
        >
          Create Article
        </Button>,
      ]}
    >
      <Table {...tableProps} rowKey="id">
        <Table.Column
          dataIndex="title"
          title="Title"
          sorter
        />
        <Table.Column
          dataIndex="slug"
          title="Slug"
          ellipsis
        />
        <Table.Column
          dataIndex="featuredImage"
          title="Image"
          render={(url: string) => (
            url ? (
              <Image
                src={url}
                alt="Featured"
                width={80}
                height={60}
                style={{ objectFit: "cover", borderRadius: "4px" }}
              />
            ) : (
              <span style={{ color: "#999" }}>No image</span>
            )
          )}
          width={120}
        />
        <Table.Column
          dataIndex="publishStatus"
          title="Status"
          render={(status: string) => {
            const colors: Record<string, string> = {
              published: "green",
              draft: "orange",
              archived: "default",
            };
            return <Tag color={colors[status]}>{status?.toUpperCase()}</Tag>;
          }}
          width={120}
        />
        <Table.Column
          dataIndex="publishDate"
          title="Publish Date"
          render={(date: string) => date ? new Date(date).toLocaleDateString() : "-"}
          sorter
          width={120}
        />
        <Table.Column
          title="Actions"
          dataIndex="actions"
          render={(_, record: any) => (
            <Space>
              <ShowButton hideText size="small" recordItemId={record.id} />
              <EditButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
}

