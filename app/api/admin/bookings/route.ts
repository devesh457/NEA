import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - List all bookings for admin
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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const whereClause = status ? { status } : {};

    const bookings = await prisma.guestHouseBooking.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            designation: true,
            posting: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

// PUT - Approve or reject booking
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

    const { bookingId, action, rejectedReason, totalAmount } = await request.json();

    if (!bookingId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!['APPROVED', 'REJECTED'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    if (action === 'REJECTED' && !rejectedReason) {
      return NextResponse.json(
        { error: 'Rejection reason is required' },
        { status: 400 }
      );
    }

    const updateData: any = {
      status: action,
      approvedBy: admin.id,
      approvedAt: new Date()
    };

    if (action === 'REJECTED') {
      updateData.rejectedReason = rejectedReason;
    }

    if (action === 'APPROVED' && totalAmount) {
      updateData.totalAmount = parseFloat(totalAmount);
    }

    // Get the booking details first
    const existingBooking = await prisma.guestHouseBooking.findUnique({
      where: { id: bookingId }
    });

    if (!existingBooking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Use transaction to update booking and availability atomically
    const result = await prisma.$transaction(async (tx) => {
      // Update the booking
      const booking = await tx.guestHouseBooking.update({
        where: { id: bookingId },
        data: updateData,
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      });

      // If booking is approved, decrease available rooms
      if (action === 'APPROVED') {
        const availability = await tx.guestHouseAvailability.findUnique({
          where: {
            guestHouse_roomType: {
              guestHouse: existingBooking.guestHouse,
              roomType: existingBooking.roomType
            }
          }
        });

        if (availability && availability.availableRooms > 0) {
          await tx.guestHouseAvailability.update({
            where: { id: availability.id },
            data: {
              availableRooms: availability.availableRooms - 1
            }
          });
        }
      }

      return booking;
    });

    return NextResponse.json({
      message: `Booking ${action.toLowerCase()} successfully`,
      booking: result
    });

  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    );
  }
} 