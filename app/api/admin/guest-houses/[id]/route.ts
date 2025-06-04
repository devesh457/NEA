import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// PUT - Update guest house
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
    const adminUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    }) as any;

    if (!adminUser || adminUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const data = await request.json();
    const { id } = params;
    
    // Validate required fields
    const requiredFields = ['guestHouse', 'location', 'roomType', 'totalRooms', 'pricePerNight'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      }, { status: 400 });
    }

    // Check if guest house exists
    const existingGuestHouse = await prisma.guestHouseAvailability.findUnique({
      where: { id }
    }) as any;

    if (!existingGuestHouse) {
      return NextResponse.json({ error: 'Guest house not found' }, { status: 404 });
    }

    // Check if another guest house with same name and room type exists (excluding current one)
    const duplicateGuestHouse = await prisma.guestHouseAvailability.findFirst({
      where: {
        guestHouse: data.guestHouse,
        roomType: data.roomType,
        id: { not: id }
      }
    }) as any;

    if (duplicateGuestHouse) {
      return NextResponse.json({ 
        error: 'Another guest house with same name and room type already exists' 
      }, { status: 400 });
    }

    // Calculate available rooms adjustment
    const roomDifference = parseInt(data.totalRooms) - existingGuestHouse.totalRooms;
    const newAvailableRooms = Math.max(0, existingGuestHouse.availableRooms + roomDifference);

    // Update guest house
    const updatedGuestHouse = await prisma.guestHouseAvailability.update({
      where: { id },
      data: {
        guestHouse: data.guestHouse,
        location: data.location,
        roomType: data.roomType,
        totalRooms: parseInt(data.totalRooms),
        availableRooms: newAvailableRooms,
        pricePerNight: parseFloat(data.pricePerNight),
        amenities: data.amenities || null
      }
    }) as any;

    console.log('Guest house updated:', updatedGuestHouse.id);

    return NextResponse.json({ 
      message: 'Guest house updated successfully',
      guestHouse: updatedGuestHouse
    });

  } catch (error) {
    console.error('Error updating guest house:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// DELETE - Delete guest house
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
    const adminUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    }) as any;

    if (!adminUser || adminUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { id } = params;

    // Check if guest house exists
    const existingGuestHouse = await prisma.guestHouseAvailability.findUnique({
      where: { id }
    }) as any;

    if (!existingGuestHouse) {
      return NextResponse.json({ error: 'Guest house not found' }, { status: 404 });
    }

    // Check if there are any active bookings for this guest house
    const activeBookings = await prisma.guestHouseBooking.findMany({
      where: {
        guestHouse: existingGuestHouse.guestHouse,
        roomType: existingGuestHouse.roomType,
        status: { in: ['PENDING', 'APPROVED'] },
        checkOut: { gte: new Date() }
      }
    }) as any[];

    if (activeBookings.length > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete guest house with active bookings. Please cancel or complete existing bookings first.' 
      }, { status: 400 });
    }

    // Delete guest house
    await prisma.guestHouseAvailability.delete({
      where: { id }
    });

    console.log('Guest house deleted:', id);

    return NextResponse.json({ 
      message: 'Guest house deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting guest house:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
} 