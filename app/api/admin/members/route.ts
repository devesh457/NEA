import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

    // Fetch all users with their complete profile information
    const members = await prisma.user.findMany({
      orderBy: [
        { isApproved: 'asc' }, // Pending users first
        { createdAt: 'desc' }  // Then by newest
      ]
    }) as any[];

    // Remove password from response
    const sanitizedMembers = members.map(member => {
      const { password, ...memberWithoutPassword } = member;
      return memberWithoutPassword;
    });

    return NextResponse.json({ 
      members: sanitizedMembers,
      total: sanitizedMembers.length,
      approved: sanitizedMembers.filter(m => m.isApproved).length,
      pending: sanitizedMembers.filter(m => !m.isApproved).length
    });

  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
} 