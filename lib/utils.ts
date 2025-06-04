/**
 * Get the proper image URL for uploaded files
 * In development, files are served directly from /uploads
 * In production, files are served through Nginx or API route
 */
export function getImageUrl(imagePath: string | null | undefined): string | null {
  if (!imagePath) return null;
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) return imagePath;
  
  // If it doesn't start with /, add it
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  // In production, serve directly through Nginx (no port)
  if (process.env.NODE_ENV === 'production') {
    return normalizedPath;
  }
  
  // In development, serve directly
  return normalizedPath;
}

/**
 * Get cache-busted image URL for immediate display after upload
 */
export function getCacheBustedImageUrl(imagePath: string | null | undefined): string | null {
  const baseUrl = getImageUrl(imagePath);
  if (!baseUrl) return null;
  
  return `${baseUrl}?t=${Date.now()}`;
} 