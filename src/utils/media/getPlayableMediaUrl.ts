
/**
 * Gets a playable media URL with proper formatting
 * @param url - The URL to process
 * @returns The processed URL ready for playback
 */
export function getPlayableMediaUrl(url: string | undefined | null): string {
  if (!url) return '';
  
  // Clean and normalize URL
  let processedUrl = url;
  
  // Handle URL without protocol
  if (processedUrl.startsWith('//')) {
    processedUrl = `https:${processedUrl}`;
  }
  
  // Add protocol if missing
  if (!processedUrl.startsWith('http') && !processedUrl.startsWith('blob:') && !processedUrl.startsWith('data:')) {
    processedUrl = `https://${processedUrl}`;
  }
  
  // Add cache busting parameter
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return processedUrl.includes('?') 
    ? `${processedUrl}&t=${timestamp}&r=${random}` 
    : `${processedUrl}?t=${timestamp}&r=${random}`;
}

export default getPlayableMediaUrl;
