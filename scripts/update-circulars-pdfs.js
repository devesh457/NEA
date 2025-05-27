const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Updating circulars with PDF URLs...');

  const updates = [
    {
      title: 'Annual General Meeting 2024',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    },
    {
      title: 'New Membership Benefits Program',
      fileUrl: 'https://www.africau.edu/images/default/sample.pdf'
    },
    {
      title: 'Updated Code of Conduct',
      fileUrl: 'https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf'
    }
  ];

  for (const update of updates) {
    try {
      const result = await prisma.circular.updateMany({
        where: {
          title: update.title
        },
        data: {
          fileUrl: update.fileUrl
        }
      });
      
      if (result.count > 0) {
        console.log(`Updated circular: ${update.title}`);
      } else {
        console.log(`Circular not found: ${update.title}`);
      }
    } catch (error) {
      console.error(`Error updating ${update.title}:`, error);
    }
  }

  console.log('Circulars PDF URLs update completed!');
}

main()
  .catch((e) => {
    console.error('Error updating circulars:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 