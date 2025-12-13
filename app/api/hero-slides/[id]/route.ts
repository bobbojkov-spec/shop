import { NextRequest, NextResponse } from 'next/server';
import { getHeroSlideById, updateHeroSlide, deleteHeroSlide } from '@/lib/db/repositories/hero-slides';

// GET /api/hero-slides/[id] - Get a single hero slide
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid slide ID' },
        { status: 400 }
      );
    }

    const slide = await getHeroSlideById(id);
    if (!slide) {
      return NextResponse.json(
        { error: 'Hero slide not found' },
        { status: 404 }
      );
    }

    // Transform database fields to frontend format
    const transformedSlide = {
      id: String(slide.id),
      title: slide.title || '',
      subtitle: slide.subtitle || '',
      description: slide.description || '',
      backgroundImage: slide.background_image || '',
      ctaText: slide.cta_text || '',
      ctaLink: slide.cta_link || '',
      order: slide.order || 0,
      active: slide.active === 1 || slide.active === true,
      createdAt: slide.created_at ? new Date(slide.created_at).toISOString() : new Date().toISOString(),
      updatedAt: slide.updated_at ? new Date(slide.updated_at).toISOString() : new Date().toISOString(),
    };

    return NextResponse.json({ data: transformedSlide });
  } catch (error) {
    console.error('Error fetching hero slide:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hero slide' },
      { status: 500 }
    );
  }
}

// PUT /api/hero-slides/[id] - Update a hero slide
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid slide ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const updateData: any = {};
    
    if (body.title !== undefined) updateData.title = body.title;
    if (body.subtitle !== undefined) updateData.subtitle = body.subtitle;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.backgroundImage !== undefined) updateData.background_image = body.backgroundImage;
    if (body.ctaText !== undefined) updateData.cta_text = body.ctaText;
    if (body.ctaLink !== undefined) updateData.cta_link = body.ctaLink;
    if (body.order !== undefined) updateData.order = body.order;
    if (body.active !== undefined) updateData.active = body.active;

    await updateHeroSlide(id, updateData);

    const slide = await getHeroSlideById(id);
    if (!slide) {
      return NextResponse.json(
        { error: 'Hero slide not found after update' },
        { status: 404 }
      );
    }

    // Transform database fields to frontend format
    const transformedSlide = {
      id: String(slide.id),
      title: slide.title || '',
      subtitle: slide.subtitle || '',
      description: slide.description || '',
      backgroundImage: slide.background_image || '',
      ctaText: slide.cta_text || '',
      ctaLink: slide.cta_link || '',
      order: slide.order || 0,
      active: slide.active === 1 || slide.active === true,
      createdAt: slide.created_at ? new Date(slide.created_at).toISOString() : new Date().toISOString(),
      updatedAt: slide.updated_at ? new Date(slide.updated_at).toISOString() : new Date().toISOString(),
    };

    return NextResponse.json({ data: transformedSlide });
  } catch (error) {
    console.error('Error updating hero slide:', error);
    return NextResponse.json(
      { error: 'Failed to update hero slide' },
      { status: 500 }
    );
  }
}

// DELETE /api/hero-slides/[id] - Delete a hero slide
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid slide ID' },
        { status: 400 }
      );
    }

    await deleteHeroSlide(id);
    return NextResponse.json({ data: { id } });
  } catch (error) {
    console.error('Error deleting hero slide:', error);
    return NextResponse.json(
      { error: 'Failed to delete hero slide' },
      { status: 500 }
    );
  }
}

