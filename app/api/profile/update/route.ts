import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { phone, designation, posting, imageUrl } = await request.json();

    // Get current user data to check if posting is changing
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        posting: true
      }
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: {
      phone?: string | null;
      designation?: string | null;
      posting?: string;
      lastPlaceOfPosting?: string;
      imageUrl?: string | null;
    } = {
      phone: phone?.trim() || null,
      designation: designation?.trim() || null,
      imageUrl: imageUrl || null
    };

    // Handle posting update logic
    if (posting?.trim()) {
      const newPosting = posting.trim();
      const currentPosting = currentUser.posting;

      // If posting is changing and there was a previous posting, move it to lastPlaceOfPosting
      if (currentPosting && currentPosting !== newPosting) {
        updateData.lastPlaceOfPosting = currentPosting;
      }
      
      updateData.posting = newPosting;
    } else {
      // If posting is being cleared, keep the current value
      updateData.posting = currentUser.posting || undefined;
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: {
        email: session.user.email
      },
      data: updateData
    });

    // Return only the fields we want to expose
    const responseUser = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      designation: updatedUser.designation,
      posting: updatedUser.posting,
      lastPlaceOfPosting: (updatedUser as any).lastPlaceOfPosting,
      imageUrl: updatedUser.imageUrl
    };

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: responseUser,
      postingChanged: updateData.lastPlaceOfPosting ? true : false
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
} 