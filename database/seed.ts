/**
 * Database Seeding Script
 * 
 * This script populates the database with initial data for testing and development.
 * Run with: npx tsx database/seed.ts
 */

import { query } from '../lib/db/connection';
import { allProducts } from '../lib/products';

async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // Seed Categories
    console.log('📁 Seeding categories...');
    const categories = [
      { name: 'Dinnerware', slug: 'dinnerware', description: 'Beautiful ceramic dinnerware sets', order: 1 },
      { name: 'Mugs & Cups', slug: 'mugs-cups', description: 'Handcrafted mugs and cups', order: 2 },
      { name: 'Bowls', slug: 'bowls', description: 'Artisan bowls for every occasion', order: 3 },
      { name: 'Plates', slug: 'plates', description: 'Elegant ceramic plates', order: 4 },
      { name: 'Jars & Containers', slug: 'jars-containers', description: 'Functional storage solutions', order: 5 },
      { name: 'Storage', slug: 'storage', description: 'Storage containers and jars', order: 6 },
      { name: 'Drinkware', slug: 'drinkware', description: 'Cups, mugs, and drinkware', order: 7 },
      { name: 'Kitchen', slug: 'kitchen', description: 'Kitchen accessories and tools', order: 8 },
      { name: 'Decor', slug: 'decor', description: 'Decorative items and vases', order: 9 },
    ];

    for (const cat of categories) {
      await query(
        `INSERT INTO categories (name, slug, description, \`order\`, active) 
         VALUES (?, ?, ?, ?, TRUE)
         ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description)`,
        [cat.name, cat.slug, cat.description, cat.order]
      );
    }
    console.log(`✅ Created ${categories.length} categories\n`);

    // Get category IDs for product assignment
    const categoryMap = new Map<string, number>();
    const categoryResults = await query<{ id: number; slug: string }>('SELECT id, slug FROM categories');
    categoryResults.forEach(cat => categoryMap.set(cat.slug, cat.id));

    // Seed Products
    console.log('🛍️  Seeding products...');
    let productCount = 0;

    for (const product of allProducts) {
      // Create slug if not exists
      const slug = product.slug || product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      
      // Extract price (remove $ and parse)
      const price = parseFloat(product.price.replace(/[^0-9.-]+/g, ''));

      // Insert product
      await query(
        `INSERT INTO products (name, slug, sku, description, price, currency, stock_quantity, active, meta_title, meta_description)
         VALUES (?, ?, ?, ?, ?, 'USD', ?, TRUE, ?, ?)
         ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description), price=VALUES(price)`,
        [
          product.name,
          slug,
          product.sku,
          product.description,
          price,
          Math.floor(Math.random() * 100) + 10, // Random stock
          product.name,
          product.description.substring(0, 160),
        ]
      );

      // Get product ID (either newly inserted or existing)
      const productResult = await query<{ id: number }>(
        'SELECT id FROM products WHERE sku = ?',
        [product.sku]
      );
      const productId = productResult[0]?.id;

      if (!productId) {
        console.warn(`⚠️  Could not get ID for product: ${product.name}`);
        continue;
      }

      // Insert product images
      await query('DELETE FROM product_images WHERE product_id = ?', [productId]);
      const images = product.images || [product.image];
      for (let i = 0; i < images.length; i++) {
        await query(
          'INSERT INTO product_images (product_id, image_url, `order`) VALUES (?, ?, ?)',
          [productId, images[i], i]
        );
      }

      // Assign category (map frontend category to database category)
      await query('DELETE FROM product_categories WHERE product_id = ?', [productId]);
      const categoryName = product.category.toUpperCase();
      let categoryId: number | undefined;
      
      // Map frontend categories to database categories
      if (categoryName === 'DINNERWEAR') {
        categoryId = categoryMap.get('dinnerware');
      } else if (categoryName === 'STORAGE') {
        categoryId = categoryMap.get('storage');
      } else if (categoryName === 'DRINKWEAR') {
        categoryId = categoryMap.get('drinkware');
      } else if (categoryName === 'KITCHEN') {
        categoryId = categoryMap.get('kitchen');
      } else if (categoryName === 'DECOR') {
        categoryId = categoryMap.get('decor');
      } else if (categoryName.includes('MUG') || categoryName.includes('CUP')) {
        categoryId = categoryMap.get('mugs-cups');
      } else if (categoryName.includes('BOWL')) {
        categoryId = categoryMap.get('bowls');
      } else if (categoryName.includes('PLATE')) {
        categoryId = categoryMap.get('plates');
      } else if (categoryName.includes('JAR') || categoryName.includes('CONTAINER')) {
        categoryId = categoryMap.get('jars-containers');
      }

      if (categoryId) {
        await query(
          'INSERT INTO product_categories (product_id, category_id) VALUES (?, ?)',
          [productId, categoryId]
        );
      }

      // Insert product tags
      await query('DELETE FROM product_tags WHERE product_id = ?', [productId]);
      for (const tag of product.tags || []) {
        await query(
          'INSERT INTO product_tags (product_id, tag) VALUES (?, ?)',
          [productId, tag]
        );
      }

      // Insert additional info
      await query('DELETE FROM product_additional_info WHERE product_id = ?', [productId]);
      if (product.additionalInfo) {
        await query(
          `INSERT INTO product_additional_info (product_id, weight, dimensions, material, care_instructions)
           VALUES (?, ?, ?, ?, ?)`,
          [
            productId,
            product.additionalInfo.weight,
            product.additionalInfo.dimensions,
            product.additionalInfo.material,
            product.additionalInfo.care,
          ]
        );
      }

      productCount++;
    }
    console.log(`✅ Created ${productCount} products\n`);

    // Seed Hero Slides
    console.log('🎠 Seeding hero slides...');
    const heroSlides = [
      {
        title: 'Handmade Ceramics',
        subtitle: 'Discover Our Collection',
        description: 'Beautiful handcrafted ceramics for your home',
        background_image: '/images/product-3.jpg',
        cta_text: 'Shop Now',
        cta_link: '/shop/shop',
        order: 1,
        active: true,
      },
      {
        title: 'Artisan Quality',
        subtitle: 'Crafted with Care',
        description: 'Each piece is carefully made by skilled artisans',
        background_image: '/images/product-3-img-1.jpg',
        cta_text: 'Learn More',
        cta_link: '/shop/shop',
        order: 2,
        active: true,
      },
    ];

    for (const slide of heroSlides) {
      await query(
        `INSERT INTO hero_slides (title, subtitle, description, background_image, cta_text, cta_link, \`order\`, active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE title=VALUES(title)`,
        [
          slide.title,
          slide.subtitle,
          slide.description,
          slide.background_image,
          slide.cta_text,
          slide.cta_link,
          slide.order,
          slide.active,
        ]
      );
    }
    console.log(`✅ Created ${heroSlides.length} hero slides\n`);

    // Seed News Articles
    console.log('📰 Seeding news articles...');
    const newsArticles = [
      {
        title: 'Welcome to Our New Shop',
        slug: 'welcome-to-our-new-shop',
        featured_image: '/images/product-3.jpg',
        excerpt: 'We are excited to announce the opening of our new online shop featuring handcrafted ceramics.',
        content: '<p>We are thrilled to welcome you to our new online shop! Our collection features beautiful handcrafted ceramics made by skilled artisans. Each piece is carefully crafted with attention to detail and quality.</p><p>Browse our collection and discover unique pieces for your home.</p>',
        publish_status: 'published',
        publish_date: new Date(),
        author: 'Admin',
      },
      {
        title: 'The Art of Ceramic Making',
        slug: 'the-art-of-ceramic-making',
        featured_image: '/images/product-3-img-1.jpg',
        excerpt: 'Learn about the traditional techniques used in creating our ceramic pieces.',
        content: '<p>Ceramic making is an ancient art form that has been passed down through generations. Our artisans use traditional techniques combined with modern innovations to create beautiful, functional pieces.</p><p>From shaping the clay to glazing and firing, each step requires skill and patience.</p>',
        publish_status: 'published',
        publish_date: new Date(Date.now() - 86400000), // Yesterday
        author: 'Admin',
      },
    ];

    for (const article of newsArticles) {
      await query(
        `INSERT INTO news_articles (title, slug, featured_image, excerpt, content, publish_status, publish_date, author)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE title=VALUES(title)`,
        [
          article.title,
          article.slug,
          article.featured_image,
          article.excerpt,
          article.content,
          article.publish_status,
          article.publish_date,
          article.author,
        ]
      );
    }
    console.log(`✅ Created ${newsArticles.length} news articles\n`);

    // Seed Pages
    console.log('📄 Seeding pages...');
    const pages = [
      {
        page_type: 'home',
        slug: 'home',
        title: 'Home',
        content: '<h1>Welcome to Our Shop</h1><p>Discover our collection of handcrafted ceramics.</p>',
      },
      {
        page_type: 'about',
        slug: 'about',
        title: 'About Us',
        hero_image: '/images/product-3.jpg',
        content: '<h1>About Our Shop</h1><p>We are passionate about creating beautiful, functional ceramics that bring joy to everyday life.</p>',
      },
    ];

    for (const page of pages) {
      await query(
        `INSERT INTO pages (page_type, slug, title, hero_image, content)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE title=VALUES(title), content=VALUES(content)`,
        [
          page.page_type,
          page.slug,
          page.title,
          page.hero_image || null,
          page.content,
        ]
      );
    }
    console.log(`✅ Created ${pages.length} pages\n`);

    // Ensure site settings exist
    console.log('⚙️  Ensuring site settings...');
    await query(
      `INSERT INTO site_settings (id, site_name, contact_email, footer_content)
       VALUES (1, 'Shop', 'contact@shop.com', '© 2024 Shop. All rights reserved.')
       ON DUPLICATE KEY UPDATE id=id`
    );
    console.log('✅ Site settings initialized\n');

    console.log('✨ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('\n🎉 Done!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Seeding failed:', error);
      process.exit(1);
    });
}

export { seedDatabase };

