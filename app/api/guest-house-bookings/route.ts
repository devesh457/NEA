import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - List user's bookings
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const bookings = await prisma.guestHouseBooking.findMany({
      where: {
        userId: user.id
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

// POST - Create new booking
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const {
      guestHouse,
      location,
      checkIn,
      checkOut,
      guests,
      roomType,
      purpose,
      specialRequests
    } = await request.json();

    // Validate required fields
    if (!guestHouse || !location || !checkIn || !checkOut || !roomType || !purpose) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      return NextResponse.json(
        { error: 'Check-in date cannot be in the past' },
        { status: 400 }
      );
    }

    if (checkOutDate <= checkInDate) {
      return NextResponse.json(
        { error: 'Check-out date must be after check-in date' },
        { status: 400 }
      );
    }

    // Validate guests
    if (guests < 1 || guests > 10) {
      return NextResponse.json(
        { error: 'Number of guests must be between 1 and 10' },
        { status: 400 }
      );
    }

    // Check availability
    const availability = await prisma.guestHouseAvailability.findUnique({
      where: {
        guestHouse_roomType: {
          guestHouse: guestHouse.trim(),
          roomType: roomType.trim()
        }
      }
    });

    if (!availability || !availability.isActive) {
      return NextResponse.json(
        { error: 'Selected room type is not available at this guest house' },
        { status: 400 }
      );
    }

    if (availability.availableRooms < 1) {
      return NextResponse.json(
        { error: 'No rooms available for the selected type' },
        { status: 400 }
      );
    }

    const booking = await prisma.guestHouseBooking.create({
      data: {
        userId: user.id,
        guestHouse: guestHouse.trim(),
        location: location.trim(),
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests: parseInt(guests),
        roomType: roomType.trim(),
        purpose: purpose.trim(),
        specialRequests: specialRequests?.trim() || null,
        status: 'PENDING'
      }
    });

    return NextResponse.json({
      message: 'Booking created successfully',
      booking
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

// PUT - Cancel booking
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const { bookingId, action } = await request.json();

    if (!bookingId || action !== 'CANCEL') {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      );
    }

    // Get the booking and verify ownership
    const existingBooking = await prisma.guestHouseBooking.findUnique({
      where: { id: bookingId }
    });

    if (!existingBooking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    if (existingBooking.userId !== user.id) {
      return NextResponse.json(
        { error: 'You can only cancel your own bookings' },
        { status: 403 }
      );
    }

    if (existingBooking.status === 'CANCELLED') {
      return NextResponse.json(
        { error: 'Booking is already cancelled' },
        { status: 400 }
      );
    }

    if (existingBooking.status === 'REJECTED') {
      return NextResponse.json(
        { error: 'Cannot cancel a rejected booking' },
        { status: 400 }
      );
    }

    // Use transaction to cancel booking and restore availability
    const result = await prisma.$transaction(async (tx) => {
      // Update booking status to cancelled
      const booking = await tx.guestHouseBooking.update({
        where: { id: bookingId },
        data: {
          status: 'CANCELLED'
        }
      });

      // If the booking was approved, restore the room availability
      if (existingBooking.status === 'APPROVED') {
        const availability = await tx.guestHouseAvailability.findUnique({
          where: {
            guestHouse_roomType: {
              guestHouse: existingBooking.guestHouse,
              roomType: existingBooking.roomType
            }
          }
        });

        if (availability) {
          await tx.guestHouseAvailability.update({
            where: { id: availability.id },
            data: {
              availableRooms: availability.availableRooms + 1
            }
          });
        }
      }

      return booking;
    });

    return NextResponse.json({
      message: 'Booking cancelled successfully',
      booking: result
    });

  } catch (error) {
    console.error('Error cancelling booking:', error);
    return NextResponse.json(
      { error: 'Failed to cancel booking' },
      { status: 500 }
    );
  }
} 