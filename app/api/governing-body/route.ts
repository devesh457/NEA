import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const members = await prisma.governingBodyMember.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        order: 'asc'
      }
    });

    return NextResponse.json(members);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, position, email, phone, bio, imageUrl, order } = body;

    if (!name || !position) {
      return new NextResponse("Name and position are required", { status: 400 });
    }

    const member = await prisma.governingBodyMember.create({
      data: {
        name,
        position,
        email,
        phone,
        bio,
        imageUrl,
        order: order || 0
      }
    });

    return NextResponse.json(member);
  } catch (error) {
    console.log("[GOVERNING_BODY_CREATE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 