import { NextRequest, NextResponse } from 'next/server';
import { getMediaFileById, deleteMediaFile } from '@/lib/db/repositories/media';

// GET /api/media/[id] - Get a single media file
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid media file ID' },
        { status: 400 }
      );
    }

    const file = await getMediaFileById(id);
    if (!file) {
      return NextResponse.json(
        { error: 'Media file not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: file });
  } catch (error) {
    console.error('Error fetching media file:', error);
    return NextResponse.json(
      { error: 'Failed to fetch media file' },
      { status: 500 }
    );
  }
}

// DELETE /api/media/[id] - Delete a media file
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid media file ID' },
        { status: 400 }
      );
    }

    await deleteMediaFile(id);
    return NextResponse.json({ data: { id } });
  } catch (error) {
    console.error('Error deleting media file:', error);
    return NextResponse.json(
      { error: 'Failed to delete media file' },
      { status: 500 }
    );
  }
}

