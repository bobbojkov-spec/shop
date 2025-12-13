# Database Seeding Guide

## Overview

The seeding script (`database/seed.ts`) populates the database with initial data for development and testing.

## What Gets Seeded

1. **Categories** - Product categories (Dinnerware, Mugs & Cups, Bowls, Plates, Jars & Containers)
2. **Products** - All 15 products from `lib/products.ts` with:
   - Product details (name, SKU, price, description)
   - Product images (gallery)
   - Category assignments
   - Tags
   - Additional info (weight, dimensions, material, care instructions)
3. **Hero Slides** - 2 sample hero slides for the homepage
4. **News Articles** - 2 sample blog posts
5. **Pages** - Home and About pages
6. **Site Settings** - Default site configuration

## Running the Seeder

### Prerequisites

1. Database must be created and schema applied:
   ```bash
   mysql -u root -p < database/schema.sql
   ```

2. Environment variables must be set in `.env.local`:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=shop_db
   ```

### Run the Seeder

```bash
npm run db:seed
```

Or directly with tsx:

```bash
npx tsx database/seed.ts
```

## Notes

- The seeder uses `ON DUPLICATE KEY UPDATE` to avoid errors on re-runs
- Products are matched by SKU to prevent duplicates
- Categories are matched by slug
- You can run the seeder multiple times safely

## Troubleshooting

**Error: Cannot connect to database**
- Check your `.env.local` file has correct credentials
- Ensure MySQL is running
- Verify database `shop_db` exists

**Error: Table doesn't exist**
- Run the schema file first: `mysql -u root -p < database/schema.sql`

**Products not showing images**
- Ensure image paths in `lib/products.ts` match files in `public/images/`

