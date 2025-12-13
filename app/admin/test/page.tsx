"use client";

import { useState, useEffect } from "react";
import { InputNumber, Button, message, Card, Space } from "antd";
import { useUpdate } from "@refinedev/core";

export default function TestPage() {
  const [stockQuantity, setStockQuantity] = useState<number>(0);
  const [productId] = useState<number>(2); // Fixed product ID for testing
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const { mutate: updateProduct } = useUpdate();

  // Fetch current stock quantity
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${productId}`);
        const result = await response.json();
        if (result.data) {
          setStockQuantity(result.data.stockQuantity || 0);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        message.error("Failed to load product");
      } finally {
        setInitialLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await new Promise<void>((resolve, reject) => {
        updateProduct(
          {
            resource: "products",
            id: String(productId),
            values: {
              stockQuantity: stockQuantity,
            },
          },
          {
            onSuccess: (data) => {
              console.log("✅ Save successful:", data);
              message.success("Stock quantity saved successfully!");
              resolve();
            },
            onError: (error: any) => {
              console.error("❌ Save failed:", error);
              const errorMessage =
                error?.response?.data?.error ||
                error?.message ||
                "Failed to update product";
              const errorDetails = error?.response?.data?.details || "";
              message.error(
                `${errorMessage}${errorDetails ? ": " + errorDetails : ""}`
              );
              reject(error);
            },
          }
        );
      });
    } catch (error) {
      console.error("Error in handleSave:", error);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div style={{ padding: 24 }}>
        <Card>
          <p>Loading...</p>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 600 }}>
      <Card title="Test: Update Stock Quantity" style={{ marginBottom: 24 }}>
        <Space orientation="vertical" style={{ width: "100%" }} size="large">
          <div>
            <label style={{ display: "block", marginBottom: 8 }}>
              Stock Quantity (Product ID: {productId})
            </label>
            <InputNumber
              value={stockQuantity}
              onChange={(value) => setStockQuantity(value || 0)}
              min={0}
              style={{ width: "100%" }}
              size="large"
            />
          </div>
          <Button
            type="primary"
            onClick={handleSave}
            loading={loading}
            size="large"
            block
          >
            {loading ? "Saving..." : "Save Stock Quantity"}
          </Button>
          <div style={{ marginTop: 16, padding: 12, background: "#f5f5f5", borderRadius: 4 }}>
            <p style={{ margin: 0, fontSize: 12, color: "#666" }}>
              <strong>Current value:</strong> {stockQuantity}
            </p>
            <p style={{ margin: "8px 0 0 0", fontSize: 12, color: "#666" }}>
              Try changing the value and clicking Save multiple times to test.
            </p>
          </div>
        </Space>
      </Card>
    </div>
  );
}
