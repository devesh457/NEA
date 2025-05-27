const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding circulars...');

  const circulars = [
    {
      title: 'Annual General Meeting 2024',
      content: 'We are pleased to announce that the Annual General Meeting (AGM) for 2024 will be held on December 15, 2024, at 10:00 AM. All members are cordially invited to attend this important meeting where we will discuss the organization\'s achievements, financial reports, and future plans. The meeting will be held at the NEA headquarters conference hall. Please confirm your attendance by December 10, 2024.',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      publishedAt: new Date('2024-11-01'),
    },
    {
      title: 'New Membership Benefits Program',
      content: 'We are excited to introduce our enhanced membership benefits program effective January 1, 2025. The new program includes exclusive access to professional development workshops, networking events, industry publications, and career advancement resources. All current members will automatically be enrolled in the new program. For more details about the benefits and how to maximize your membership value, please visit our member portal.',
      fileUrl: 'https://www.africau.edu/images/default/sample.pdf',
      publishedAt: new Date('2024-10-15'),
    },
    {
      title: 'Professional Development Workshop Series',
      content: 'Join us for our quarterly professional development workshop series starting February 2025. This series will cover topics including leadership skills, project management, digital transformation, and industry best practices. Workshops will be conducted by industry experts and thought leaders. Registration is now open for NEA members. Limited seats available, so please register early to secure your spot.',
      publishedAt: new Date('2024-10-01'),
    },
    {
      title: 'Updated Code of Conduct',
      content: 'Please be informed that the NEA Code of Conduct has been updated to reflect current industry standards and best practices. All members are required to review and acknowledge the updated code by November 30, 2024. The updated document is available in the member portal under the "Governance" section. This update ensures our organization maintains the highest standards of professional ethics and conduct.',
      fileUrl: 'https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf',
      publishedAt: new Date('2024-09-20'),
    },
    {
      title: 'Industry Conference 2025 - Call for Papers',
      content: 'We are now accepting paper submissions for the NEA Industry Conference 2025, scheduled for March 15-17, 2025. This year\'s theme is "Innovation and Sustainability in the Digital Age." We invite researchers, practitioners, and industry experts to submit their original research papers, case studies, and innovative solutions. Submission deadline is January 15, 2025. Selected papers will be published in our conference proceedings.',
      publishedAt: new Date('2024-09-01'),
    }
  ];

  for (const circular of circulars) {
    const existingCircular = await prisma.circular.findFirst({
      where: {
        title: circular.title
      }
    });

    if (!existingCircular) {
      await prisma.circular.create({
        data: circular
      });
      console.log(`Created circular: ${circular.title}`);
    } else {
      console.log(`Circular already exists: ${circular.title}`);
    }
  }

  console.log('Circulars seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding circulars:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 