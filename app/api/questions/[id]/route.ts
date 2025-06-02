import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    const question = await prisma.question.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            designation: true,
            imageUrl: true
          }
        },
        answers: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                designation: true,
                imageUrl: true
              }
            }
          },
          orderBy: [
            { isAccepted: 'desc' },
            { createdAt: 'asc' }
          ]
        },
        _count: {
          select: {
            answers: true,
            questionViews: true
          }
        }
      }
    });

    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    // Track unique user view if user is logged in
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email }
      });

      if (user) {
        // Check if this user has already viewed this question
        const existingView = await prisma.questionView.findUnique({
          where: {
            userId_questionId: {
              userId: user.id,
              questionId: params.id
            }
          }
        });

        // If user hasn't viewed this question before, create a view record
        if (!existingView) {
          await prisma.questionView.create({
            data: {
              userId: user.id,
              questionId: params.id
            }
          });

          // Update the views count to match the actual number of unique views
          const totalViews = await prisma.questionView.count({
            where: { questionId: params.id }
          });

          await prisma.question.update({
            where: { id: params.id },
            data: { views: totalViews }
          });
        }
      }
    }

    // Return the question with updated view count
    const updatedQuestion = await prisma.question.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            designation: true,
            imageUrl: true
          }
        },
        answers: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                designation: true,
                imageUrl: true
              }
            }
          },
          orderBy: [
            { isAccepted: 'desc' },
            { createdAt: 'asc' }
          ]
        },
        _count: {
          select: {
            answers: true,
            questionViews: true
          }
        }
      }
    });

    return NextResponse.json(updatedQuestion);
  } catch (error) {
    console.error('Error fetching question:', error);
    return NextResponse.json(
      { error: 'Failed to fetch question' },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const question = await prisma.question.findUnique({
      where: { id: params.id }
    });

    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    // Check if user is the author or admin
    if (question.authorId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { title, content, tags, isResolved } = await request.json();

    const updatedQuestion = await prisma.question.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(tags && { tags: JSON.stringify(tags) }),
        ...(typeof isResolved === 'boolean' && { isResolved })
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            designation: true
          }
        },
        _count: {
          select: {
            answers: true
          }
        }
      }
    });

    return NextResponse.json(updatedQuestion);
  } catch (error) {
    console.error('Error updating question:', error);
    return NextResponse.json(
      { error: 'Failed to update question' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const question = await prisma.question.findUnique({
      where: { id: params.id }
    });

    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    // Check if user is the author or admin
    if (question.authorId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    await prisma.question.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error);
    return NextResponse.json(
      { error: 'Failed to delete question' },
      { status: 500 }
    );
  }
} 