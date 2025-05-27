import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const circulars = await prisma.circular.findMany({
      where: {
        isPublished: true
      },
      orderBy: {
        publishedAt: 'desc'
      }
    });

    return NextResponse.json(circulars);
  } catch (error) {
    console.error('Error fetching circulars:', error);
    return NextResponse.json(
      { error: 'Failed to fetch circulars' },
      { status: 500 }
    );
  }
} 