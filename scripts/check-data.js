const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Checking governing body members in database...');

  const members = await prisma.governingBodyMember.findMany({
    orderBy: {
      order: 'asc'
    }
  });

  console.log(`Found ${members.length} members:`);
  members.forEach(member => {
    console.log(`- ${member.name} (${member.position})`);
  });

  if (members.length === 0) {
    console.log('No members found in database!');
  }
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 