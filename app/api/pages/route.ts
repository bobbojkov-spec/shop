import { NextRequest, NextResponse } from 'next/server';
import { getPages, createPage, getPageById } from '@/lib/db/repositories/pages';

// GET /api/pages - List all pages
export async function GET(request: NextRequest) {
  try {
    const pages = await getPages();

    return NextResponse.json({
      data: pages,
      total: pages.length,
    });
  } catch (error) {
    console.error('Error fetching pages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pages' },
      { status: 500 }
    );
  }
}

// POST /api/pages - Create a new page
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      pageType,
      slug,
      title,
      heroImage,
      content,
      metaTitle,
      metaDescription,
    } = body;

    const pageId = await createPage({
      page_type: pageType,
      slug,
      title,
      hero_image: heroImage,
      content,
      meta_title: metaTitle,
      meta_description: metaDescription,
    });

    const page = await getPageById(pageId);
    return NextResponse.json({ data: page }, { status: 201 });
  } catch (error) {
    console.error('Error creating page:', error);
    return NextResponse.json(
      { error: 'Failed to create page' },
      { status: 500 }
    );
  }
}

