import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET - Fetch all guest houses
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const adminUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    }) as any;

    if (!adminUser || adminUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Fetch all guest houses
    const guestHouses = await prisma.guestHouseAvailability.findMany({
      orderBy: [
        { isActive: 'desc' }, // Active ones first
        { createdAt: 'desc' }
      ]
    }) as any[];

    return NextResponse.json({ 
      guestHouses,
      total: guestHouses.length,
      active: guestHouses.filter(gh => gh.isActive).length,
      inactive: guestHouses.filter(gh => !gh.isActive).length
    });

  } catch (error) {
    console.error('Error fetching guest houses:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// POST - Create new guest house
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const adminUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    }) as any;

    if (!adminUser || adminUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['guestHouse', 'location', 'roomType', 'totalRooms', 'pricePerNight'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      }, { status: 400 });
    }

    // Check if guest house with same name and room type already exists
    const existingGuestHouse = await prisma.guestHouseAvailability.findFirst({
      where: {
        guestHouse: data.guestHouse,
        roomType: data.roomType
      }
    }) as any;

    if (existingGuestHouse) {
      return NextResponse.json({ 
        error: 'Guest house with same name and room type already exists' 
      }, { status: 400 });
    }

    // Create new guest house
    const newGuestHouse = await prisma.guestHouseAvailability.create({
      data: {
        guestHouse: data.guestHouse.trim(),
        location: data.location.trim(),
        roomType: data.roomType.trim(),
        totalRooms: parseInt(data.totalRooms),
        availableRooms: parseInt(data.totalRooms), // Initially all rooms are available
        pricePerNight: parseFloat(data.pricePerNight),
        amenities: JSON.stringify(data.amenities || []),
        isActive: true
      }
    }) as any;

    return NextResponse.json({
      message: 'Guest house created successfully',
      guestHouse: newGuestHouse
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 