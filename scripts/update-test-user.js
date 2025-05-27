const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Updating test user with profile data...');

  const updatedUser = await prisma.user.update({
    where: {
      email: 'test@nea.org'
    },
    data: {
      phone: '7877595017',
      designation: 'Deputy Manager(T)',
      posting: 'IT Division'
    }
  });

  console.log('Test user updated successfully:', {
    name: updatedUser.name,
    email: updatedUser.email,
    phone: updatedUser.phone,
    designation: updatedUser.designation,
    posting: updatedUser.posting
  });
}

main()
  .catch((e) => {
    console.error('Error updating test user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 