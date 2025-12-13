import { NextRequest, NextResponse } from 'next/server';
import { getNewsArticleById, updateNewsArticle, deleteNewsArticle } from '@/lib/db/repositories/news';

// GET /api/news/[id] - Get a single news article
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid article ID' },
        { status: 400 }
      );
    }

    const article = await getNewsArticleById(id);
    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: article });
  } catch (error) {
    console.error('Error fetching news article:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news article' },
      { status: 500 }
    );
  }
}

// PUT /api/news/[id] - Update a news article
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid article ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const updateData: any = {};
    
    if (body.title !== undefined) updateData.title = body.title;
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.featuredImage !== undefined) updateData.featured_image = body.featuredImage;
    if (body.excerpt !== undefined) updateData.excerpt = body.excerpt;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.publishStatus !== undefined) updateData.publish_status = body.publishStatus;
    if (body.publishDate !== undefined) updateData.publish_date = body.publishDate ? new Date(body.publishDate) : null;
    if (body.author !== undefined) updateData.author = body.author;
    if (body.metaTitle !== undefined) updateData.meta_title = body.metaTitle;
    if (body.metaDescription !== undefined) updateData.meta_description = body.metaDescription;

    await updateNewsArticle(id, updateData);

    const article = await getNewsArticleById(id);
    return NextResponse.json({ data: article });
  } catch (error) {
    console.error('Error updating news article:', error);
    return NextResponse.json(
      { error: 'Failed to update news article' },
      { status: 500 }
    );
  }
}

// DELETE /api/news/[id] - Delete a news article
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid article ID' },
        { status: 400 }
      );
    }

    await deleteNewsArticle(id);
    return NextResponse.json({ data: { id } });
  } catch (error) {
    console.error('Error deleting news article:', error);
    return NextResponse.json(
      { error: 'Failed to delete news article' },
      { status: 500 }
    );
  }
}

