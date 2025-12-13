# Database Setup Guide

This document explains how to set up the MySQL database for the shop application.

## Prerequisites

- MySQL 8.0 or higher installed and running
- Node.js and npm installed

## Database Setup

### 1. Create the Database

Run the SQL schema file to create the database and all tables:

```bash
mysql -u root -p < database/schema.sql
```

Or manually:

```sql
mysql -u root -p
source database/schema.sql
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory with your database credentials:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=shop_db
```

### 3. Test the Connection

The database connection is automatically tested when the application starts. You can also test it manually by importing the connection utility:

```typescript
import { testConnection } from '@/lib/db/connection';
const isConnected = await testConnection();
console.log('Database connected:', isConnected);
```

## Database Schema

The database includes the following tables:

- **users** - Admin users for authentication
- **categories** - Product categories (hierarchical)
- **products** - Product information
- **product_images** - Product image gallery
- **product_categories** - Many-to-many relationship between products and categories
- **product_tags** - Product tags
- **product_additional_info** - Additional product details (weight, dimensions, etc.)
- **hero_slides** - Homepage hero slider slides
- **news_articles** - Blog/news articles
- **pages** - CMS pages (home, about, contact, custom)
- **page_sections** - Flexible page content sections
- **team_members** - Team/CEO information for About page
- **media_files** - Media library files
- **site_settings** - Global site settings (single row)
- **orders** - Customer orders (for future e-commerce)
- **order_items** - Order line items

## API Endpoints

All API endpoints follow RESTful conventions:

### Products
- `GET /api/products` - List products (with pagination and filters)
- `GET /api/products/[id]` - Get single product
- `POST /api/products` - Create product
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

### Categories
- `GET /api/categories` - List categories
- `GET /api/categories/[id]` - Get single category
- `POST /api/categories` - Create category
- `PUT /api/categories/[id]` - Update category
- `DELETE /api/categories/[id]` - Delete category

### News
- `GET /api/news` - List news articles
- `GET /api/news/[id]` - Get single article
- `POST /api/news` - Create article
- `PUT /api/news/[id]` - Update article
- `DELETE /api/news/[id]` - Delete article

### Hero Slides
- `GET /api/hero-slides` - List hero slides
- `GET /api/hero-slides/[id]` - Get single slide
- `POST /api/hero-slides` - Create slide
- `PUT /api/hero-slides/[id]` - Update slide
- `DELETE /api/hero-slides/[id]` - Delete slide

### Pages
- `GET /api/pages` - List pages
- `GET /api/pages/[id]` - Get single page
- `POST /api/pages` - Create page
- `PUT /api/pages/[id]` - Update page
- `DELETE /api/pages/[id]` - Delete page

### Media
- `GET /api/media` - List media files
- `GET /api/media/[id]` - Get single file
- `POST /api/media` - Create media file record
- `DELETE /api/media/[id]` - Delete media file

### Settings
- `GET /api/settings` - Get site settings
- `PUT /api/settings` - Update site settings

## Repository Pattern

All database operations are organized in repository files under `lib/db/repositories/`:

- `products.ts` - Product CRUD operations
- `categories.ts` - Category CRUD operations
- `news.ts` - News article CRUD operations
- `hero-slides.ts` - Hero slide CRUD operations
- `pages.ts` - Page CRUD operations
- `media.ts` - Media file CRUD operations
- `settings.ts` - Settings operations

## Next Steps

1. Update the Refine data provider to use these API endpoints instead of mock data
2. Implement authentication for admin routes
3. Add file upload functionality for media library
4. Connect frontend to fetch data from these APIs

