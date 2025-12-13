/**
 * Script to set EUR prices to match original USD prices
 * (Not converting, just using USD values as EUR values)
 * Run with: npx tsx scripts/set-eur-prices-from-usd.ts
 */

import { query, testConnection } from '../lib/db/connection';
import { allProducts } from '../lib/products';

async function setEURPricesFromUSD() {
  console.log('🚀 Setting EUR prices from original USD values...\n');

  // Test connection
  const isConnected = await testConnection();
  if (!isConnected) {
    console.error('❌ Cannot connect to database.');
    process.exit(1);
  }

  try {
    let updatedCount = 0;

    for (const product of allProducts) {
      // Extract price from string like "$60.00"
      const priceMatch = product.price.match(/\$?([\d.]+)/);
      if (!priceMatch) {
        console.warn(`⚠️  Could not parse price for ${product.name}: ${product.price}`);
        continue;
      }

      const originalPrice = parseFloat(priceMatch[1]);
      
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

      // Update price to EUR (using original USD value as EUR value)
      await query(
        'UPDATE products SET price = ?, currency = ? WHERE id = ?',
        [originalPrice, 'EUR', productId]
      );

      console.log(`Updated ${product.name}: €${originalPrice.toFixed(2)} EUR`);
      updatedCount++;
    }

    console.log(`\n✅ Updated ${updatedCount} products with EUR prices`);
    console.log('✨ Update completed successfully!');
  } catch (error) {
    console.error('❌ Error updating prices:', error);
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  setEURPricesFromUSD()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Update failed:', error);
      process.exit(1);
    });
}

export { setEURPricesFromUSD };

