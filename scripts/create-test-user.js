const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@nea.org' }
    });

    if (existingUser) {
      console.log('Test user already exists!');
      return;
    }

    // Hash the password
    const password = process.env.TEST_PASSWORD || 'password123';
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create test user
    const user = await prisma.user.create({
      data: {
        email: 'test@nea.org',
        name: 'Test User',
        password: hashedPassword
      }
    });

    console.log('Test user created successfully!');
    console.log('Email: test@nea.org');
    console.log('Password: Check TEST_PASSWORD environment variable');

  } catch (e) {
    console.error('Error creating user:', e);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser(); 