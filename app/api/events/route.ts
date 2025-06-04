import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET - Fetch all events
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');

    let whereClause: any = {
      isPublished: true
    };

    if (featured === 'true') {
      whereClause.isFeatured = true;
    }

    const events = await prisma.event.findMany({
      where: whereClause,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        images: {
          orderBy: {
            order: 'asc'
          }
        }
      },
      orderBy: [
        { isFeatured: 'desc' },
        { eventDate: 'desc' }
      ],
      take: limit ? parseInt(limit) : undefined
    }) as any;

    return NextResponse.json({ events });

  } catch (error) {
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// POST - Create new event
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    }) as any;

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { title, description, eventDate, location, imageUrl, isFeatured } = await request.json();

    // Validate required fields
    if (!title || !eventDate) {
      return NextResponse.json({ 
        error: 'Title and event date are required' 
      }, { status: 400 });
    }

    const event = await prisma.event.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        eventDate: new Date(eventDate),
        location: location?.trim() || null,
        imageUrl: imageUrl || null,
        isFeatured: isFeatured || false,
        createdBy: user.id
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        images: true
      }
    }) as any;

    return NextResponse.json({ 
      message: 'Event created successfully',
      event 
    });

  } catch (error) {
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
} 