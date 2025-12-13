# Complete Setup Guide

This guide will help you set up the entire shop application with database and admin panel.

## Prerequisites

- Node.js 18+ installed
- MySQL 8.0+ installed and running
- npm or yarn package manager

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Database Setup

### 2.1 Create the Database

Run the SQL schema to create the database and all tables:

```bash
mysql -u root -p < database/schema.sql
```

Or manually in MySQL:

```sql
mysql -u root -p
source database/schema.sql
```

### 2.2 Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=shop_db

# Next.js Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# JWT Secret (for future authentication)
JWT_SECRET=your_jwt_secret_here_change_in_production

# Node Environment
NODE_ENV=development
```

**Important:** Replace `your_password_here` with your actual MySQL root password.

### 2.3 Seed the Database

Populate the database with initial data (products, categories, hero slides, etc.):

```bash
npm run db:seed
```

This will:
- Create 5 product categories
- Import all 15 products from `lib/products.ts`
- Add 2 sample hero slides
- Add 2 sample news articles
- Create home and about pages
- Initialize site settings

## Step 3: Start the Development Server

```bash
npm run dev
```

The application will be available at:
- **Frontend:** http://localhost:3000
- **Shop Page:** http://localhost:3000/shop/shop
- **Admin Panel:** http://localhost:3000/admin

## Step 4: Verify Everything Works

### Test Database Connection

The app will automatically test the database connection on startup. Check the console for any connection errors.

### Test API Endpoints

You can test the API endpoints directly:

```bash
# Get all products
curl http://localhost:3000/api/products

# Get a specific product
curl http://localhost:3000/api/products/1

# Get categories
curl http://localhost:3000/api/categories
```

### Test Admin Panel

1. Navigate to http://localhost:3000/admin
2. You should see the dashboard with product counts
3. Try viewing/editing products in the Products section
4. Check that data loads from the database

## Architecture Overview

### Database Layer
- **Location:** `lib/db/`
- **Connection:** `lib/db/connection.ts` - MySQL connection pool
- **Models:** `lib/db/models.ts` - TypeScript interfaces
- **Repositories:** `lib/db/repositories/` - Data access layer

### API Layer
- **Location:** `app/api/`
- **Endpoints:** RESTful API routes for all resources
- **Resources:** products, categories, news, hero-slides, pages, media, settings

### Admin Panel
- **Location:** `app/admin/`
- **Framework:** Refine (headless) + Ant Design
- **Data Provider:** Uses local API endpoints
- **Resources:** Defined in `lib/resources.ts`

### Frontend
- **Location:** `app/` and `components/`
- **Shop Pages:** Product listing, product detail
- **Data Source:** Currently uses `lib/products.ts` (will be migrated to API)

## Troubleshooting

### Database Connection Issues

**Error: "Cannot connect to database"**
- Verify MySQL is running: `mysql -u root -p`
- Check `.env.local` has correct credentials
- Ensure database `shop_db` exists: `SHOW DATABASES;`

**Error: "Table doesn't exist"**
- Run the schema: `mysql -u root -p < database/schema.sql`
- Check tables exist: `USE shop_db; SHOW TABLES;`

### API Issues

**Error: "Failed to fetch"**
- Ensure dev server is running
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Verify API routes exist in `app/api/`

### Admin Panel Issues

**Error: "Resource not found"**
- Check `lib/resources.ts` has correct resource definitions
- Verify API endpoints match resource names
- Check browser console for detailed errors

### Seeding Issues

**Error: "Duplicate entry"**
- This is normal - the seeder uses `ON DUPLICATE KEY UPDATE`
- Re-running is safe

**Products not showing**
- Check products were inserted: `SELECT COUNT(*) FROM products;`
- Verify image paths in `lib/products.ts` match `public/images/`

## Next Steps

Once everything is set up:

1. **Test the Admin Panel:**
   - Create/edit/delete products
   - Manage categories
   - Add hero slides
   - Create news articles

2. **Connect Frontend to API:**
   - Update `lib/products.ts` to fetch from API
   - Update product detail pages to use API
   - Add loading states and error handling

3. **Add Authentication:**
   - Implement login for admin panel
   - Add JWT authentication
   - Protect API routes

4. **File Upload:**
   - Implement media library upload
   - Add image upload for products
   - Store files in `public/uploads/`

## File Structure

```
shop/
├── app/
│   ├── api/              # API routes
│   ├── admin/            # Admin panel pages
│   ├── shop/             # Shop frontend pages
│   └── page.tsx          # Home page
├── components/            # React components
├── database/
│   ├── schema.sql        # Database schema
│   ├── seed.ts           # Seeding script
│   └── README_SEEDING.md # Seeding guide
├── lib/
│   ├── db/               # Database layer
│   │   ├── connection.ts
│   │   ├── models.ts
│   │   └── repositories/ # Data access
│   ├── data-provider.ts  # Refine data provider
│   ├── products.ts       # Product data (temporary)
│   └── resources.ts      # Refine resources
└── public/
    └── images/           # Product images
```

## Support

If you encounter issues:
1. Check the console for error messages
2. Verify all environment variables are set
3. Ensure MySQL is running and accessible
4. Check that all dependencies are installed

For database issues, check `README_DATABASE.md`.
For seeding issues, check `database/README_SEEDING.md`.

