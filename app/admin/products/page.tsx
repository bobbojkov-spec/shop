"use client";

import { List, useTable, EditButton, DeleteButton, ShowButton } from "@refinedev/antd";
import { Table, Space, Button, Image, Switch } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigation } from "@refinedev/core";

export default function ProductsList() {
  const { tableProps } = useTable({
    resource: "products",
    syncWithLocation: true,
  });

  const { create } = useNavigation();

  // Fix deprecation: convert position to placement
  const paginationConfig = tableProps?.pagination ? { ...tableProps.pagination } : {};
  if ('position' in paginationConfig) {
    paginationConfig.placement = paginationConfig.position;
    delete paginationConfig.position;
  }

  return (
    <List
      headerButtons={[
        <Button
          key="create"
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => create("products")}
        >
          Create Product
        </Button>,
      ]}
    >
      <Table
        {...tableProps}
        rowKey="id"
        pagination={paginationConfig}
      >
        <Table.Column
          dataIndex="sku"
          title="SKU"
          width={120}
        />
        <Table.Column
          dataIndex="name"
          title="Name"
          sorter
        />
        <Table.Column
          dataIndex="images"
          title="Image"
          render={(images: string[]) => (
            images && Array.isArray(images) && images[0] ? (
              <Image
                src={images[0]}
                alt="Product"
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
          dataIndex="price"
          title="Price"
          render={(price: number) => {
            const priceValue = typeof price === 'number' ? price : (typeof price === 'string' ? parseFloat(price) : 0);
            return `€${priceValue.toFixed(2)}`;
          }}
          sorter
          width={120}
        />
        <Table.Column
          dataIndex="stockQuantity"
          title="Stock"
          sorter
          width={100}
        />
        <Table.Column
          dataIndex="active"
          title="Active"
          render={(active: boolean) => (
            <Switch checked={active === true || active === 1} disabled size="small" />
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
