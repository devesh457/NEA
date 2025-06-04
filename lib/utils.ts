/**
 * Get the proper image URL for uploaded files
 * In development, files are served directly from /uploads
 * In production, files are served through the API route
 */
export function getImageUrl(imagePath: string | null | undefined): string | null {
  if (!imagePath) return null;
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) return imagePath;
  
  // If it doesn't start with /, add it
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  // In production or when using PM2, use the API route
  if (process.env.NODE_ENV === 'production' || process.env.PM2_HOME) {
    return `/api${normalizedPath}`;
  }
  
  // In development, serve directly
  return normalizedPath;
} 