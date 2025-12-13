/**
 * Script to update existing products with complete demo data
 * including additional info, tags, and SEO meta information
 * Run with: npx tsx scripts/update-product-details.ts
 */

import { query, testConnection } from '../lib/db/connection';
import { allProducts } from '../lib/products';

async function updateProductDetails() {
  console.log('🚀 Updating product details with demo data...\n');

  // Test connection
  const isConnected = await testConnection();
  if (!isConnected) {
    console.error('❌ Cannot connect to database.');
    process.exit(1);
  }

  try {
    let updatedCount = 0;

    for (const product of allProducts) {
      // Get product ID by SKU
      const productResult = await query<{ id: number }>(
        'SELECT id FROM products WHERE sku = ?',
        [product.sku]
      );
      const productId = productResult[0]?.id;

      if (!productId) {
        console.warn(`⚠️  Product not found: ${product.name} (SKU: ${product.sku})`);
        continue;
      }

      // Update SEO meta information
      const metaTitle = `${product.name} | Handmade Ceramics`;
      const metaDescription = product.description.length > 160 
        ? product.description.substring(0, 157) + '...'
        : product.description;

      await query(
        `UPDATE products 
         SET meta_title = ?, meta_description = ?
         WHERE id = ?`,
        [metaTitle, metaDescription, productId]
      );

      // Update/Insert additional info
      await query(
        `INSERT INTO product_additional_info (product_id, weight, dimensions, material, care_instructions)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           weight = VALUES(weight),
           dimensions = VALUES(dimensions),
           material = VALUES(material),
           care_instructions = VALUES(care_instructions)`,
        [
          productId,
          product.additionalInfo.weight,
          product.additionalInfo.dimensions,
          product.additionalInfo.material,
          product.additionalInfo.care,
        ]
      );

      // Update tags
      await query('DELETE FROM product_tags WHERE product_id = ?', [productId]);
      for (const tag of product.tags || []) {
        await query(
          'INSERT INTO product_tags (product_id, tag) VALUES (?, ?)',
          [productId, tag]
        );
      }

      updatedCount++;
      process.stdout.write(`\r   Progress: ${updatedCount}/${allProducts.length} products`);
    }

    console.log(`\n✅ Updated ${updatedCount} products with complete details\n`);

    console.log('✨ Update completed successfully!');
    console.log('\n📊 Updated:');
    console.log(`   - Additional info (weight, dimensions, material, care instructions)`);
    console.log(`   - Tags`);
    console.log(`   - SEO meta titles and descriptions`);
  } catch (error) {
    console.error('❌ Error updating products:', error);
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  updateProductDetails()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Update failed:', error);
      process.exit(1);
    });
}

export { updateProductDetails };

