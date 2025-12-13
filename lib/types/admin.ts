// Admin Resource Types

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
  ctaText: string;
  ctaLink: string;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  featuredImage: string;
  excerpt: string;
  content: string; // Rich text/HTML
  publishStatus: "draft" | "published" | "archived";
  publishDate: string | null;
  author?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  currency: string;
  images: string[]; // Gallery
  stockQuantity: number;
  active: boolean;
  categoryIds: string[];
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  parentId?: string | null;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MediaFile {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  alt?: string;
  caption?: string;
  createdAt: string;
}

export interface PageContent {
  id: string;
  pageType: "home" | "about" | "contact" | "custom";
  slug: string;
  title: string;
  heroImage?: string;
  content: string; // Rich text
  metaTitle?: string;
  metaDescription?: string;
  sections?: PageSection[];
  createdAt: string;
  updatedAt: string;
}

export interface PageSection {
  id: string;
  type: "text" | "image" | "text-image" | "featured";
  title?: string;
  content?: string;
  image?: string;
  link?: string;
  order: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
  order: number;
}

export interface SiteSettings {
  id: string;
  siteName: string;
  logo: string;
  favicon: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  footerContent: string;
  seoDefaults: {
    metaTitle?: string;
    metaDescription?: string;
  };
  contactEmail: string;
  contactPhone?: string;
}

