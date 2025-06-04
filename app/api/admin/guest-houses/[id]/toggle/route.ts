import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// PATCH - Toggle guest house active status
export async function PATCH(
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

    const { isActive } = await request.json();
    const { id } = params;

    // Check if guest house exists
    const existingGuestHouse = await prisma.guestHouseAvailability.findUnique({
      where: { id }
    }) as any;

    if (!existingGuestHouse) {
      return NextResponse.json({ error: 'Guest house not found' }, { status: 404 });
    }

    // If deactivating, check for active bookings
    if (!isActive) {
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
          error: 'Cannot deactivate guest house with active bookings. Please cancel or complete existing bookings first.' 
        }, { status: 400 });
      }
    }

    // Update guest house status
    const updatedGuestHouse = await prisma.guestHouseAvailability.update({
      where: { id },
      data: { isActive }
    }) as any;

    console.log('Guest house status updated:', updatedGuestHouse.id, 'Active:', isActive);

    return NextResponse.json({ 
      message: `Guest house ${isActive ? 'activated' : 'deactivated'} successfully`,
      guestHouse: updatedGuestHouse
    });

  } catch (error) {
    console.error('Error updating guest house status:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
} 