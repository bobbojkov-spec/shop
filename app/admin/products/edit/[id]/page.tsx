"use client";
import DebugWindow from "@/components/DebugWindow";

import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber, Switch, Select, Space, Button, Checkbox, Row, Col, Tabs, Image, Modal, Upload, message } from "antd";
import { PlusOutlined, MinusCircleOutlined, EditOutlined, UploadOutlined } from "@ant-design/icons";
import { Product } from "@/lib/types/admin";
import { useEffect, use, useState } from "react";
import { useInvalidate, useUpdate } from "@refinedev/core";
import type { UploadFile } from "antd";

interface EditPageProps {
  params: Promise<{
    id: string;
  }>;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function ProductEdit({ params }: EditPageProps) {
  const { id } = use(params);
  const { formProps, saveButtonProps, queryResult, form } = useForm<Product>({
    resource: "products",
    id,
  });
  const invalidate = useInvalidate();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdate<Product>();

  const isLoading = queryResult?.isLoading ?? false;
  // The data provider already unwraps the data, so queryResult.data is the product directly
  // But useForm provides data in formProps.initialValues when queryResult.data is undefined
  const productData = queryResult?.data || formProps?.initialValues;
  
  console.log('📦 Raw queryResult:', {
    hasData: !!queryResult?.data,
    dataType: typeof queryResult?.data,
    dataKeys: queryResult?.data && typeof queryResult.data === 'object' ? Object.keys(queryResult.data) : [],
    productDataPrice: productData?.price,
    productDataStockQuantity: productData?.stockQuantity,
    productDataAdditionalInfo: productData?.additionalInfo,
    productDataImages: productData?.images,
    fullProductData: productData,
  });
  const [saveError, setSaveError] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [activeTab, setActiveTab] = useState('info');
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imagePool, setImagePool] = useState<Array<{ id: string; filename: string; url: string }>>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [usdPrice, setUsdPrice] = useState<string>('');
  const [showUploadInput, setShowUploadInput] = useState(false);
  const [uploadImageUrl, setUploadImageUrl] = useState('');

  // Calculate USD price from EUR
  const calculateUSDPrice = async (eurPrice: number) => {
    if (!eurPrice || typeof eurPrice !== 'number') {
      setUsdPrice('');
      return;
    }
    
    try {
      // Fetch live exchange rate
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/EUR');
      const data = await response.json();
      const rate = data.rates?.USD || 1.08; // Fallback to 1.08 if API fails
      const usd = (eurPrice * rate).toFixed(2);
      setUsdPrice(`≈ $${usd} USD`);
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
      // Use fallback rate
      const usd = (eurPrice * 1.08).toFixed(2);
      setUsdPrice(`≈ $${usd} USD`);
    }
  };

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

  // Fetch image pool
  const fetchImagePool = async () => {
    try {
      setLoadingImages(true);
      const response = await fetch('/api/media/pool');
      const result = await response.json();
      if (result.data && Array.isArray(result.data)) {
        setImagePool(result.data);
      }
    } catch (error) {
      console.error('Error fetching image pool:', error);
    } finally {
      setLoadingImages(false);
    }
  };

  // Thumbnail will be handled reactively in the headerButtons

