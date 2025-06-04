import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET - Fetch all images for an event
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const images = await prisma.eventImage.findMany({
      where: { eventId: params.id },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json({ images });

  } catch (error) {
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// POST - Add new image to event
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: params.id }
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const { imageUrl, caption, order } = await request.json();

    if (!imageUrl) {
      return NextResponse.json({ 
        error: 'Image URL is required' 
      }, { status: 400 });
    }

    // Get the next order number if not provided
    let imageOrder = order;
    if (imageOrder === undefined) {
      const lastImage = await prisma.eventImage.findFirst({
        where: { eventId: params.id },
        orderBy: { order: 'desc' }
      });
      imageOrder = lastImage ? lastImage.order + 1 : 0;
    }

    const eventImage = await prisma.eventImage.create({
      data: {
        eventId: params.id,
        imageUrl,
        caption: caption || null,
        order: imageOrder
      }
    });

    return NextResponse.json({ 
      message: 'Image added successfully',
      image: eventImage 
    });

  } catch (error) {
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// PUT - Update image order or caption
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { imageId, caption, order } = await request.json();

    if (!imageId) {
      return NextResponse.json({ 
        error: 'Image ID is required' 
      }, { status: 400 });
    }

    // Check if image exists and belongs to this event
    const existingImage = await prisma.eventImage.findFirst({
      where: { 
        id: imageId,
        eventId: params.id 
      }
    });

    if (!existingImage) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    const updateData: any = {};
    if (caption !== undefined) updateData.caption = caption;
    if (order !== undefined) updateData.order = order;

    const updatedImage = await prisma.eventImage.update({
      where: { id: imageId },
      data: updateData
    });

    return NextResponse.json({ 
      message: 'Image updated successfully',
      image: updatedImage 
    });

  } catch (error) {
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// DELETE - Remove image from event
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get('imageId');

    if (!imageId) {
      return NextResponse.json({ 
        error: 'Image ID is required' 
      }, { status: 400 });
    }

    // Check if image exists and belongs to this event
    const existingImage = await prisma.eventImage.findFirst({
      where: { 
        id: imageId,
        eventId: params.id 
      }
    });

    if (!existingImage) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    await prisma.eventImage.delete({
      where: { id: imageId }
    });

    return NextResponse.json({ 
      message: 'Image deleted successfully'
    });

  } catch (error) {
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
} 