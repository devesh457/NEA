const fs = require('fs');
const path = require('path');

// Function to parse CSV (same as import script)
function parseCSV(csvContent) {
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',').map(header => header.trim().replace(/\r$/, ''));
  const data = [];
  
  console.log('Headers found:', headers);
  
  for (let i = 1; i < lines.length && i <= 5; i++) { // Only process first 5 rows for debugging
    if (lines[i].trim()) {
      console.log(`\nProcessing line ${i}: ${lines[i]}`);
      
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
      
      console.log('Parsed row:', row);
      console.log('Row length:', row.length, 'Headers length:', headers.length);
      
      if (row.length === headers.length) {
        const rowData = {};
        headers.forEach((header, index) => {
          rowData[header] = row[index];
        });
        console.log('Row data object:', rowData);
        data.push(rowData);
      } else {
        console.log('Skipping row due to length mismatch');
      }
    }
  }
  
  return data;
}

function main() {
  try {
    console.log('Debugging CSV parsing...');
    
    // Read the CSV file
    const csvPath = path.join(process.cwd(), 'nhai_circulars_final_v2.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    
    // Parse first few lines
    const circulars = parseCSV(csvContent);
    console.log(`\nParsed ${circulars.length} circulars:`);
    
    circulars.forEach((circular, index) => {
      console.log(`\n${index + 1}. Circular Number: ${circular.circular_no}`);
      console.log(`   Name: ${circular.name}`);
      console.log(`   Date: ${circular.date}`);
      console.log(`   Link: ${circular.link || 'EMPTY/UNDEFINED'}`);
    });

  } catch (error) {
    console.error('Error during debug:', error);
  }
}

main(); 