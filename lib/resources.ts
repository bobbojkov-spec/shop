// Refine Resource Definitions

export const resources = [
  {
    name: "hero-slides",
    list: "/admin/hero-slides",
    create: "/admin/hero-slides/create",
    edit: "/admin/hero-slides/edit/:id",
    show: "/admin/hero-slides/show/:id",
    meta: {
      label: "Hero Slides",
      canDelete: true,
    },
  },
  {
    name: "news",
    list: "/admin/news",
    create: "/admin/news/create",
    edit: "/admin/news/edit/:id",
    show: "/admin/news/show/:id",
    meta: {
      label: "News & Blog",
      canDelete: true,
    },
  },
  {
    name: "products",
    list: "/admin/products",
    create: "/admin/products/create",
    edit: "/admin/products/edit/:id",
    show: "/admin/products/show/:id",
    meta: {
      label: "Products",
      canDelete: true,
    },
  },
  {
    name: "categories",
    list: "/admin/categories",
    create: "/admin/categories/create",
    edit: "/admin/categories/edit/:id",
    show: "/admin/categories/show/:id",
    meta: {
      label: "Categories",
      canDelete: true,
    },
  },
  {
    name: "pages",
    list: "/admin/pages",
    create: "/admin/pages/create",
    edit: "/admin/pages/edit/:id",
    show: "/admin/pages/show/:id",
    meta: {
      label: "Pages",
      canDelete: true,
    },
  },
  {
    name: "media",
    list: "/admin/media",
    create: "/admin/media/upload",
    meta: {
      label: "Media Library",
      canDelete: true,
    },
  },
  {
    name: "settings",
    list: "/admin/settings",
    edit: "/admin/settings/edit",
    meta: {
      label: "Settings",
    },
  },
];

