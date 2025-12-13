import { NextRequest, NextResponse } from 'next/server';
import { getNewsArticles, createNewsArticle, getNewsArticleById } from '@/lib/db/repositories/news';

// GET /api/news - List news articles with pagination
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const publishStatus = searchParams.get('publishStatus');
    const search = searchParams.get('search');

    const filters: any = {};
    if (publishStatus) filters.publishStatus = publishStatus;
    if (search) filters.search = search;

    const result = await getNewsArticles(page, pageSize, filters);

    return NextResponse.json({
      data: result.articles,
      total: result.total,
      page,
      pageSize,
    });
  } catch (error) {
    console.error('Error fetching news articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news articles' },
      { status: 500 }
    );
  }
}

// POST /api/news - Create a new news article
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      featuredImage,
      excerpt,
      content,
      publishStatus = 'draft',
      publishDate,
      author,
      metaTitle,
      metaDescription,
    } = body;

    const articleId = await createNewsArticle({
      title,
      slug,
      featured_image: featuredImage,
      excerpt,
      content,
      publish_status: publishStatus,
      publish_date: publishDate ? new Date(publishDate) : null,
      author,
      meta_title: metaTitle,
      meta_description: metaDescription,
    });

    const article = await getNewsArticleById(articleId);
    return NextResponse.json({ data: article }, { status: 201 });
  } catch (error) {
    console.error('Error creating news article:', error);
    return NextResponse.json(
      { error: 'Failed to create news article' },
      { status: 500 }
    );
  }
}

