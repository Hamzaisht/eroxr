
/**
 * Get a playable media URL with cache busting
 */
export function getPlayableMediaUrl(url: string): string {
  if (!url) return '';
  
  // Add cache busting for certain storage URLs
  if ((url.includes('storage/v1/object') || url.includes('cloudfront.net')) && !url.includes('?t=')) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}t=${Date.now()}`;
  }
  
  return url;
}
