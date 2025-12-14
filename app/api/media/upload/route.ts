import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

/**
 * POST /api/media/upload - Upload and process images
 * Creates:
 * - Original image (big version - stored in /public/images/)
 * - Middle version (800x800) for product pages
 * - Small thumbnail (300x300) for listings/admin
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
    const middleFilename = `${nameWithoutExt}-${timestamp}-800x800.${ext}`;
    const thumbnailFilename = `${nameWithoutExt}-${timestamp}-300x300.${ext}`;
    
    const imagesDir = join(process.cwd(), 'public', 'images');
    
    // Ensure images directory exists
    if (!existsSync(imagesDir)) {
      await mkdir(imagesDir, { recursive: true });
    }
    
    // Save original
    const originalPath = join(imagesDir, originalFilename);
    await writeFile(originalPath, buffer);
    
    const originalUrl = `/images/${originalFilename}`;
    let middleUrl = originalUrl;
    let thumbnailUrl = originalUrl;
    
    // Generate thumbnails if sharp is available
    if (sharp) {
      try {
        const image = sharp(buffer);
        
        // Generate middle version (800x800) for product pages
        const middlePath = join(imagesDir, middleFilename);
        await image
          .clone()
          .resize(800, 800, {
            fit: 'inside',
            withoutEnlargement: true,
          })
          .toFile(middlePath);
        middleUrl = `/images/${middleFilename}`;
        
        // Generate small thumbnail (300x300) for listings/admin
        const thumbnailPath = join(imagesDir, thumbnailFilename);
        await image
          .clone()
          .resize(300, 300, {
            fit: 'cover',
            position: 'center',
          })
          .toFile(thumbnailPath);
        thumbnailUrl = `/images/${thumbnailFilename}`;
      } catch (error) {
        console.error('Error generating thumbnails:', error);
        // Continue with original URLs if thumbnail generation fails
      }
    }
    
    return NextResponse.json({
      data: {
        original: originalUrl, // Big version
        middle: middleUrl,      // Middle version (800x800)
        thumbnail: thumbnailUrl, // Small version (300x300)
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



