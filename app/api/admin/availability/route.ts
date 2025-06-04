import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET - List all availability
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const availability = await prisma.guestHouseAvailability.findMany({
      orderBy: [
        { guestHouse: 'asc' },
        { roomType: 'asc' }
      ]
    });

    return NextResponse.json(availability);
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    );
  }
}

// POST - Add or update availability
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const admin = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { 
      guestHouse, 
      location, 
      roomType, 
      totalRooms, 
      availableRooms, 
      pricePerNight, 
      amenities, 
      isActive 
    } = await request.json();

    if (!guestHouse || !location || !roomType || !totalRooms || !pricePerNight) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if this combination already exists
    const existing = await prisma.guestHouseAvailability.findUnique({
      where: {
        guestHouse_roomType: {
          guestHouse,
          roomType
        }
      }
    });

    let result;
    if (existing) {
      // Update existing
      result = await prisma.guestHouseAvailability.update({
        where: { id: existing.id },
        data: {
          location,
          totalRooms: parseInt(totalRooms),
          availableRooms: availableRooms ? parseInt(availableRooms) : parseInt(totalRooms),
          pricePerNight: parseFloat(pricePerNight),
          amenities: amenities || null,
          isActive: isActive !== undefined ? isActive : true
        }
      });
    } else {
      // Create new
      result = await prisma.guestHouseAvailability.create({
        data: {
          guestHouse,
          location,
          roomType,
          totalRooms: parseInt(totalRooms),
          availableRooms: availableRooms ? parseInt(availableRooms) : parseInt(totalRooms),
          pricePerNight: parseFloat(pricePerNight),
          amenities: amenities || null,
          isActive: isActive !== undefined ? isActive : true
        }
      });
    }

    return NextResponse.json({
      message: existing ? 'Availability updated successfully' : 'Availability added successfully',
      availability: result
    });

  } catch (error) {
    console.error('Error managing availability:', error);
    return NextResponse.json(
      { error: 'Failed to manage availability' },
      { status: 500 }
    );
  }
}

// PUT - Update availability (for room count changes)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const admin = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { id, availableRooms, isActive } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Missing availability ID' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (availableRooms !== undefined) {
      updateData.availableRooms = parseInt(availableRooms);
    }
    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }

    const result = await prisma.guestHouseAvailability.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({
      message: 'Availability updated successfully',
      availability: result
    });

  } catch (error) {
    console.error('Error updating availability:', error);
    return NextResponse.json(
      { error: 'Failed to update availability' },
      { status: 500 }
    );
  }
} 