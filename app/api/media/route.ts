import { NextRequest, NextResponse } from 'next/server';
import { getMediaFiles, createMediaFile, getMediaFileById } from '@/lib/db/repositories/media';

// GET /api/media - List media files with pagination
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const mimeType = searchParams.get('mimeType');
    const search = searchParams.get('search');

    const filters: any = {};
    if (mimeType) filters.mimeType = mimeType;
    if (search) filters.search = search;

    const result = await getMediaFiles(page, pageSize, filters);

    return NextResponse.json({
      data: result.files,
      total: result.total,
      page,
      pageSize,
    });
  } catch (error) {
    console.error('Error fetching media files:', error);
    return NextResponse.json(
      { error: 'Failed to fetch media files' },
      { status: 500 }
    );
  }
}

// POST /api/media - Create a new media file record
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      filename,
      url,
      mimeType,
      size,
      width,
      height,
      altText,
      caption,
    } = body;

    const fileId = await createMediaFile({
      filename,
      url,
      mime_type: mimeType,
      size,
      width,
      height,
      alt_text: altText,
      caption,
    });

    const file = await getMediaFileById(fileId);
    return NextResponse.json({ data: file }, { status: 201 });
  } catch (error) {
    console.error('Error creating media file:', error);
    return NextResponse.json(
      { error: 'Failed to create media file' },
      { status: 500 }
    );
  }
}

