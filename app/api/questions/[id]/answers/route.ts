import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const answers = await prisma.answer.findMany({
      where: { questionId: params.id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            designation: true
          }
        }
      },
      orderBy: [
        { isAccepted: 'desc' },
        { createdAt: 'asc' }
      ]
    });

    return NextResponse.json(answers);
  } catch (error) {
    console.error('Error fetching answers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch answers' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user || !user.isApproved) {
      return NextResponse.json(
        { error: 'User not found or not approved' },
        { status: 403 }
      );
    }

    // Check if question exists
    const question = await prisma.question.findUnique({
      where: { id: params.id }
    });

    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    const answer = await prisma.answer.create({
      data: {
        content,
        authorId: user.id,
        questionId: params.id
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            designation: true
          }
        }
      }
    });

    return NextResponse.json(answer, { status: 201 });
  } catch (error) {
    console.error('Error creating answer:', error);
    return NextResponse.json(
      { error: 'Failed to create answer' },
      { status: 500 }
    );
  }
} 