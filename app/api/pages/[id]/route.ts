import { NextRequest, NextResponse } from 'next/server';
import { getPageById, updatePage, deletePage } from '@/lib/db/repositories/pages';

// GET /api/pages/[id] - Get a single page
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid page ID' },
        { status: 400 }
      );
    }

    const page = await getPageById(id);
    if (!page) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: page });
  } catch (error) {
    console.error('Error fetching page:', error);
    return NextResponse.json(
      { error: 'Failed to fetch page' },
      { status: 500 }
    );
  }
}

// PUT /api/pages/[id] - Update a page
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid page ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const updateData: any = {};
    
    if (body.pageType !== undefined) updateData.page_type = body.pageType;
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.title !== undefined) updateData.title = body.title;
    if (body.heroImage !== undefined) updateData.hero_image = body.heroImage;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.metaTitle !== undefined) updateData.meta_title = body.metaTitle;
    if (body.metaDescription !== undefined) updateData.meta_description = body.metaDescription;

    await updatePage(id, updateData);

    const page = await getPageById(id);
    return NextResponse.json({ data: page });
  } catch (error) {
    console.error('Error updating page:', error);
    return NextResponse.json(
      { error: 'Failed to update page' },
      { status: 500 }
    );
  }
}

// DELETE /api/pages/[id] - Delete a page
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid page ID' },
        { status: 400 }
      );
    }

    await deletePage(id);
    return NextResponse.json({ data: { id } });
  } catch (error) {
    console.error('Error deleting page:', error);
    return NextResponse.json(
      { error: 'Failed to delete page' },
      { status: 500 }
    );
  }
}

