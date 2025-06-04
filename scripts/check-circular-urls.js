const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Checking circular URLs in database...');
    
    // Get first 10 circulars to see what's in fileUrl
    const circulars = await prisma.circular.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        title: true,
        fileUrl: true,
        content: true
      }
    });

    console.log(`Found ${circulars.length} circulars:`);
    
    circulars.forEach((circular, index) => {
      console.log(`\n${index + 1}. Title: ${circular.title}`);
      console.log(`   FileURL: ${circular.fileUrl || 'NULL/EMPTY'}`);
      console.log(`   Content: ${circular.content?.substring(0, 100)}...`);
    });

    // Count how many have empty fileUrl
    const emptyUrls = await prisma.circular.count({
      where: {
        OR: [
          { fileUrl: null },
          { fileUrl: '' }
        ]
      }
    });

    const totalCirculars = await prisma.circular.count();
    
    console.log(`\n--- Summary ---`);
    console.log(`Total circulars: ${totalCirculars}`);
    console.log(`Empty fileURLs: ${emptyUrls}`);
    console.log(`With fileURLs: ${totalCirculars - emptyUrls}`);

  } catch (error) {
    console.error('Error checking circulars:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 