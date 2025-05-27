const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Creating test user...');

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      email: 'test@nea.org'
    }
  });

  if (existingUser) {
    console.log('Test user already exists!');
    console.log(`Email: ${existingUser.email}`);
    console.log(`Name: ${existingUser.name}`);
    return;
  }

  // Hash the password
  const password = 'password123';
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create the user
  const user = await prisma.user.create({
    data: {
      email: 'test@nea.org',
      name: 'Test User',
      password: hashedPassword
    }
  });

  console.log('Test user created successfully!');
  console.log(`Email: ${user.email}`);
  console.log(`Name: ${user.name}`);
  console.log(`Password: ${password}`);
  console.log('');
  console.log('You can now login with:');
  console.log('Email: test@nea.org');
  console.log('Password: password123');
}

main()
  .catch((e) => {
    console.error('Error creating user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 