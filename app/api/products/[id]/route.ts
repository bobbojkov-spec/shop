import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';


// GET /api/products/[id] - Get a single product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!params || !params.id) {
      console.error('❌ GET /api/products/[id] - params is invalid:', params);
      return NextResponse.json(
        { error: 'Invalid request: missing id parameter', params },
        { status: 400 }
      );
    }
    
    const { id } = params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    // Fetch product
    const [productRows] = await pool.execute(
      'SELECT * FROM products WHERE id = ?',
      [productId]
    ) as any[];

    console.log('🔍 GET /api/products/[id] - productRows:', JSON.stringify(productRows, null, 2));

    if (!productRows || productRows.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const product = productRows[0];
    console.log('🔍 GET /api/products/[id] - product:', JSON.stringify(product, null, 2));
    console.log('🔍 GET /api/products/[id] - stock_quantity:', product.stock_quantity, typeof product.stock_quantity);

    // Get related data
    const [imageRows] = await pool.execute(
      'SELECT image_url FROM product_images WHERE product_id = ? ORDER BY `order` ASC',
      [productId]
    ) as any[];

    const [categoryRows] = await pool.execute(
      'SELECT category_id FROM product_categories WHERE product_id = ?',
      [productId]
    ) as any[];

    const [tagRows] = await pool.execute(
      'SELECT tag FROM product_tags WHERE product_id = ?',
      [productId]
    ) as any[];

    const [additionalInfoRows] = await pool.execute(
      'SELECT * FROM product_additional_info WHERE product_id = ?',
      [productId]
    ) as any[];

    const images = imageRows.map((row: any) => row.image_url);
    const categoryIds = categoryRows.map((row: any) => String(row.category_id));
    const tags = tagRows.map((row: any) => row.tag);
    const additionalInfo = additionalInfoRows[0] || null;

    return NextResponse.json({
      data: {
        ...product,
        id: String(product.id),
        price: typeof product.price === 'number' ? product.price : parseFloat(product.price || '0'),
        active: product.active === 1 || product.active === true,
        stockQuantity: product.stock_quantity !== null && product.stock_quantity !== undefined 
          ? Number(product.stock_quantity) 
          : 0,
        metaTitle: product.meta_title || '',
        metaDescription: product.meta_description || '',
        seoKeywords: product.meta_keywords || '',
        ogTitle: product.og_title || '',
        ogDescription: product.og_description || '',
        ogImageUrl: product.og_image || '',
        canonicalUrl: product.canonical_url || '',
        images,
        categoryIds,
        tags,
        additionalInfo: additionalInfo ? {
          weight: additionalInfo.weight || '',
          dimensions: additionalInfo.dimensions || '',
          material: additionalInfo.material || '',
          careInstructions: additionalInfo.care_instructions || '',
        } : {
          weight: '',
          dimensions: '',
          material: '',
          careInstructions: '',
        },
      },
    });
  } catch (error) {
    console.error('❌ Error fetching product:', error);
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    });
    return NextResponse.json(
      { error: 'Failed to fetch product', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update a product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // params is already resolved in Next.js 14
  return handleUpdate(request, params);
}

// PATCH /api/products/[id] - Update a product (Refine uses PATCH by default)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // params is already resolved in Next.js 14
  return handleUpdate(request, params);
}

