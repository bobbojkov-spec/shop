# Admin System Documentation

## Overview

A professional, enterprise-grade admin system built with:
- **Next.js 14** (App Router)
- **Refine** (Headless mode)
- **Ant Design** (UI components)
- **TypeScript**
- **REST API** (generic, backend-agnostic)

## Architecture

### Resource Structure

All resources are defined in `/lib/resources.ts` and types in `/lib/types/admin.ts`.

### Admin Routes

- `/admin` - Dashboard
- `/admin/hero-slides` - Hero slides management
- `/admin/pages` - Page content management (CMS)
- `/admin/news` - News/Blog articles
- `/admin/products` - Product management
- `/admin/categories` - Category management (hierarchical)
- `/admin/media` - Media library
- `/admin/settings` - Global site settings
- `/admin/login` - Authentication (scaffold)

## Features

### 1. Dashboard (`/admin`)
- Overview statistics cards
- Recent activity feed
- Quick action links

### 2. Hero Slides (`/admin/hero-slides`)
- Full CRUD operations
- Fields: title, subtitle, description, background image, CTA, order, active status
- Supports slideshow rotation

### 3. Pages CMS (`/admin/pages`)
- Manage page content (Home, About, Contact, Custom)
- Rich text content support
- SEO fields (meta title, description)
- Hero image management

### 4. News/Blog (`/admin/news`)
- Article CRUD
- Publish status (draft, published, archived)
- Featured images
- Rich content editor
- Publish date management

### 5. Products (`/admin/products`)
- Complete product management
- SKU, price, currency
- Image gallery
- Stock quantity
- Category assignment
- SEO fields
- Active/inactive toggle

### 6. Categories (`/admin/categories`)
- Hierarchical category structure
- Parent-child relationships
- Image support
- Order management
- Active/inactive status

### 7. Media Library (`/admin/media`)
- Centralized media management
- Image preview
- File metadata (size, dimensions, type)
- URL copying
- Upload functionality

### 8. Settings (`/admin/settings`)
- Site name, logo, favicon
- Contact information
- Social media links
- Footer content
- SEO defaults

### 9. Authentication (`/admin/login`)
- Login page scaffold
- Ready for backend integration
- Default credentials placeholder

## Technical Implementation

### Refine Hooks Used
- `useTable` - List views with pagination, sorting, filtering
- `useForm` - Create/Edit forms
- `useList` - Data fetching
- `useShow` - Detail views
- `useCreate`, `useUpdate`, `useDelete` - Mutations

### Ant Design Components
- Tables with sorting and pagination
- Forms with validation
- Modals and drawers
- Cards and layouts
- Upload components
- Image previews

### Data Provider
Currently using `@refinedev/simple-rest` with mock endpoint:
```
https://api.fake-rest.refine.dev
```

Replace with your actual REST API endpoint in `/app/admin/layout.tsx`.

## Next Steps

1. **Backend Integration**
   - Replace mock API endpoint with your REST API
   - Implement authentication
   - Add proper error handling

2. **Media Upload**
   - Implement actual file upload endpoint
   - Add image optimization
   - Support for multiple file types

3. **Rich Text Editor**
   - Integrate a WYSIWYG editor (e.g., TinyMCE, Quill)
   - Replace textarea with rich editor component

4. **Permissions**
   - Add role-based access control
   - Implement permission checks

5. **Advanced Features**
   - Bulk operations
   - Export/Import functionality
   - Activity logs
   - Search and advanced filtering

## File Structure

```
app/admin/
├── layout.tsx              # Main admin layout with sidebar
├── page.tsx                 # Dashboard
├── login/
│   └── page.tsx            # Login page
├── hero-slides/
│   ├── page.tsx            # List
│   ├── create/
│   ├── edit/[id]/
│   └── show/[id]/
├── pages/
│   ├── page.tsx            # List
│   ├── create/
│   ├── edit/[id]/
│   └── show/[id]/
├── news/
│   ├── page.tsx            # List
│   ├── create/
│   ├── edit/[id]/
│   └── show/[id]/
├── products/
│   ├── page.tsx            # List
│   ├── create/
│   ├── edit/[id]/
│   └── show/[id]/
├── categories/
│   ├── page.tsx            # List
│   ├── create/
│   ├── edit/[id]/
│   └── show/[id]/
├── media/
│   ├── page.tsx            # Library
│   └── upload/
└── settings/
    └── page.tsx            # Settings

lib/
├── types/
│   └── admin.ts            # TypeScript types
└── resources.ts            # Refine resource definitions
```

## Usage

1. Navigate to `/admin` to access the dashboard
2. Use the sidebar to navigate between sections
3. Click "Create" buttons to add new items
4. Use Edit/Show/Delete actions in tables
5. All forms include validation and error handling

## Notes

- This is a **scaffold** - over-built for flexibility
- Delete unused resources/pages as needed
- All components use Ant Design for consistent UI
- Responsive sidebar collapses on mobile
- Ready for production backend integration

