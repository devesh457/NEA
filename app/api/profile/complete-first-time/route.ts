import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'dateOfJoining', 'lastPlaceOfPosting', 'bloodGroup', 'dateOfBirth', 
      'employeeId', 'emergencyContactName', 'emergencyContactPhone', 
      'emergencyContactRelation', 'insuranceNomineeName', 'insuranceNomineePhone', 
      'insuranceNomineeRelation', 'imageUrl'
    ];

    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      }, { status: 400 });
    }

    // Check if employee ID is unique
    const existingUser = await prisma.user.findFirst({
      where: {
        employeeId: data.employeeId,
        email: { not: session.user.email }
      }
    }) as any;

    if (existingUser) {
      return NextResponse.json({ 
        error: 'Employee ID already exists' 
      }, { status: 400 });
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        dateOfJoining: new Date(data.dateOfJoining),
        lastPlaceOfPosting: data.lastPlaceOfPosting,
        bloodGroup: data.bloodGroup,
        dateOfBirth: new Date(data.dateOfBirth),
        employeeId: data.employeeId,
        emergencyContactName: data.emergencyContactName,
        emergencyContactPhone: data.emergencyContactPhone,
        emergencyContactRelation: data.emergencyContactRelation,
        insuranceNomineeName: data.insuranceNomineeName,
        insuranceNomineeRelation: data.insuranceNomineeRelation,
        insuranceNomineePhone: data.insuranceNomineePhone,
        imageUrl: data.imageUrl || null,
        isProfileComplete: true,
        lastPostingConfirmedAt: new Date(), // Set initial posting confirmation
        posting: data.lastPlaceOfPosting // Set current posting same as last posting initially
      }
    }) as any;

    return NextResponse.json({ 
      message: 'Profile completed successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        isProfileComplete: updatedUser.isProfileComplete,
        posting: updatedUser.posting
      }
    });

  } catch (error) {
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}