import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

/**
 * POST /api/media/upload - Upload and process images
 * Creates:
 * - Original image (stored in /public/images/)
 * - Small thumbnail (150x150) for admin/listings
 * - Medium thumbnail (400x400) for gallery/start page
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Check if sharp is available for image processing
    let sharp: any = null;
    try {
      sharp = require('sharp');
    } catch (e) {
      console.warn('Sharp not available, saving original only');
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
    const ext = originalName.split('.').pop()?.toLowerCase() || 'jpg';
    
    const originalFilename = `${nameWithoutExt}-${timestamp}.${ext}`;
    const smallThumbFilename = `${nameWithoutExt}-${timestamp}-150x150.${ext}`;
    const mediumThumbFilename = `${nameWithoutExt}-${timestamp}-400x400.${ext}`;
    
    const imagesDir = join(process.cwd(), 'public', 'images');
    
    // Ensure images directory exists
    if (!existsSync(imagesDir)) {
      await mkdir(imagesDir, { recursive: true });
    }
    
    // Save original
    const originalPath = join(imagesDir, originalFilename);
    await writeFile(originalPath, buffer);
    
    const originalUrl = `/images/${originalFilename}`;
    let smallThumbUrl = originalUrl;
    let mediumThumbUrl = originalUrl;
    
    // Generate thumbnails if sharp is available
    if (sharp) {
      try {
        const image = sharp(buffer);
        
        // Generate small thumbnail (150x150) for admin/listings
        const smallThumbPath = join(imagesDir, smallThumbFilename);
        await image
          .clone()
          .resize(150, 150, {
            fit: 'cover',
            position: 'center',
          })
          .toFile(smallThumbPath);
        smallThumbUrl = `/images/${smallThumbFilename}`;
        
        // Generate medium thumbnail (400x400) for gallery/start page
        const mediumThumbPath = join(imagesDir, mediumThumbFilename);
        await image
          .clone()
          .resize(400, 400, {
            fit: 'cover',
            position: 'center',
          })
          .toFile(mediumThumbPath);
        mediumThumbUrl = `/images/${mediumThumbFilename}`;
      } catch (error) {
        console.error('Error generating thumbnails:', error);
        // Continue with original URLs if thumbnail generation fails
      }
    }
    
    return NextResponse.json({
      data: {
        original: originalUrl,
        smallThumb: smallThumbUrl,
        mediumThumb: mediumThumbUrl,
        filename: originalFilename,
      },
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}



