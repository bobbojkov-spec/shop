"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getProductBySlug } from "@/lib/products";
import "./product-detail.css";

interface ProductDetailProps {
  slug: string;
}

export default function ProductDetail({ slug }: ProductDetailProps) {
  const product = getProductBySlug(slug);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [isWishlisted, setIsWishlisted] = useState(false);

  if (!product) {
    return (
      <section className="product-detail-section">
        <div className="product-detail-container">
          <p>Product not found</p>
        </div>
      </section>
    );
  }

  return (
    <section className="product-detail-section">
      <div className="product-detail-container">
        <div className="product-detail-layout">
          {/* Left: Thumbnail Images */}
          <div className="product-thumbnails">
            {product.images.map((image: string, index: number) => (
              <button
                key={index}
                className={`thumbnail-button ${index === selectedImage ? "active" : ""}`}
                onClick={() => setSelectedImage(index)}
                aria-label={`View image ${index + 1}`}
              >
                <Image
                  src={image}
                  alt={`${product.name} view ${index + 1}`}
                  width={100}
                  height={100}
                  className="thumbnail-image"
                />
              </button>
            ))}
          </div>

          {/* Center: Main Product Image */}
          <div className="product-main-image">
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              width={600}
              height={600}
              className="main-product-image"
              priority
            />
          </div>

          {/* Right: Product Info */}
          <div className="product-info-panel">
            <h1 className="product-detail-title">{product.name}</h1>
            
            <div className="product-detail-price">
              {product.onSale && product.originalPrice && (
                <span className="original-price">{product.originalPrice}</span>
              )}
              <span className="current-price">{product.price}</span>
            </div>

            {/* Quantity and Add to Cart in one row */}
            <div className="product-actions-row">
              <div className="quantity-controls">
                <button
                  type="button"
                  className="quantity-button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="quantity-input"
                />
                <button
                  type="button"
                  className="quantity-button"
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button className="add-to-cart-detail-button">
                ADD TO CART
              </button>
            </div>

            {/* Wishlist */}
            <button
              className="wishlist-detail-button"
              onClick={() => setIsWishlisted(!isWishlisted)}
              aria-label="Add to wishlist"
            >
              <svg
                viewBox="0 0 24 24"
                fill={isWishlisted ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="wishlist-icon"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span>ADD TO WISHLIST</span>
            </button>

            {/* Tabs Section */}
            <div className="product-tabs-section">
              <div className="product-tabs-header">
                <button
                  className={`tab-button ${activeTab === "description" ? "active" : ""}`}
                  onClick={() => setActiveTab("description")}
                >
                  DESCRIPTION
                </button>
                <button
                  className={`tab-button ${activeTab === "additional" ? "active" : ""}`}
                  onClick={() => setActiveTab("additional")}
                >
                  ADDITIONAL INFORMATION
                </button>
                <button
                  className={`tab-button ${activeTab === "reviews" ? "active" : ""}`}
                  onClick={() => setActiveTab("reviews")}
                >
                  REVIEWS (0)
                </button>
              </div>

              <div className="product-tabs-content">
                {activeTab === "description" && (
                  <div className="tab-content">
                    <p>{product.description}</p>
                    <div className="product-meta">
                      <div className="product-meta-item">
                        <strong>SKU:</strong> {product.sku}
                      </div>
                      <div className="product-meta-divider"></div>
                      <div className="product-meta-item">
                        <strong>Category:</strong> {product.category}
                      </div>
                      <div className="product-meta-divider"></div>
                      <div className="product-meta-item">
                        <strong>Tags:</strong> {product.tags.join(", ")}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "additional" && (
                  <div className="tab-content">
                    <table className="additional-info-table">
                      <tbody>
                        <tr>
                          <th>Weight</th>
                          <td>{product.additionalInfo.weight}</td>
                        </tr>
                        <tr>
                          <th>Dimensions</th>
                          <td>{product.additionalInfo.dimensions}</td>
                        </tr>
                        <tr>
                          <th>Material</th>
                          <td>{product.additionalInfo.material}</td>
                        </tr>
                        <tr>
                          <th>Care Instructions</th>
                          <td>{product.additionalInfo.care}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="tab-content">
                    <p className="no-reviews">No reviews yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

