import { NextRequest, NextResponse } from 'next/server';
import {
  getProductById,
  updateProduct,
  deleteProduct,
  getProductImages,
  getProductCategories,
  getProductTags,
  getProductAdditionalInfo,
  setProductImages,
  setProductCategories,
  setProductTags,
  setProductAdditionalInfo,
} from '@/lib/db/repositories/products';

// GET /api/products/[id] - Get a single product
export async function GET(
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
    
    const { id } = params;
    const productId = parseInt(id);
    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    const product = await getProductById(id);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Get related data
    const [images, categoryIds, tags, additionalInfo] = await Promise.all([
      getProductImages(id),
      getProductCategories(id),
      getProductTags(id),
      getProductAdditionalInfo(id),
    ]);

    return NextResponse.json({
      data: {
        ...product,
        id: String(product.id), // Ensure ID is string for Refine
        price: typeof product.price === 'number' ? product.price : parseFloat(product.price || '0'),
        active: product.active === 1 || product.active === true,
        stockQuantity: product.stock_quantity !== null && product.stock_quantity !== undefined 
          ? Number(product.stock_quantity) 
          : 0,
        metaTitle: product.meta_title || '',
        metaDescription: product.meta_description || '',
        images: images.map(img => img.image_url),
        categoryIds: categoryIds.map(id => String(id)), // Ensure category IDs are strings
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
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update a product
export async function PUT(
  request: NextRequest,
  params: { id: string }
) {
  return handleUpdate(request, params);
}

// PATCH /api/products/[id] - Update a product (Refine uses PATCH by default)
export async function PATCH(
  request: NextRequest,
  params: { id: string }
) {
  return handleUpdate(request, params);
}

// Shared update handler
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
    
    const { id } = params;
    const productId = parseInt(id);
    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    let body;
    try {
      body = await request.json();
      console.log('📥 UPDATE /api/products/[id] - Received body:', JSON.stringify(body, null, 2));
    } catch (error) {
      console.error('❌ Error parsing request body:', error);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    // Handle Refine's format: body might be { variables: {...} } or direct fields
    const data = body.variables || body;
    console.log('📥 UPDATE /api/products/[id] - Using data:', JSON.stringify(data, null, 2));
    
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
      images,
      categoryIds,
      tags,
      additionalInfo,
    } = data;

    // Update product
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;
    if (sku !== undefined) updateData.sku = sku;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) {
      const priceNum = typeof price === 'number' ? price : parseFloat(String(price));
      if (!isNaN(priceNum)) {
        updateData.price = priceNum;
      }
    }
    if (currency !== undefined) updateData.currency = currency;
    if (stockQuantity !== undefined) updateData.stock_quantity = stockQuantity;
    if (active !== undefined) updateData.active = active;
    if (metaTitle !== undefined) updateData.meta_title = metaTitle;
    if (metaDescription !== undefined) updateData.meta_description = metaDescription;

    try {
      console.log('💾 Attempting to update product', id, 'with data:', JSON.stringify(updateData, null, 2));
      await updateProduct(id, updateData);
      console.log('✅ Product updated successfully');
    } catch (error) {
      console.error('❌ Error updating product in database:', error);
      console.error('❌ Update data was:', JSON.stringify(updateData, null, 2));
      console.error('❌ Error details:', error instanceof Error ? error.stack : String(error));
      return NextResponse.json(
        { 
          error: 'Failed to update product in database', 
          details: error instanceof Error ? error.message : String(error),
          updateData: updateData 
        },
        { status: 500 }
      );
    }

    // Update images if provided
    if (images !== undefined) {
      await setProductImages(id, images);
    }

    // Update categories if provided (always update, even if empty array)
    if (categoryIds !== undefined) {
      // Convert string IDs to numbers
      const numericCategoryIds = Array.isArray(categoryIds)
        ? categoryIds.map(catId => parseInt(String(catId))).filter(id => !isNaN(id))
        : [];
      console.log('💾 Updating categories for product', id, ':', numericCategoryIds);
      await setProductCategories(id, numericCategoryIds);
    } else {
      // If categoryIds is not provided, don't update (preserve existing)
      console.log('⚠️ categoryIds not provided, preserving existing categories');
    }

    // Always update tags (even if empty array)
    if (tags !== undefined) {
      const tagsArray = Array.isArray(tags) ? tags : [];
      console.log('💾 Updating tags for product', id, ':', tagsArray);
      await setProductTags(id, tagsArray);
    }

    // Always update additional info
    if (additionalInfo !== undefined) {
      console.log('💾 Updating additional info for product', id, ':', additionalInfo);
      await setProductAdditionalInfo(id, {
        weight: additionalInfo.weight || null,
        dimensions: additionalInfo.dimensions || null,
        material: additionalInfo.material || null,
        care_instructions: additionalInfo.careInstructions || null,
      });
    }

    // Fetch updated product with all related data
    const [updatedProduct, productImages, productCategoryIds, productTags, productAdditionalInfo] = await Promise.all([
      getProductById(id),
      getProductImages(id),
      getProductCategories(id),
      getProductTags(id),
      getProductAdditionalInfo(id),
    ]);

    return NextResponse.json({
      data: {
        ...updatedProduct,
        id: String(updatedProduct.id), // Ensure ID is string for Refine
        price: typeof updatedProduct.price === 'number' ? updatedProduct.price : parseFloat(updatedProduct.price || '0'),
        active: updatedProduct.active === 1 || updatedProduct.active === true,
        images: productImages.map(img => img.image_url),
        categoryIds: productCategoryIds.map(id => String(id)), // Ensure category IDs are strings
        tags: productTags,
        additionalInfo: productAdditionalInfo ? {
          weight: productAdditionalInfo.weight,
          dimensions: productAdditionalInfo.dimensions,
          material: productAdditionalInfo.material,
          careInstructions: productAdditionalInfo.care_instructions,
        } : null,
      },
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Delete a product
export async function DELETE(
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
    
    const { id } = params;
    const productId = parseInt(id);
    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    await deleteProduct(id);
    return NextResponse.json({ data: { id } });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}

