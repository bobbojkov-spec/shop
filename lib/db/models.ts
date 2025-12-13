// Database model types matching the MySQL schema

export interface User {
  id: number;
  email: string;
  password_hash: string;
  name: string | null;
  role: 'admin' | 'editor' | 'viewer';
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parent_id: number | null;
  order: number;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  description: string | null;
  price: number;
  currency: string;
  stock_quantity: number;
  active: boolean;
  meta_title: string | null;
  meta_description: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  order: number;
  alt_text: string | null;
  created_at: Date;
}

export interface ProductCategory {
  product_id: number;
  category_id: number;
}

export interface ProductTag {
  id: number;
  product_id: number;
  tag: string;
}

export interface ProductAdditionalInfo {
  id: number;
  product_id: number;
  weight: string | null;
  dimensions: string | null;
  material: string | null;
  care_instructions: string | null;
}

export interface HeroSlide {
  id: number;
  title: string;
  subtitle: string | null;
  description: string | null;
  background_image: string;
  cta_text: string | null;
  cta_link: string | null;
  order: number;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface NewsArticle {
  id: number;
  title: string;
  slug: string;
  featured_image: string | null;
  excerpt: string | null;
  content: string | null;
  publish_status: 'draft' | 'published' | 'archived';
  publish_date: Date | null;
  author: string | null;
  meta_title: string | null;
  meta_description: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface Page {
  id: number;
  page_type: 'home' | 'about' | 'contact' | 'custom';
  slug: string;
  title: string;
  hero_image: string | null;
  content: string | null;
  meta_title: string | null;
  meta_description: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface PageSection {
  id: number;
  page_id: number;
  section_type: 'text' | 'image' | 'text-image' | 'featured';
  title: string | null;
  content: string | null;
  image: string | null;
  link: string | null;
  order: number;
  created_at: Date;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string | null;
  bio: string | null;
  image: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  email: string | null;
  order: number;
  created_at: Date;
  updated_at: Date;
}

export interface MediaFile {
  id: number;
  filename: string;
  url: string;
  mime_type: string | null;
  size: number | null;
  width: number | null;
  height: number | null;
  alt_text: string | null;
  caption: string | null;
  created_at: Date;
}

export interface SiteSettings {
  id: number;
  site_name: string;
  logo: string | null;
  favicon: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  twitter_url: string | null;
  linkedin_url: string | null;
  footer_content: string | null;
  seo_default_title: string | null;
  seo_default_description: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  updated_at: Date;
}

export interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  shipping_address: string;
  billing_address: string | null;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  currency: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  product_sku: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
}

