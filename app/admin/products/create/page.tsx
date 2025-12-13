"use client";

import { Create, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber, Switch, Select, Space, Button, Checkbox, Row, Col } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { Product } from "@/lib/types/admin";
import { useEffect, useState } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function ProductCreate() {
  const { formProps, saveButtonProps } = useForm<Product>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const result = await response.json();
        if (result.data && Array.isArray(result.data)) {
          setCategories(result.data.map((cat: any) => ({
            id: String(cat.id),
            name: cat.name,
            slug: cat.slug,
          })));
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Transform form data before submission
  const handleFinish = async (values: any) => {
    // Transform additional info fields into the expected format
    const additionalInfo = {
      weight: values.weight || '',
      dimensions: values.dimensions || '',
      material: values.material || '',
      careInstructions: values.careInstructions || '',
    };

    // Remove individual fields and add additionalInfo object
    const { weight, dimensions, material, careInstructions, ...restValues } = values;
    
    const transformedValues = {
      ...restValues,
      additionalInfo,
    };

    // Call the original form submit handler
    if (formProps.onFinish) {
      return formProps.onFinish(transformedValues);
    }
  };

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true }]}
        >
          <Input placeholder="Product name" />
        </Form.Item>

        <Form.Item
          label="SKU"
          name="sku"
          rules={[{ required: true }]}
        >
          <Input placeholder="Product SKU" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={6} placeholder="Product description" />
        </Form.Item>

        <Form.Item
          label="Price"
          name="price"
          rules={[{ required: true }]}
        >
          <InputNumber
            min={0}
            step={0.01}
            style={{ width: "100%" }}
            prefix="$"
          />
        </Form.Item>

        <Form.Item
          label="Currency"
          name="currency"
          initialValue="EUR"
        >
          <Select>
            <Select.Option value="EUR">EUR (Base Currency)</Select.Option>
            <Select.Option value="USD">USD (Auto-converted)</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Stock Quantity"
          name="stockQuantity"
          initialValue={0}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Images (URLs)">
          <Form.List name="images" initialValue={["/images/product-3.jpg", "/images/product-3-img-1.jpg"]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: "flex", marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={name}
                      rules={[{ required: true, message: "Missing image URL" }]}
                    >
                      <Input placeholder="Image URL" style={{ width: 400 }} />
                    </Form.Item>
                    <MinusCircleOutlined 
                      className="dynamic-delete-button"
                      onClick={() => remove(name)} 
                      style={{ cursor: "pointer", color: "#999" }}
                    />
                  </Space>
                ))}
                <Form.Item>
                  <Button 
                    type="dashed" 
                    onClick={() => add()} 
                    block 
                    icon={<PlusOutlined />}
                  >
                    Add Image URL
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form.Item>

        <Form.Item
          label="Categories"
          name="categoryIds"
        >
          <Checkbox.Group style={{ width: '100%' }}>
            <Row gutter={[16, 8]}>
              {loadingCategories ? (
                <Col span={24}>
                  <span style={{ color: '#999' }}>Loading categories...</span>
                </Col>
              ) : categories.length === 0 ? (
                <Col span={24}>
                  <span style={{ color: '#999' }}>No categories available</span>
                </Col>
              ) : (
                categories.map((category) => (
                  <Col key={category.id} xs={24} sm={12} md={8} lg={6}>
                    <Checkbox value={category.id}>
                      {category.name}
                    </Checkbox>
                  </Col>
                ))
              )}
            </Row>
          </Checkbox.Group>
        </Form.Item>

        <Form.Item
          label="Tags"
          name="tags"
          tooltip="Enter tags separated by commas or press Enter to add each tag"
        >
          <Select
            mode="tags"
            placeholder="Add tags (press Enter to add)"
            style={{ width: '100%' }}
            tokenSeparators={[',']}
          />
        </Form.Item>

        <Form.Item
          label="Weight"
          name="weight"
        >
          <Input placeholder="e.g., 0.3 kg" />
        </Form.Item>

        <Form.Item
          label="Dimensions"
          name="dimensions"
        >
          <Input placeholder="e.g., 15 x 15 x 20 cm" />
        </Form.Item>

        <Form.Item
          label="Material"
          name="material"
        >
          <Input placeholder="e.g., Clay" />
        </Form.Item>

        <Form.Item
          label="Care Instructions"
          name="careInstructions"
        >
          <Input.TextArea 
            rows={3} 
            placeholder="e.g., Hand wash only" 
          />
        </Form.Item>

        <Form.Item
          label="Active"
          name="active"
          valuePropName="checked"
          initialValue={true}
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="SEO Meta Title"
          name="metaTitle"
        >
          <Input placeholder="SEO title" />
        </Form.Item>

        <Form.Item
          label="SEO Meta Description"
          name="metaDescription"
        >
          <Input.TextArea rows={2} placeholder="SEO description" />
        </Form.Item>
      </Form>
    </Create>
  );
}