// Shared update handler
async function handleUpdate(
  request: NextRequest,
  params: { id: string }
) {
  try {
    if (!params || !params.id) {
      console.error('❌ handleUpdate: params is invalid:', params);
      return NextResponse.json(
        { error: 'Invalid request: missing id parameter' },
        { status: 400 }
      );
    }
    
    if (!params || !params.id) {
      console.error('❌ GET /api/products/[id] - params is invalid:', params);
      return NextResponse.json(
        { error: 'Invalid request: missing id parameter', params },
        { status: 400 }
      );
    }
    
    const { id } = params;
    const productId = parseInt(id);
    const data = await request.json();

    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    // Handle Refine's format: body might be { variables: {...} } or direct fields
    const updateData = data.variables || data;

    const {
      name,
      slug,
      sku,
      description,
      price,
      currency,
      stockQuantity,
      active,
      metaTitle,
      metaDescription,
      seoKeywords,
      ogTitle,
      ogDescription,
      ogImageUrl,
      canonicalUrl,
      images,
      categoryIds,
      tags,
      additionalInfo,
    } = updateData;

    // Build UPDATE query for main product
    const fields: string[] = [];
    const values: any[] = [];

    if (name !== undefined) { fields.push('name = ?'); values.push(name); }
    if (slug !== undefined) { fields.push('slug = ?'); values.push(slug); }
    if (sku !== undefined) { fields.push('sku = ?'); values.push(sku); }
    if (description !== undefined) { fields.push('description = ?'); values.push(description); }
    if (price !== undefined) {
      const priceNum = typeof price === 'number' ? price : parseFloat(String(price));
      if (!isNaN(priceNum)) {
        fields.push('price = ?');
        values.push(priceNum);
      }
    }
    if (currency !== undefined) { fields.push('currency = ?'); values.push(currency); }
    if (stockQuantity !== undefined) { fields.push('stock_quantity = ?'); values.push(stockQuantity); }
    if (active !== undefined) { fields.push('active = ?'); values.push(active ? 1 : 0); }
    if (metaTitle !== undefined) { fields.push('meta_title = ?'); values.push(metaTitle); }
    if (metaDescription !== undefined) { fields.push('meta_description = ?'); values.push(metaDescription); }
    if (seoKeywords !== undefined) { fields.push('meta_keywords = ?'); values.push(seoKeywords); }
    if (ogTitle !== undefined) { fields.push('og_title = ?'); values.push(ogTitle); }
    if (ogDescription !== undefined) { fields.push('og_description = ?'); values.push(ogDescription); }
    if (ogImageUrl !== undefined) { fields.push('og_image = ?'); values.push(ogImageUrl); }
    if (canonicalUrl !== undefined) { fields.push('canonical_url = ?'); values.push(canonicalUrl); }

    // Update product if there are fields to update
    if (fields.length > 0) {
      values.push(productId);
      console.log('💾 Executing UPDATE:', `UPDATE products SET ${fields.join(', ')} WHERE id = ?`);
      console.log('💾 Values:', values);
      try {
        await pool.execute(
          `UPDATE products SET ${fields.join(', ')} WHERE id = ?`,
          values
        );
        console.log('✅ UPDATE successful');
      } catch (updateError) {
        console.error('❌ UPDATE failed:', updateError);
        console.error('❌ Error details:', {
          message: updateError instanceof Error ? updateError.message : String(updateError),
          code: (updateError as any)?.code,
          errno: (updateError as any)?.errno,
          sqlState: (updateError as any)?.sqlState,
          sqlMessage: (updateError as any)?.sqlMessage,
        });
        throw updateError;
      }
    } else {
      console.log('⚠️ No fields to update');
    }

    // Update images if provided
    if (images !== undefined) {
      await pool.execute('DELETE FROM product_images WHERE product_id = ?', [productId]);
      if (images && images.length > 0) {
        const imageValues = images.map((url: string, index: number) => [productId, url, index]);
        const placeholders = imageValues.map(() => '(?, ?, ?)').join(', ');
        const flatValues = imageValues.flat();
        await pool.execute(
          `INSERT INTO product_images (product_id, image_url, \`order\`) VALUES ${placeholders}`,
          flatValues
        );
      }
    }

    // Update categories if provided
    if (categoryIds !== undefined) {
      const numericCategoryIds = Array.isArray(categoryIds)
        ? categoryIds.map(catId => parseInt(String(catId))).filter(catId => !isNaN(catId))
        : [];
      await pool.execute('DELETE FROM product_categories WHERE product_id = ?', [productId]);
      if (numericCategoryIds.length > 0) {
        const categoryValues = numericCategoryIds.map((catId: number) => [productId, catId]);
        const placeholders = categoryValues.map(() => '(?, ?)').join(', ');
        const flatValues = categoryValues.flat();
        await pool.execute(
          `INSERT INTO product_categories (product_id, category_id) VALUES ${placeholders}`,
          flatValues
        );
      }
    }

    // Update tags if provided
    if (tags !== undefined) {
      const tagsArray = Array.isArray(tags) ? tags : [];
      await pool.execute('DELETE FROM product_tags WHERE product_id = ?', [productId]);
      if (tagsArray.length > 0) {
        const tagValues = tagsArray.map((tag: string) => [productId, tag]);
        const placeholders = tagValues.map(() => '(?, ?)').join(', ');
        const flatValues = tagValues.flat();
        await pool.execute(
          `INSERT INTO product_tags (product_id, tag) VALUES ${placeholders}`,
          flatValues
        );
      }
    }

    // Update additional info if provided
    if (additionalInfo !== undefined) {
      const [existing] = await pool.execute(
        'SELECT * FROM product_additional_info WHERE product_id = ?',
        [productId]
      ) as any[];
      
      if (existing && existing.length > 0) {
        await pool.execute(
          `UPDATE product_additional_info 
           SET weight = ?, dimensions = ?, material = ?, care_instructions = ?
           WHERE product_id = ?`,
          [
            additionalInfo.weight || null,
            additionalInfo.dimensions || null,
            additionalInfo.material || null,
            additionalInfo.careInstructions || null,
            productId,
          ]
        );
      } else {
        await pool.execute(
          `INSERT INTO product_additional_info (product_id, weight, dimensions, material, care_instructions)
           VALUES (?, ?, ?, ?, ?)`,
          [
            productId,
            additionalInfo.weight || null,
            additionalInfo.dimensions || null,
            additionalInfo.material || null,
            additionalInfo.careInstructions || null,
          ]
        );
      }
    }

    // Fetch updated product
    const [updatedProductRows] = await pool.execute(
      'SELECT * FROM products WHERE id = ?',
      [productId]
    ) as any[];

    if (!updatedProductRows || updatedProductRows.length === 0) {
      return NextResponse.json(
        { error: 'Product not found after update' },
        { status: 404 }
      );
    }

    const updatedProduct = updatedProductRows[0];

    // Fetch related data
    const [productImageRows] = await pool.execute(
      'SELECT image_url FROM product_images WHERE product_id = ? ORDER BY `order` ASC',
      [productId]
    ) as any[];

    const [productCategoryRows] = await pool.execute(
      'SELECT category_id FROM product_categories WHERE product_id = ?',
      [productId]
    ) as any[];

    const [productTagRows] = await pool.execute(
      'SELECT tag FROM product_tags WHERE product_id = ?',
      [productId]
    ) as any[];

    const [productAdditionalInfoRows] = await pool.execute(
      'SELECT * FROM product_additional_info WHERE product_id = ?',
      [productId]
    ) as any[];

    const productImages = productImageRows.map((row: any) => row.image_url);
    const productCategoryIds = productCategoryRows.map((row: any) => String(row.category_id));
    const productTags = productTagRows.map((row: any) => row.tag);
    const productAdditionalInfo = productAdditionalInfoRows[0] || null;

    return NextResponse.json({
      data: {
        ...updatedProduct,
        id: String(updatedProduct.id),
        price: typeof updatedProduct.price === 'number' ? updatedProduct.price : parseFloat(updatedProduct.price || '0'),
        active: updatedProduct.active === 1 || updatedProduct.active === true,
        images: productImages,
        categoryIds: productCategoryIds,
        tags: productTags,
        stockQuantity: updatedProduct.stock_quantity !== null && updatedProduct.stock_quantity !== undefined 
          ? Number(updatedProduct.stock_quantity) 
          : 0,
        metaTitle: updatedProduct.meta_title || '',
        metaDescription: updatedProduct.meta_description || '',
        additionalInfo: productAdditionalInfo ? {
          weight: productAdditionalInfo.weight || '',
          dimensions: productAdditionalInfo.dimensions || '',
          material: productAdditionalInfo.material || '',
          careInstructions: productAdditionalInfo.care_instructions || '',
        } : {
          weight: '',
          dimensions: '',
          material: '',
          careInstructions: '',
        },
      },
    });
  } catch (error) {
    console.error('❌ Error fetching product:', error);
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    });
    return NextResponse.json(
      { 
        error: 'Failed to fetch product',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Delete a product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!params || !params.id) {
      console.error('❌ GET /api/products/[id] - params is invalid:', params);
      return NextResponse.json(
        { error: 'Invalid request: missing id parameter', params },
        { status: 400 }
      );
    }
    
    const { id } = params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    // Delete related data first
    await pool.execute('DELETE FROM product_images WHERE product_id = ?', [productId]);
    await pool.execute('DELETE FROM product_categories WHERE product_id = ?', [productId]);
    await pool.execute('DELETE FROM product_tags WHERE product_id = ?', [productId]);
    await pool.execute('DELETE FROM product_additional_info WHERE product_id = ?', [productId]);
    
    // Delete product
    await pool.execute('DELETE FROM products WHERE id = ?', [productId]);

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('❌ Error fetching product:', error);
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    });
    return NextResponse.json(
      { 
        error: 'Failed to fetch product',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
