import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir, unlink, readdir } from 'fs/promises';
import { join } from 'path';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'profiles');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    // Clean up old profile pictures for this user
    try {
      const userEmailPrefix = session.user.email?.replace('@', '_').replace('.', '_');
      const files = await readdir(uploadsDir);
      const userFiles = files.filter(file => file.startsWith(`profile_${userEmailPrefix}_`));
      
      for (const oldFile of userFiles) {
        try {
          await unlink(join(uploadsDir, oldFile));
          console.log(`Deleted old profile picture: ${oldFile}`);
        } catch (deleteError) {
          console.warn(`Could not delete old file ${oldFile}:`, deleteError);
        }
      }
    } catch (cleanupError) {
      console.warn('Error during cleanup:', cleanupError);
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `profile_${session.user.email?.replace('@', '_').replace('.', '_')}_${timestamp}.${fileExtension}`;
    const filePath = join(uploadsDir, fileName);

    // Write file to disk
    await writeFile(filePath, buffer);

    // Return the public URL
    const imageUrl = `/uploads/profiles/${fileName}`;

    return NextResponse.json({
      message: 'Image uploaded successfully',
      imageUrl
    });

  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
} 