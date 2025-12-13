import { NextRequest, NextResponse } from 'next/server';
import { getCategories, createCategory } from '@/lib/db/repositories/categories';

// GET /api/categories - List all categories
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const activeOnly = searchParams.get('activeOnly') === 'true';

    const categories = await getCategories(activeOnly);

    return NextResponse.json({
      data: categories,
      total: categories.length,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create a new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      slug,
      description,
      image,
      parentId,
      order = 0,
      active = true,
    } = body;

    const categoryId = await createCategory({
      name,
      slug,
      description,
      image,
      parent_id: parentId || null,
      order,
      active,
    });

    const category = await getCategoryById(categoryId);
    return NextResponse.json({ data: category }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}

