"use client";

import { List, useTable, EditButton, DeleteButton, ShowButton } from "@refinedev/antd";
import { Table, Space, Button, Switch, Image } from "antd";
import { PlusOutlined, ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { useNavigation, useUpdate, useInvalidate } from "@refinedev/core";

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
  ctaText: string;
  ctaLink: string;
  order: number;
  active: boolean;
}

export default function HeroSlidesList() {
  const { tableProps } = useTable({
    resource: "hero-slides",
    syncWithLocation: true,
  });

  const { create } = useNavigation();
  const { mutate: update } = useUpdate();
  const invalidate = useInvalidate();

  // Get current data from tableProps for reordering
  // Ensure dataSource is an array
  const currentData = Array.isArray(tableProps?.dataSource) 
    ? (tableProps.dataSource as HeroSlide[])
    : [];
  const sortedData = [...currentData].sort((a, b) => (a.order || 0) - (b.order || 0));

  // Handle reordering
  const handleMoveUp = (record: HeroSlide) => {
    const currentIndex = sortedData.findIndex((item) => item.id === record.id);
    if (currentIndex === 0) return;
    const prevRecord = sortedData[currentIndex - 1];
    const newOrder = prevRecord.order || 0;
    const currentOrder = record.order || 0;

    // Swap orders
    update(
      {
        resource: "hero-slides",
        id: record.id,
        values: { order: newOrder },
      },
      {
        onSuccess: () => {
          update(
            {
              resource: "hero-slides",
              id: prevRecord.id,
              values: { order: currentOrder },
            },
            {
              onSuccess: () => {
                invalidate({ resource: "hero-slides", invalidates: ["list"] });
              },
            }
          );
        },
      }
    );
  };

  const handleMoveDown = (record: HeroSlide) => {
    const currentIndex = sortedData.findIndex((item) => item.id === record.id);
    if (currentIndex === sortedData.length - 1) return;
    const nextRecord = sortedData[currentIndex + 1];
    const newOrder = nextRecord.order || 0;
    const currentOrder = record.order || 0;

    // Swap orders
    update(
      {
        resource: "hero-slides",
        id: record.id,
        values: { order: newOrder },
      },
      {
        onSuccess: () => {
          update(
            {
              resource: "hero-slides",
              id: nextRecord.id,
              values: { order: currentOrder },
            },
            {
              onSuccess: () => {
                invalidate({ resource: "hero-slides", invalidates: ["list"] });
              },
            }
          );
        },
      }
    );
  };

  return (
    <List
      title="Hero Slides"
      headerButtons={[
        <Button
          key="create"
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => create("hero-slides")}
        >
          Create Hero Slide
        </Button>,
      ]}
    >
      <Table
        {...tableProps}
        rowKey="id"
        dataSource={sortedData.length > 0 ? sortedData : tableProps?.dataSource}
        pagination={false}
      >
        <Table.Column
          title="Order"
          width={150}
          render={(_, record: HeroSlide) => {
            const currentIndex = sortedData.findIndex((item) => item.id === record.id);
            return (
              <Space>
                <Button
                  type="text"
                  size="small"
                  icon={<ArrowUpOutlined />}
                  onClick={() => handleMoveUp(record)}
                  disabled={currentIndex === 0}
                  title="Move up"
                />
                <span style={{ minWidth: '30px', display: 'inline-block', textAlign: 'center' }}>
                  {record.order || 0}
                </span>
                <Button
                  type="text"
                  size="small"
                  icon={<ArrowDownOutlined />}
                  onClick={() => handleMoveDown(record)}
                  disabled={currentIndex === sortedData.length - 1}
                  title="Move down"
                />
              </Space>
            );
          }}
        />
        <Table.Column
          dataIndex="title"
          title="Title"
          sorter
        />
        <Table.Column
          dataIndex="subtitle"
          title="Subtitle"
          ellipsis
        />
        <Table.Column
          dataIndex="backgroundImage"
          title="Image"
          width={120}
          render={(url: string) =>
            url ? (
              <Image
                src={url}
                alt="Hero slide"
                width={80}
                height={45}
                style={{ objectFit: "cover", borderRadius: "4px" }}
              />
            ) : (
              <span style={{ color: "#999" }}>No image</span>
            )
          }
        />
        <Table.Column
          dataIndex="active"
          title="Active"
          width={80}
          render={(active: boolean) => (
            <Switch checked={!!active} disabled size="small" />
          )}
        />
        <Table.Column
          title="Actions"
          width={150}
          render={(_, record: HeroSlide) => (
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
