const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding sample events...');

  // Get admin user
  const adminUser = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  });

  if (!adminUser) {
    console.log('❌ No admin user found. Please run seed-admin first.');
    return;
  }

  const sampleEvents = [
    {
      title: 'Annual NHAI Engineers Conference 2024',
      description: 'Join us for our flagship annual conference featuring keynote speakers, technical sessions, and networking opportunities for highway engineers across India.',
      eventDate: new Date('2024-03-15'),
      location: 'New Delhi Convention Center',
      isFeatured: true,
      isPublished: true,
      createdBy: adminUser.id
    },
    {
      title: 'Highway Safety Workshop',
      description: 'A comprehensive workshop on modern highway safety practices, traffic management systems, and accident prevention strategies.',
      eventDate: new Date('2024-02-20'),
      location: 'Mumbai Engineering Institute',
      isFeatured: false,
      isPublished: true,
      createdBy: adminUser.id
    },
    {
      title: 'Infrastructure Innovation Summit',
      description: 'Exploring cutting-edge technologies in highway construction, smart infrastructure, and sustainable development practices.',
      eventDate: new Date('2024-04-10'),
      location: 'Bangalore Tech Hub',
      isFeatured: true,
      isPublished: true,
      createdBy: adminUser.id
    },
    {
      title: 'Regional Engineers Meet - South Zone',
      description: 'Regional networking event for engineers working on highway projects in South India. Share experiences and best practices.',
      eventDate: new Date('2024-01-25'),
      location: 'Chennai Regional Office',
      isFeatured: false,
      isPublished: true,
      createdBy: adminUser.id
    },
    {
      title: 'Digital Highway Management Seminar',
      description: 'Learn about digital transformation in highway management, IoT applications, and data-driven decision making.',
      eventDate: new Date('2024-05-08'),
      location: 'Hyderabad Technology Center',
      isFeatured: false,
      isPublished: true,
      createdBy: adminUser.id
    }
  ];

  for (const eventData of sampleEvents) {
    try {
      const existingEvent = await prisma.event.findFirst({
        where: { title: eventData.title }
      });

      if (!existingEvent) {
        const event = await prisma.event.create({
          data: eventData
        });
        console.log(`✅ Created event: ${event.title}`);
      } else {
        console.log(`⏭️  Event already exists: ${eventData.title}`);
      }
    } catch (error) {
      console.error(`❌ Error creating event ${eventData.title}:`, error.message);
    }
  }

  console.log('🎉 Events seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding events:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 