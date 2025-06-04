const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'profiles');

console.log('🧹 Cleaning up duplicate profile pictures...');

try {
  if (!fs.existsSync(uploadsDir)) {
    console.log('❌ Uploads directory does not exist');
    process.exit(1);
  }

  const files = fs.readdirSync(uploadsDir);
  const profileFiles = files.filter(file => file.startsWith('profile_') && file !== '.gitkeep');
  
  console.log(`📁 Found ${profileFiles.length} profile pictures`);

  // Group files by user email prefix
  const userFiles = {};
  profileFiles.forEach(file => {
    const match = file.match(/^profile_(.+?)_(\d+)\./);
    if (match) {
      const userPrefix = match[1];
      const timestamp = parseInt(match[2]);
      
      if (!userFiles[userPrefix]) {
        userFiles[userPrefix] = [];
      }
      
      userFiles[userPrefix].push({
        filename: file,
        timestamp: timestamp,
        path: path.join(uploadsDir, file)
      });
    }
  });

  let deletedCount = 0;

  // For each user, keep only the latest file
  Object.keys(userFiles).forEach(userPrefix => {
    const files = userFiles[userPrefix];
    
    if (files.length > 1) {
      // Sort by timestamp (newest first)
      files.sort((a, b) => b.timestamp - a.timestamp);
      
      // Keep the first (newest) file, delete the rest
      const filesToDelete = files.slice(1);
      
      filesToDelete.forEach(file => {
        try {
          fs.unlinkSync(file.path);
          console.log(`🗑️  Deleted: ${file.filename}`);
          deletedCount++;
        } catch (error) {
          console.error(`❌ Error deleting ${file.filename}:`, error.message);
        }
      });
      
      console.log(`✅ Kept latest file for user ${userPrefix}: ${files[0].filename}`);
    }
  });

  console.log(`\n🎉 Cleanup completed! Deleted ${deletedCount} duplicate files.`);
  
} catch (error) {
  console.error('❌ Error during cleanup:', error.message);
  process.exit(1);
} 