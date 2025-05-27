const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding governing body members...');

  const members = [
    {
      name: 'Dr. Sarah Johnson',
      position: 'President',
      email: 'president@nea.org',
      phone: '+1 (555) 123-4567',
      bio: 'Dr. Sarah Johnson brings over 20 years of experience in educational leadership and policy development. She has been instrumental in driving innovation and excellence in our association.',
      order: 1,
    },
    {
      name: 'Prof. Michael Chen',
      position: 'Vice President',
      email: 'vicepresident@nea.org',
      phone: '+1 (555) 234-5678',
      bio: 'Prof. Michael Chen is a renowned expert in organizational development with a passion for fostering collaborative environments and strategic growth.',
      order: 2,
    },
    {
      name: 'Ms. Emily Rodriguez',
      position: 'Secretary',
      email: 'secretary@nea.org',
      phone: '+1 (555) 345-6789',
      bio: 'Ms. Emily Rodriguez oversees all administrative functions and ensures smooth operations across all departments.',
      order: 3,
    },
    {
      name: 'Mr. David Thompson',
      position: 'Treasurer',
      email: 'treasurer@nea.org',
      phone: '+1 (555) 456-7890',
      bio: 'Mr. David Thompson manages the financial affairs of the association with expertise in budget planning and financial strategy.',
      order: 4,
    },
    {
      name: 'Dr. Lisa Wang',
      position: 'Board Member',
      email: 'lisa.wang@nea.org',
      phone: '+1 (555) 567-8901',
      bio: 'Dr. Lisa Wang contributes her expertise in technology and innovation to help modernize our association\'s operations.',
      order: 5,
    },
    {
      name: 'Mr. James Wilson',
      position: 'Board Member',
      email: 'james.wilson@nea.org',
      phone: '+1 (555) 678-9012',
      bio: 'Mr. James Wilson brings valuable industry connections and strategic insights to the governing body.',
      order: 6,
    },
  ];

  for (const member of members) {
    await prisma.governingBodyMember.create({
      data: member,
    });
    console.log(`Created member: ${member.name} - ${member.position}`);
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 