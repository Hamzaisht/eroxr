
/**
 * Debug a media URL by fetching its headers
 */
export async function debugMediaUrl(url: string): Promise<void> {
  try {
    // Only try to fetch if it's an HTTP URL
    if (url.startsWith('http')) {
      const response = await fetch(url, { method: 'HEAD' });
      console.group(`Media URL Debug: ${url}`);
      console.log('Status:', response.status, response.statusText);
      console.log('Content-Type:', response.headers.get('content-type'));
      console.log('Content-Length:', response.headers.get('content-length'));
      console.groupEnd();
    } else {
      console.warn('Cannot debug non-HTTP URL:', url);
    }
  } catch (error) {
    console.error('Error debugging media URL:', url, error);
  }
}

/**
 * Get detailed error information for a media URL
 */
export function getMediaErrorInfo(url: string): string {
  if (!url) {
    return 'No URL provided';
  }

  if (url.startsWith('data:') || url.startsWith('blob:')) {
    return 'Cannot debug in-memory URLs (data: or blob: schemes)';
  }

  if (!url.startsWith('http')) {
    return `URL does not have a recognized scheme: ${url}`;
  }

  // Check for common issues
  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    return 'URL references localhost which is not accessible from external clients';
  }

  // For relative URLs that might have been mishandled
  if (url.startsWith('/')) {
    return 'URL is relative and missing the domain';
  }

  return `Unknown issue with URL: ${url}. Check browser network tab for details.`;
}
