import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user data
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    }) as any;

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if profile is complete
    const requiredFields = [
      user.dateOfJoining,
      user.lastPlaceOfPosting,
      user.bloodGroup,
      user.dateOfBirth,
      user.employeeId,
      user.emergencyContactName,
      user.emergencyContactPhone,
      user.emergencyContactRelation,
      user.insuranceNomineeName,
      user.insuranceNomineePhone,
      user.insuranceNomineeRelation,
      user.posting
    ];

    const isProfileComplete = user.isProfileComplete && requiredFields.every(field => field !== null && field !== undefined);

    // Check if monthly confirmation is needed
    let needsMonthlyConfirmation = false;
    if (isProfileComplete && user.lastPostingConfirmedAt) {
      const lastConfirmation = new Date(user.lastPostingConfirmedAt);
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      const lastConfirmationMonth = lastConfirmation.getMonth();
      const lastConfirmationYear = lastConfirmation.getFullYear();

      // Need confirmation if it's a new month or new year
      needsMonthlyConfirmation = (
        currentYear > lastConfirmationYear ||
        (currentYear === lastConfirmationYear && currentMonth > lastConfirmationMonth)
      );
    } else if (isProfileComplete && !user.lastPostingConfirmedAt) {
      // First time after profile completion
      needsMonthlyConfirmation = true;
    }

    const response = {
      needsProfileCompletion: !isProfileComplete,
      needsMonthlyConfirmation,
      currentPosting: user.posting
    };

    return NextResponse.json(response);

  } catch (error) {
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
} 