"use client";

import { List, useTable, EditButton, DeleteButton, ShowButton } from "@refinedev/antd";
import { Table, Space, Button, Tag, Image, Switch } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigation } from "@refinedev/core";

export default function CategoriesList() {
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
          onClick={() => create("categories")}
        >
          Create Category
        </Button>,
      ]}
    >
      <Table {...tableProps} rowKey="id">
        <Table.Column
          dataIndex="name"
          title="Name"
          sorter
        />
        <Table.Column
          dataIndex="slug"
          title="Slug"
          ellipsis
        />
        <Table.Column
          dataIndex="image"
          title="Image"
          render={(url: string) => (
            url ? (
              <Image
                src={url}
                alt="Category"
                width={60}
                height={60}
                style={{ objectFit: "cover", borderRadius: "4px" }}
              />
            ) : (
              <span style={{ color: "#999" }}>No image</span>
            )
          )}
          width={100}
        />
        <Table.Column
          dataIndex="parentId"
          title="Parent"
          render={(parentId: string) => parentId ? <Tag>Has Parent</Tag> : <Tag color="default">Root</Tag>}
          width={100}
        />
        <Table.Column
          dataIndex="order"
          title="Order"
          sorter
          width={80}
        />
        <Table.Column
          dataIndex="active"
          title="Active"
          render={(active: boolean) => (
            <Switch checked={active} disabled size="small" />
          )}
          width={80}
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

