/**
 * Quick script to populate database with products
 * Run with: npx tsx scripts/populate-db.ts
 */

import { query, testConnection } from '../lib/db/connection';
import { allProducts } from '../lib/products';

async function populateDatabase() {
  console.log('🚀 Starting database population...\n');

  // Test connection
  const isConnected = await testConnection();
  if (!isConnected) {
    console.error('❌ Cannot connect to database. Please check your .env.local file.');
    console.error('Required variables: DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME');
    process.exit(1);
  }

  try {
    // Check if products already exist
    const existingProducts = await query<{ count: number }>('SELECT COUNT(*) as count FROM products');
    if (existingProducts[0]?.count > 0) {
      console.log(`⚠️  Database already has ${existingProducts[0].count} products.`);
      console.log('   To re-seed, delete existing data first or the script will update existing products.\n');
    }

    // Seed Categories
    console.log('📁 Creating categories...');
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

    // Get category IDs
    const categoryMap = new Map<string, number>();
    const categoryResults = await query<{ id: number; slug: string }>('SELECT id, slug FROM categories');
    categoryResults.forEach(cat => categoryMap.set(cat.slug, cat.id));

    // Seed Products
    console.log('🛍️  Creating products...');
    let productCount = 0;

    for (const product of allProducts) {
      const slug = product.slug || product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const price = parseFloat(product.price.replace(/[^0-9.-]+/g, ''));

      // Prepare SEO meta information
      const metaTitle = `${product.name} | Handmade Ceramics`;
      const metaDescription = product.description.length > 160 
        ? product.description.substring(0, 157) + '...'
        : product.description;

      // Insert or update product
      await query(
        `INSERT INTO products (name, slug, sku, description, price, currency, stock_quantity, active, meta_title, meta_description)
         VALUES (?, ?, ?, ?, ?, 'EUR', ?, TRUE, ?, ?)
         ON DUPLICATE KEY UPDATE 
           name=VALUES(name), 
           description=VALUES(description), 
           price=VALUES(price),
           slug=VALUES(slug),
           meta_title=VALUES(meta_title),
           meta_description=VALUES(meta_description)`,
        [
          product.name,
          slug,
          product.sku,
          product.description,
          price,
          Math.floor(Math.random() * 100) + 10,
          metaTitle,
          metaDescription,
        ]
      );

      // Get product ID
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

      // Assign category
      await query('DELETE FROM product_categories WHERE product_id = ?', [productId]);
      const categoryName = product.category.toUpperCase();
      let categoryId: number | undefined;
      
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
      process.stdout.write(`\r   Progress: ${productCount}/${allProducts.length} products`);
    }
    console.log(`\n✅ Created ${productCount} products\n`);

    console.log('✨ Database population completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - ${categories.length} categories`);
    console.log(`   - ${productCount} products with images, tags, and additional info`);
    console.log('\n🎉 You can now view the products in the admin panel at http://localhost:3000/admin/products');
  } catch (error) {
    console.error('❌ Error populating database:', error);
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  populateDatabase()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Population failed:', error);
      process.exit(1);
    });
}

export { populateDatabase };

