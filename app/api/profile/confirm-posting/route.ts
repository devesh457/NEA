import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { posting } = await request.json();
    
    if (!posting?.trim()) {
      return NextResponse.json({ 
        error: 'Posting is required' 
      }, { status: 400 });
    }

    // Get current user data to check if posting is changing
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        posting: true
      }
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const newPosting = posting.trim();
    const currentPosting = currentUser.posting;

    // Prepare update data
    const updateData: {
      posting: string;
      lastPostingConfirmedAt: Date;
      lastPlaceOfPosting?: string;
    } = {
      posting: newPosting,
      lastPostingConfirmedAt: new Date()
    };

    // If posting is changing and there was a previous posting, move it to lastPlaceOfPosting
    if (currentPosting && currentPosting !== newPosting) {
      updateData.lastPlaceOfPosting = currentPosting;
    }

    // Update user's posting and confirmation timestamp
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: updateData
    });

    return NextResponse.json({ 
      message: 'Posting confirmed successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        posting: updatedUser.posting,
        lastPlaceOfPosting: (updatedUser as any).lastPlaceOfPosting,
        lastPostingConfirmedAt: (updatedUser as any).lastPostingConfirmedAt
      },
      postingChanged: updateData.lastPlaceOfPosting ? true : false
    });

  } catch (error) {
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
} 