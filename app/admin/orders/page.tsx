"use client";

import { List, useTable } from "@refinedev/antd";
import { Table, Space, Button, Tag } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigation } from "@refinedev/core";

export default function OrdersList() {
  const { tableProps } = useTable({
    syncWithLocation: true,
  });

  const { show, edit, create } = useNavigation();

  return (
    <List
      headerButtons={[
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => create("orders")}
        >
          Create Order
        </Button>,
      ]}
    >
      <Table {...tableProps} rowKey="id">
        <Table.Column
          dataIndex="id"
          title="Order ID"
          sorter
        />
        <Table.Column
          dataIndex="customer"
          title="Customer"
          sorter
        />
        <Table.Column
          dataIndex="total"
          title="Total"
          sorter
          render={(value) => `$${value || 0}`}
        />
        <Table.Column
          dataIndex="status"
          title="Status"
          render={(status) => (
            <Tag color={status === "completed" ? "green" : "orange"}>
              {status || "pending"}
            </Tag>
          )}
        />
        <Table.Column
          title="Actions"
          dataIndex="actions"
          render={(_, record: any) => (
            <Space>
              <Button
                icon={<EyeOutlined />}
                onClick={() => show("orders", record.id)}
              >
                View
              </Button>
              <Button
                icon={<EditOutlined />}
                onClick={() => edit("orders", record.id)}
              >
                Edit
              </Button>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => {
                  // Delete functionality will be implemented later
                }}
              >
                Delete
              </Button>
            </Space>
          )}
        />
      </Table>
    </List>
  );
}

