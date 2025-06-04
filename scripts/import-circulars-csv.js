const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Function to parse CSV
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

// Function to parse date string
function parseDate(dateString) {
  // Expected format: DD.MM.YYYY
  const parts = dateString.split('.');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // JavaScript months are 0-indexed
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }
  return new Date();
}

async function main() {
  try {
    console.log('Starting CSV import...');
    
    // Read the CSV file
    const csvPath = path.join(process.cwd(), 'nhai_circulars_final_v2.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    
    // Parse CSV data
    const circulars = parseCSV(csvContent);
    console.log(`Found ${circulars.length} circulars in CSV`);
    
    let imported = 0;
    let skipped = 0;
    
    for (const circular of circulars) {
      try {
        // Check if circular already exists by exact circular number match
        const existing = await prisma.circular.findFirst({
          where: {
            title: {
              startsWith: circular.circular_no + ' -' // More specific: check if title starts with "circular_no - "
            }
          }
        });
        
        if (existing) {
          console.log(`Skipping existing circular: ${circular.circular_no}`);
          skipped++;
          continue;
        }
        
        // Create new circular
        const newCircular = await prisma.circular.create({
          data: {
            title: `${circular.circular_no} - ${circular.name}`,
            content: `Circular No: ${circular.circular_no}\nSubject: ${circular.name}\nDate: ${circular.date}`,
            fileUrl: circular.link,
            isPublished: true,
            publishedAt: parseDate(circular.date)
          }
        });
        
        console.log(`Imported: ${circular.circular_no}`);
        imported++;
        
      } catch (error) {
        console.error(`Error importing ${circular.circular_no}:`, error.message);
      }
    }
    
    console.log('\n--- Import Summary ---');
    console.log(`Total records in CSV: ${circulars.length}`);
    console.log(`Successfully imported: ${imported}`);
    console.log(`Skipped (already exists): ${skipped}`);
    console.log(`Failed: ${circulars.length - imported - skipped}`);
    
  } catch (error) {
    console.error('Error during import:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 