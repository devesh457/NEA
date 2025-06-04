const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Function to parse CSV (fixed version)
function parseCSV(csvContent) {
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',').map(header => header.trim().replace(/\r$/, ''));
  const data = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim()) {
      // Handle CSV parsing with potential commas in quoted fields
      const row = [];
      let currentField = '';
      let inQuotes = false;
      
      for (let j = 0; j < lines[i].length; j++) {
        const char = lines[i][j];
        
        if (char === '"' && (j === 0 || lines[i][j-1] === ',')) {
          inQuotes = true;
        } else if (char === '"' && inQuotes && (j === lines[i].length - 1 || lines[i][j+1] === ',')) {
          inQuotes = false;
        } else if (char === ',' && !inQuotes) {
          row.push(currentField.trim());
          currentField = '';
        } else if (char !== '"' || inQuotes) {
          currentField += char;
        }
      }
      row.push(currentField.trim().replace(/\r$/, ''));
      
      if (row.length === headers.length) {
        const rowData = {};
        headers.forEach((header, index) => {
          rowData[header] = row[index];
        });
        data.push(rowData);
      }
    }
  }
  
  return data;
}

async function main() {
  try {
    console.log('Starting URL update process...');
    
    // Read the CSV file
    const csvPath = path.join(process.cwd(), 'nhai_circulars_final_v2.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    
    // Parse CSV data
    const circularsFromCSV = parseCSV(csvContent);
    console.log(`Found ${circularsFromCSV.length} circulars in CSV`);

    let updated = 0;
    let notFound = 0;
    
    for (const csvCircular of circularsFromCSV) {
      try {
        // Find the circular in database by circular number in title
        const existingCircular = await prisma.circular.findFirst({
          where: {
            title: {
              contains: csvCircular.circular_no
            }
          }
        });
        
        if (existingCircular) {
          // Update the fileUrl
          await prisma.circular.update({
            where: {
              id: existingCircular.id
            },
            data: {
              fileUrl: csvCircular.link
            }
          });
          
          console.log(`Updated ${csvCircular.circular_no}: ${csvCircular.link}`);
          updated++;
        } else {
          console.log(`Not found in DB: ${csvCircular.circular_no}`);
          notFound++;
        }
        
      } catch (error) {
        console.error(`Error updating ${csvCircular.circular_no}:`, error.message);
      }
    }
    
    console.log('\n--- Update Summary ---');
    console.log(`Total CSV records: ${circularsFromCSV.length}`);
    console.log(`Successfully updated: ${updated}`);
    console.log(`Not found in DB: ${notFound}`);
    
  } catch (error) {
    console.error('Error during update:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 