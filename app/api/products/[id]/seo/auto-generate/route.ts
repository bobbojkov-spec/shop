import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { generateProductSEO } from '@/lib/seo/generate-product-seo';

// POST - Auto-generate SEO data for a product
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    // Fetch product data
    const [productRows] = await pool.execute(
      `SELECT p.id, p.name, p.slug, p.description, p.price, p.currency, p.meta_title, p.meta_description
       FROM products p
       WHERE p.id = ?`,
      [productId]
    ) as any[];

    if (!productRows || productRows.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const product = productRows[0];

    // Fetch categories
    const [categoryRows] = await pool.execute(
      `SELECT c.name 
       FROM categories c
       INNER JOIN product_categories pc ON c.id = pc.category_id
       WHERE pc.product_id = ?
       ORDER BY c.name ASC`,
      [productId]
    ) as any[];
    const categoryNames = categoryRows.map((row: any) => row.name);

    // Fetch tags
    const [tagRows] = await pool.execute(
      `SELECT t.name 
       FROM tags t
       INNER JOIN product_tags pt ON t.id = pt.tag_id
       WHERE pt.product_id = ?
       ORDER BY t.name ASC`,
      [productId]
    ) as any[];
    const tags = tagRows.map((row: any) => row.name);

    // Get first product image (thumbnail)
    const [imageRows] = await pool.execute(
      `SELECT image_url 
       FROM product_images 
       WHERE product_id = ? 
       ORDER BY \`order\` ASC 
       LIMIT 1`,
      [productId]
    ) as any[];
    const firstImageUrl = imageRows[0]?.image_url || null;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // Prepare data for SEO generation
    const productDataForSEO = {
      id: productId,
      name: product.name || '',
      slug: product.slug || '',
      description: product.description || '',
      price: product.price || null,
      currency: product.currency || 'EUR',
      categoryNames,
      tags,
      firstImageUrl,
    };

    // Generate SEO data
    const seoData = generateProductSEO(productDataForSEO, baseUrl);

    // Save to database
    await pool.execute(
      `UPDATE products SET
        meta_title = ?,
        meta_description = ?,
        meta_keywords = ?,
        og_title = ?,
        og_description = ?,
        og_image = ?,
        canonical_url = ?
       WHERE id = ?`,
      [
        seoData.metaTitle,
        seoData.metaDescription,
        seoData.seoKeywords,
        seoData.ogTitle,
        seoData.ogDescription,
        seoData.ogImageUrl,
        seoData.canonicalUrl,
        productId,
      ]
    );

    return NextResponse.json({
      success: true,
      seoData,
      message: 'SEO data auto-generated successfully',
    });
  } catch (error) {
    console.error('Error auto-generating SEO data:', error);
    return NextResponse.json(
      { error: 'Failed to auto-generate SEO data', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
