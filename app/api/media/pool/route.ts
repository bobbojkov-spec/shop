import { NextRequest, NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import { join } from 'path';

/**
 * GET /api/media/pool - List all original images from the image pool
 * Filters out resized variants (e.g., -300x300, -150x150, etc.)
 */
export async function GET(request: NextRequest) {
  try {
    const imagesDir = join(process.cwd(), 'public', 'images');
    const files = await readdir(imagesDir);
    
    // Filter out resized variants and only keep original images
    // Patterns to exclude: -300x300, -150x150, -413x647, etc.
    const resizedPattern = /-\d+x\d+\.(jpg|jpeg|png|gif|webp)$/i;
    
    const originalImages = files
      .filter(file => {
        // Exclude resized variants
        if (resizedPattern.test(file)) {
          return false;
        }
        // Only include image files
        return /\.(jpg|jpeg|png|gif|webp)$/i.test(file);
      })
      .map(file => ({
        id: file,
        filename: file,
        url: `/images/${file}`,
        path: `/images/${file}`,
      }))
      .sort((a, b) => a.filename.localeCompare(b.filename));
    
    return NextResponse.json({
      data: originalImages,
      total: originalImages.length,
    });
  } catch (error) {
    console.error('Error reading image pool:', error);
    return NextResponse.json(
      { error: 'Failed to read image pool' },
      { status: 500 }
    );
  }
}

