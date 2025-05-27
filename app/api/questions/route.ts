import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const tag = searchParams.get('tag') || '';
    const sort = searchParams.get('sort') || 'recent'; // recent, popular, unanswered

    const skip = (page - 1) * limit;

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'popular') {
      orderBy = { views: 'desc' };
    } else if (sort === 'unanswered') {
      orderBy = { createdAt: 'desc' };
    }

    const where: any = {};
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (tag) {
      where.tags = { contains: tag };
    }

    if (sort === 'unanswered') {
      where.answers = { none: {} };
    }

    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              designation: true
            }
          },
          answers: {
            select: {
              id: true,
              isAccepted: true
            }
          },
          _count: {
            select: {
              answers: true,
              questionViews: true
            }
          }
        }
      }),
      prisma.question.count({ where })
    ]);

    return NextResponse.json({
      questions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const { title, content, tags } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const question = await prisma.question.create({
      data: {
        title,
        content,
        tags: tags ? JSON.stringify(tags) : null,
        authorId: user.id
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

    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json(
      { error: 'Failed to create question' },
      { status: 500 }
    );
  }
} 