  // Ensure images and additional info fields are initialized
  useEffect(() => {
    if (!isLoading && form && productData) {
      console.log('🔄 Initializing form with productData:', {
        price: productData.price,
        priceType: typeof productData.price,
        stockQuantity: productData.stockQuantity,
        stockQuantityType: typeof productData.stockQuantity,
        additionalInfo: productData.additionalInfo,
        images: productData.images,
      });
      
      // Function to set form values - will be called multiple times to ensure it works
      const setFormValues = () => {
        // Normalize images to always be an array
        const images = Array.isArray(productData.images) 
          ? productData.images 
          : productData.images 
            ? [productData.images] 
            : [];
        
        // Prepare values to set - FORCE SET ALL VALUES
        const valuesToSet: any = {};
        
        // ALWAYS set price (same method as stockQuantity) - FORCE SET
        const priceValue = productData.price !== undefined && productData.price !== null
          ? (typeof productData.price === 'string' ? parseFloat(productData.price) : Number(productData.price))
          : 0;
        // Always set price, even if 0 (same as stockQuantity)
        // Make sure price is a number, not string
        const finalPrice = !isNaN(priceValue) && priceValue !== null && priceValue !== undefined ? Number(priceValue) : 0;
        valuesToSet.price = finalPrice;
        form.setFieldValue('price', finalPrice);
        console.log('💰 Setting price in form:', { 
          productDataPrice: productData.price, 
          priceValue, 
          finalPrice,
          stockQuantity: productData.stockQuantity 
        });
        
        // ALWAYS set stock quantity
        const stockValue = productData.stockQuantity !== undefined && productData.stockQuantity !== null
          ? (typeof productData.stockQuantity === 'string' ? parseInt(productData.stockQuantity) : Number(productData.stockQuantity))
          : 0;
        valuesToSet.stockQuantity = stockValue;
        form.setFieldValue('stockQuantity', stockValue);
        
        // Always set images (Form.List needs at least one field)
        valuesToSet.images = images.length > 0 ? images : [""];
        
        // FORCE SET additional info fields - SAME METHOD AS stockQuantity
        const weight = productData.additionalInfo?.weight !== undefined && productData.additionalInfo?.weight !== null
          ? String(productData.additionalInfo.weight)
          : '';
        const dimensions = productData.additionalInfo?.dimensions !== undefined && productData.additionalInfo?.dimensions !== null
          ? String(productData.additionalInfo.dimensions)
          : '';
        const material = productData.additionalInfo?.material !== undefined && productData.additionalInfo?.material !== null
          ? String(productData.additionalInfo.material)
          : '';
        const careInstructions = productData.additionalInfo?.careInstructions !== undefined && productData.additionalInfo?.careInstructions !== null
          ? String(productData.additionalInfo.careInstructions)
          : '';
        
        console.log('📝 DEBUG additionalInfo PROCESSED:', { weight, dimensions, material, careInstructions });
        
        // Set them in valuesToSet object (same as stockQuantity)
        valuesToSet.weight = weight;
        valuesToSet.dimensions = dimensions;
        valuesToSet.material = material;
        valuesToSet.careInstructions = careInstructions;
        
        // Set them directly IMMEDIATELY (same as stockQuantity)
        form.setFieldValue('weight', weight);
        form.setFieldValue('dimensions', dimensions);
        form.setFieldValue('material', material);
        form.setFieldValue('careInstructions', careInstructions);
        
        console.log('📝 Setting additional info (same method as stockQuantity):', { weight, dimensions, material, careInstructions });
        
        // Always set currency to EUR (base currency)
        valuesToSet.currency = 'EUR';
        
        // Calculate USD price if EUR price exists (async) - but Form.Item shouldUpdate handles this
        // No need to set state here, the Form.Item will calculate it reactively
        
        // Set tags
        valuesToSet.tags = Array.isArray(productData.tags) ? productData.tags : [];
        
        // Set meta fields
        valuesToSet.metaTitle = productData.metaTitle || '';
        valuesToSet.metaDescription = productData.metaDescription || '';
        form.setFieldValue('metaTitle', productData.metaTitle || '');
        form.setFieldValue('metaDescription', productData.metaDescription || '');
        
        // Set all values - use setFieldsValue with forceUpdate
        form.setFieldsValue(valuesToSet);
        
        // Force set additional info again (same method as stockQuantity - redundant but ensures it works)
        form.setFieldValue('weight', weight);
        form.setFieldValue('dimensions', dimensions);
        form.setFieldValue('material', material);
        form.setFieldValue('careInstructions', careInstructions);
        
        // Force set stockQuantity again (for consistency)
        form.setFieldValue('stockQuantity', stockValue);
        
        // Force set price again (same method as stockQuantity - for consistency)
        // Make sure price is a number, not string (recalculate to ensure it's fresh)
        const finalPriceAgain = !isNaN(priceValue) && priceValue !== null && priceValue !== undefined ? Number(priceValue) : 0;
        form.setFieldValue('price', finalPriceAgain);
        
        // Force set currency
        form.setFieldValue('currency', 'EUR');
        
        // Debug logging
        if (typeof window !== 'undefined') {
          console.log('🔍 FORCE SETTING form values:', {
            price: priceValue,
            productDataPrice: productData.price,
            hasAdditionalInfo: !!productData.additionalInfo,
            weight: productData.additionalInfo?.weight,
            dimensions: productData.additionalInfo?.dimensions,
            material: productData.additionalInfo?.material,
            careInstructions: productData.additionalInfo?.careInstructions,
          });
          
          // Verify what was actually set after a delay
          setTimeout(() => {
            const actualValues = form.getFieldsValue();
            console.log('✅ VERIFIED form values:', {
              price: actualValues.price,
              weight: actualValues.weight,
              dimensions: actualValues.dimensions,
              material: actualValues.material,
              careInstructions: actualValues.careInstructions,
            });
          }, 300);
        }
      };
      
      // Try setting values multiple times with increasing delays to ensure it works
      // Set immediately first
      setFormValues();
      const timer1 = setTimeout(setFormValues, 50);
      const timer2 = setTimeout(setFormValues, 200);
      const timer3 = setTimeout(setFormValues, 500);
      const timer4 = setTimeout(setFormValues, 1000);
      
      // Extra aggressive price setting - same as stockQuantity
      const setPriceOnly = () => {
        if (productData && productData.price !== undefined && productData.price !== null) {
          const priceVal = typeof productData.price === 'string' ? parseFloat(productData.price) : Number(productData.price);
          if (!isNaN(priceVal)) {
            form.setFieldValue('price', priceVal);
            console.log('💰 Extra price set:', priceVal);
          }
        }
      };
      const timer5 = setTimeout(setPriceOnly, 100);
      const timer6 = setTimeout(setPriceOnly, 300);
      const timer7 = setTimeout(setPriceOnly, 800);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
        clearTimeout(timer5);
        clearTimeout(timer6);
        clearTimeout(timer7);
      };
    }
  }, [isLoading, form, productData, formProps?.initialValues]);

  // Transform form data before submission
  const handleFinish = async (values: any) => {
    console.log('💾 Saving product with values:', values);
    
    // Transform additional info fields into the expected format
    const additionalInfo = {
      weight: values.weight || '',
      dimensions: values.dimensions || '',
      material: values.material || '',
      careInstructions: values.careInstructions || '',
    };

    // Remove individual fields and add additionalInfo object
    const { weight, dimensions, material, careInstructions, ...restValues } = values;
    
    // Ensure categoryIds is an array (Checkbox.Group returns array)
    const categoryIds = Array.isArray(values.categoryIds) 
      ? values.categoryIds 
      : values.categoryIds 
        ? [values.categoryIds] 
        : [];
    
    // Ensure tags is an array
    const tags = Array.isArray(values.tags) 
      ? values.tags 
      : values.tags 
        ? [values.tags] 
        : [];
    
    // Ensure images is an array
    const images = Array.isArray(values.images) 
      ? values.images.filter((img: string) => img && img.trim() !== '')
      : [];
    
    // Ensure price is a number
    const price = values.price !== undefined && values.price !== null
      ? (typeof values.price === 'string' ? parseFloat(values.price) : Number(values.price))
      : 0;
    
    // Ensure stockQuantity is a number
    const stockQuantity = values.stockQuantity !== undefined && values.stockQuantity !== null
      ? (typeof values.stockQuantity === 'string' ? parseInt(values.stockQuantity) : Number(values.stockQuantity))
      : 0;
    
    const transformedValues = {
      ...restValues,
      price, // Explicitly include price
      currency: 'EUR', // Always EUR
      stockQuantity, // Explicitly include stockQuantity
      categoryIds, // Ensure it's an array
      tags, // Ensure it's an array
      images, // Ensure it's an array
      additionalInfo,
      // Ensure meta fields are included
      metaTitle: values.metaTitle || '',
      metaDescription: values.metaDescription || '',
    };

    console.log('💾 Transformed values to save:', transformedValues);

    // Use Refine's update mutation
    return new Promise((resolve, reject) => {
      updateProduct(
        {
          resource: "products",
          id: id,
          values: transformedValues,
        },
        {
          onSuccess: (data) => {
            console.log('✅ Save successful:', data);
            message.success('Product updated successfully');
            
            // Invalidate queries to refresh the data
            invalidate({
              resource: "products",
              invalidates: ["list", "detail"],
              id: id,
            });
            
            // Refetch the current product data
            setSaveError(null); // Clear error on success
            queryResult?.refetch();
            
            resolve(data);
          },
          onError: (error: any) => {
            setSaveError(error);
            console.error('❌ Save failed:', error);
            const errorMessage = (error && typeof error === 'object' && error?.response?.data?.error) || (error?.message) || 'Failed to update product';
            const errorDetails = (error && typeof error === 'object' && error?.response?.data?.details) || '';
            message.error(`${errorMessage}${errorDetails ? ': ' + errorDetails : ''}`);
            reject(error);
          },
        }
      );
    });
  };

  // Handle image selection from pool - ALWAYS add as FIRST image
  const handleSelectImage = (imageUrl: string) => {
    const currentImages = form.getFieldValue('images') || [];
    const imageArray = Array.isArray(currentImages) ? currentImages.filter((img: string) => img && img.trim() !== '') : [];
    // Put selected image at the beginning (for thumbnail and first gallery image)
    form.setFieldsValue({ images: [imageUrl, ...imageArray] });
    setImageModalVisible(false);
    message.success('Image added as first image');
  };

  // Prepare initial values with flattened additionalInfo - FORCE include these fields
  // Don't include currency here to avoid conflict with Form.Item initialValue
  const formInitialValues = productData && !isLoading ? {
    // Start with formProps.initialValues but override with productData
    ...formProps.initialValues,
    // CRITICAL: Force set price from productData (same method as stockQuantity)
    price: productData.price !== undefined && productData.price !== null
      ? (typeof productData.price === 'string' ? parseFloat(productData.price) : Number(productData.price))
      : 0, // Default to 0 if null/undefined (same as stockQuantity)
    // Force set stock quantity (handle null/undefined) - same method for all fields
    stockQuantity: productData.stockQuantity !== undefined && productData.stockQuantity !== null
      ? (typeof productData.stockQuantity === 'string' ? parseInt(productData.stockQuantity) : Number(productData.stockQuantity))
      : 0, // Default to 0 if null/undefined
    // Force set these values from productData - SAME METHOD AS stockQuantity (handle null/undefined)
    weight: productData.additionalInfo?.weight !== undefined && productData.additionalInfo?.weight !== null
      ? String(productData.additionalInfo.weight)
      : '',
    dimensions: productData.additionalInfo?.dimensions !== undefined && productData.additionalInfo?.dimensions !== null
      ? String(productData.additionalInfo.dimensions)
      : '',
    material: productData.additionalInfo?.material !== undefined && productData.additionalInfo?.material !== null
      ? String(productData.additionalInfo.material)
      : '',
    careInstructions: productData.additionalInfo?.careInstructions !== undefined && productData.additionalInfo?.careInstructions !== null
      ? String(productData.additionalInfo.careInstructions)
      : '',
    // Set images
    images: Array.isArray(productData.images) && productData.images.length > 0 ? productData.images : [''],
    // Set tags
    tags: Array.isArray(productData.tags) ? productData.tags : [],
    // Set meta fields (handle null/undefined)
    metaTitle: productData.metaTitle || '',
    metaDescription: productData.metaDescription || '',
    // Don't set currency here - let it be set by the form field or useEffect
  } : formProps.initialValues;

  // Debug: Log formInitialValues to see if price is there
  if (typeof window !== 'undefined' && formInitialValues) {
    console.log('📋 Form initial values:', {
      hasPrice: 'price' in formInitialValues,
      price: formInitialValues.price,
      priceType: typeof formInitialValues.price,
      hasStockQuantity: 'stockQuantity' in formInitialValues,
      stockQuantity: formInitialValues.stockQuantity,
    });
  }

  return (
    <Edit 
      saveButtonProps={{
        ...saveButtonProps,
        loading: isUpdating,
        children: isUpdating ? 'Saving...' : 'Save',
      }} 
      isLoading={isLoading}
      headerButtons={
        <Space>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {productData?.images?.[0] ? (
              <Image
                src={productData.images[0]}
                alt="Product thumbnail"
                width={60}
                height={60}
                style={{ objectFit: "cover", borderRadius: "4px" }}
              />
            ) : (
              <div
                style={{
                  width: 60,
                  height: 60,
                  backgroundColor: '#f0f0f0',
                  borderRadius: 4,
                  border: '1px solid #d9d9d9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#999',
                  fontSize: 12,
                }}
              >
                No Image
              </div>
            )}
            <Button
              size="small"
              icon={productData?.images?.[0] ? <EditOutlined /> : <UploadOutlined />}
              onClick={() => {
                fetchImagePool();
                setImageModalVisible(true);
              }}
            >
              {productData?.images?.[0] ? 'Edit' : 'Add'}
            </Button>
          </div>
        </Space>
      }
    >
      <Form 
        {...formProps}
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={formInitialValues}
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'info',
              label: 'Product Info',
              children: (
                <>
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
                    label="Price (EUR)"
                    name="price"
                    rules={[{ required: true }]}
                  >
                    <InputNumber min={0} style={{ width: "100%" }} />
                  </Form.Item>

                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) => prevValues.price !== currentValues.price}
                  >
                    {({ getFieldValue }) => {
                      const eurPrice = getFieldValue('price');
                      if (!eurPrice || typeof eurPrice !== 'number') {
                        return null;
                      }
                      // Calculate USD on the fly (using 1.08 as conversion rate)
                      const usd = (eurPrice * 1.08).toFixed(2);
                      return (
                        <div style={{ marginTop: -16, marginBottom: 16, fontSize: 12, color: '#666' }}>
                          ≈ ${usd} USD
                        </div>
                      );
                    }}
                  </Form.Item>

                  <Form.Item
                    label="Stock Quantity"
                    name="stockQuantity"
                  >
                    <InputNumber min={0} style={{ width: "100%" }} />
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
                  >
                    <Switch />
                  </Form.Item>
                </>
              ),
            },
            {
              key: 'images',
              label: 'Product Images',
              children: (
                <>
                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) => prevValues.images !== currentValues.images}
                  >
                    {({ getFieldValue }) => {
                      const images = getFieldValue('images') || [];
                      const imageArray = Array.isArray(images) ? images.filter((img: string) => img && img.trim() !== '') : [];
                      
                      return (
                        <>
                          <div style={{ marginBottom: 16 }}>
                            <Space wrap>
                              {imageArray.length > 0 ? (
                                imageArray.map((url: string, index: number) => (
                                  <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
                                    <Image
                                      src={url}
                                      alt={`Product image ${index + 1}`}
                                      width={100}
                                      height={100}
                                      style={{ objectFit: "cover", borderRadius: "4px" }}
                                    />
                                    <Button
                                      type="text"
                                      danger
                                      size="small"
                                      icon={<MinusCircleOutlined />}
                                      onClick={() => {
                                        const currentImages = getFieldValue('images') || [];
                                        const newImages = currentImages.filter((_: string, i: number) => i !== index);
                                        form.setFieldsValue({ images: newImages.length > 0 ? newImages : [''] });
                                      }}
                                      style={{
                                        position: 'absolute',
                                        top: -8,
                                        right: -8,
                                        backgroundColor: 'white',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                      }}
                                    />
                                  </div>
                                ))
                              ) : (
                                <span style={{ color: "#999" }}>No images</span>
                              )}
                            </Space>
                          </div>
                          
                          <Space direction="vertical" style={{ width: '100%', marginTop: 16 }}>
                            <Space>
                              <Button
                                type="default"
                                onClick={() => {
                                  fetchImagePool();
                                  setImageModalVisible(true);
                                }}
                                icon={<UploadOutlined />}
                              >
                                Load from Pool
                              </Button>
                            <Upload
                              name="file"
                              accept="image/*"
                              showUploadList={false}
                              customRequest={async ({ file, onSuccess, onError }) => {
                                try {
                                  const formData = new FormData();
                                  formData.append('file', file as File);
                                  
                                  const response = await fetch('/api/media/upload', {
                                    method: 'POST',
                                    body: formData,
                                  });
                                  
                                  if (!response.ok) {
                                    throw new Error('Upload failed');
                                  }
                                  
                                  const result = await response.json();
                                  const imageUrl = result.data?.original || result.data?.smallThumb || '';
                                  
                                  if (imageUrl) {
                                    // ALWAYS add as FIRST image (for thumbnail and gallery)
                                    const currentImages = getFieldValue('images') || [];
                                    const imageArray = Array.isArray(currentImages) ? currentImages.filter((img: string) => img && img.trim() !== '') : [];
                                    // Put new image at the beginning
                                    form.setFieldsValue({ images: [imageUrl, ...imageArray] });
                                    message.success('Image uploaded and added as first image');
                                  }
                                  
                                  onSuccess?.(result);
                                } catch (error) {
                                  console.error('Upload error:', error);
                                  message.error('Failed to upload image');
                                  onError?.(error as Error);
                                }
                              }}
                            >
                              <Button
                                type="primary"
                                icon={<PlusOutlined />}
                              >
                                Upload
                              </Button>
                            </Upload>
                            </Space>
                            
                            {showUploadInput && (
                              <Space.Compact style={{ width: '100%', maxWidth: 500 }}>
                                <Input
                                  placeholder="Enter image URL (e.g., /images/product.jpg)"
                                  value={uploadImageUrl}
                                  onChange={(e) => setUploadImageUrl(e.target.value)}
                                  onPressEnter={() => {
                                    if (uploadImageUrl.trim()) {
                                      const currentImages = getFieldValue('images') || [];
                                      const imageArray = Array.isArray(currentImages) ? currentImages.filter((img: string) => img && img.trim() !== '') : [];
                                      form.setFieldsValue({ images: [...imageArray, uploadImageUrl.trim()] });
                                      setUploadImageUrl('');
                                      setShowUploadInput(false);
                                    }
                                  }}
                                />
                                <Button
                                  type="primary"
                                  onClick={() => {
                                    if (uploadImageUrl.trim()) {
                                      const currentImages = getFieldValue('images') || [];
                                      const imageArray = Array.isArray(currentImages) ? currentImages.filter((img: string) => img && img.trim() !== '') : [];
                                      form.setFieldsValue({ images: [...imageArray, uploadImageUrl.trim()] });
                                      setUploadImageUrl('');
                                      setShowUploadInput(false);
                                    }
                                  }}
                                >
                                  Add
                                </Button>
                                <Button
                                  onClick={() => {
                                    setShowUploadInput(false);
                                    setUploadImageUrl('');
                                  }}
                                >
                                  Cancel
                                </Button>
                              </Space.Compact>
                            )}
                          </Space>
                          
                          {/* Hidden Form.List to store image URLs */}
                          <Form.List name="images" style={{ display: 'none' }}>
                            {(fields, { add, remove }) => (
                              <>
                                {fields.map(({ key, name, ...restField }) => (
                                  <Form.Item
                                    key={key}
                                    {...restField}
                                    name={name}
                                    style={{ display: 'none' }}
                                  >
                                    <Input />
                                  </Form.Item>
                                ))}
                              </>
                            )}
                          </Form.List>
                        </>
                      );
                    }}
                  </Form.Item>
                </>
              ),
            },
            {
              key: 'seo',
              label: 'Product SEO',
              children: (
                <>
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
                </>
              ),
            },
          ]}
        />
      </Form>

      {/* Image Selection Modal */}
      <Modal
        title="Select Image from Pool"
        open={imageModalVisible}
        onCancel={() => setImageModalVisible(false)}
        footer={null}
        width={800}
      >
        {loadingImages ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Loading images...</p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
            gap: 16,
            maxHeight: '60vh',
            overflowY: 'auto',
            padding: '16px 0'
          }}>
            {imagePool.map((image) => (
              <div
                key={image.id}
                onClick={() => handleSelectImage(image.url)}
                style={{
                  cursor: 'pointer',
                  border: '2px solid #d9d9d9',
                  borderRadius: 4,
                  padding: 8,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#1890ff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#d9d9d9';
                }}
              >
                <Image
                  src={image.url}
                  alt={image.filename}
                  width={150}
                  height={150}
                  style={{ objectFit: 'cover', width: '100%', height: '150px' }}
                  preview={false}
                />
                <p style={{ 
                  marginTop: 8, 
                  fontSize: 12, 
                  textAlign: 'center',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {image.filename}
                </p>
              </div>
            ))}
          </div>
        )}
      </Modal>
      <DebugWindow error={saveError} />
    </Edit>
  );
}
