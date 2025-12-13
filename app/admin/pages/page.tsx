"use client";

import { List, useTable, EditButton, DeleteButton, ShowButton } from "@refinedev/antd";
import { Table, Space, Button, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigation } from "@refinedev/core";

export default function PagesList() {
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
          onClick={() => create("pages")}
        >
          Create Page
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
          dataIndex="pageType"
          title="Type"
          render={(type: string) => {
            const colors: Record<string, string> = {
              home: "blue",
              about: "green",
              contact: "orange",
              custom: "default",
            };
            return <Tag color={colors[type]}>{type?.toUpperCase()}</Tag>;
          }}
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

