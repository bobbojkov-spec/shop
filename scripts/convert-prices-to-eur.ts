/**
 * Script to convert all product prices from USD to EUR
 * Run with: npx tsx scripts/convert-prices-to-eur.ts
 */

import { query, testConnection } from '../lib/db/connection';

const EXCHANGE_RATE = 1.08; // USD to EUR conversion rate

async function convertPricesToEUR() {
  console.log('🚀 Converting product prices from USD to EUR...\n');

  // Test connection
  const isConnected = await testConnection();
  if (!isConnected) {
    console.error('❌ Cannot connect to database.');
    process.exit(1);
  }

  try {
    // Get all products
    const products = await query<{ id: number; name: string; price: number; currency: string }>(
      'SELECT id, name, price, currency FROM products'
    );

    console.log(`Found ${products.length} products to convert\n`);

    let convertedCount = 0;

    for (const product of products) {
      // Ensure price is a number
      const currentPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
      let newPrice = currentPrice;
      let needsUpdate = false;

      // If currency is USD, convert to EUR
      if (product.currency === 'USD' || product.currency === null || product.currency === '') {
        newPrice = currentPrice / EXCHANGE_RATE;
        needsUpdate = true;
        console.log(`Converting ${product.name}:`);
        console.log(`  Old: $${currentPrice.toFixed(2)} USD`);
        console.log(`  New: €${newPrice.toFixed(2)} EUR`);
      } else if (product.currency === 'EUR') {
        console.log(`Skipping ${product.name} (already EUR)`);
        continue;
      }

      if (needsUpdate) {
        await query(
          'UPDATE products SET price = ?, currency = ? WHERE id = ?',
          [newPrice, 'EUR', product.id]
        );
        convertedCount++;
      }
    }

    console.log(`\n✅ Converted ${convertedCount} products to EUR`);
    console.log('✨ Conversion completed successfully!');
  } catch (error) {
    console.error('❌ Error converting prices:', error);
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  convertPricesToEUR()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Conversion failed:', error);
      process.exit(1);
    });
}

export { convertPricesToEUR };

