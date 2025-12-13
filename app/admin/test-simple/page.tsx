"use client";

import { useState, useEffect } from "react";
import { InputNumber, Button, message, Card } from "antd";

export default function SimpleTestPage() {
  const [stockQuantity, setStockQuantity] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  // Load current value
  useEffect(() => {
    fetch('/api/products/2')
      .then(res => res.json())
      .then(data => {
        if (data.data) {
          setStockQuantity(data.data.stockQuantity || 0);
        }
      })
      .catch(err => {
        console.error('Load error:', err);
        message.error('Failed to load');
      });
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/products/2', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stockQuantity: stockQuantity,
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to save');
      }

      message.success('Saved successfully!');
      console.log('✅ Save result:', result);
    } catch (err: any) {
      console.error('❌ Save error:', err);
      setError(err);
      message.error(err.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 600, position: 'relative' }}>
      <Card title="SIMPLE TEST - No Refine, Just Fetch">
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 8 }}>
            Stock Quantity
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
          {loading ? "Saving..." : "Save"}
        </Button>

        {error && (
          <div style={{ marginTop: 16, padding: 12, background: "#fff2f0", border: "1px solid #ffccc7", borderRadius: 4 }}>
            <p style={{ margin: 0, color: "#cf1322", fontWeight: "bold" }}>Error:</p>
            <pre style={{ marginTop: 8, fontSize: 12, overflow: "auto" }}>
              {JSON.stringify(error, null, 2)}
            </pre>
          </div>
        )}

        <div style={{ marginTop: 16, padding: 12, background: "#f5f5f5", borderRadius: 4 }}>
          <p style={{ margin: 0, fontSize: 12 }}>
            <strong>Current value:</strong> {stockQuantity}
          </p>
        </div>
      </Card>

      {/* DEBUG BUTTON */}
      <Button
        type="primary"
        danger
        onClick={() => {
          const debugInfo = JSON.stringify({
            error: error,
            stockQuantity: stockQuantity,
            loading: loading,
            timestamp: new Date().toISOString()
          }, null, 2);
          console.log('🐛 DEBUG:', debugInfo);
          navigator.clipboard.writeText(debugInfo);
          message.success('Copied to clipboard!');
        }}
        style={{ 
          position: 'fixed', 
          bottom: 20, 
          right: 20, 
          zIndex: 999999,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}
      >
        🐛 Debug {error ? '(ERROR!)' : ''}
      </Button>
    </div>
  );
}
