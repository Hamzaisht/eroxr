
/**
 * Utility functions for debugging media URLs and content loading issues
 */

/**
 * Log detailed information about a media URL for debugging purposes
 */
export const debugMediaUrl = async (url: string) => {
  if (!url) {
    console.error('Cannot debug empty URL');
    return;
  }
  
  console.group(`Debug Media URL: ${url}`);
  
  // Basic URL information
  console.log('Protocol:', url.split('://')[0] || 'none');
  console.log('Domain:', new URL(url).hostname || 'N/A');
  console.log('Path:', new URL(url).pathname || 'N/A');
  console.log('Query parameters:', new URL(url).search || 'none');
  
  // Attempt a HEAD request to get metadata without downloading content
  try {
    const headResponse = await fetch(url, { 
      method: 'HEAD',
      mode: 'cors',
      cache: 'no-store' 
    });
    
    console.log('Status code:', headResponse.status, headResponse.statusText);
    console.log('Content type:', headResponse.headers.get('content-type') || 'unknown');
    console.log('Content length:', headResponse.headers.get('content-length') || 'unknown');
    console.log('CORS headers:', {
      'Access-Control-Allow-Origin': headResponse.headers.get('access-control-allow-origin') || 'none',
      'Access-Control-Allow-Methods': headResponse.headers.get('access-control-allow-methods') || 'none'
    });
  } catch (error) {
    console.error('HEAD request failed:', error);
    
    // Try a regular GET request with no-cors mode as fallback
    try {
      console.log('Trying fallback GET request...');
      const getResponse = await fetch(url, { 
        mode: 'no-cors',
        cache: 'no-store' 
      });
      console.log('GET request succeeded with opaque response');
    } catch (fallbackError) {
      console.error('All requests failed:', fallbackError);
    }
  }
  
  console.groupEnd();
};

/**
 * Get detailed error info for a media URL
 */
export const getMediaErrorInfo = (url: string): string => {
  // Check for common issues in the URL
  let issues = [];
  
  if (!url) {
    return 'Empty URL provided';
  }
  
  // Check protocol
  if (!url.startsWith('http') && !url.startsWith('data:') && !url.startsWith('blob:')) {
    issues.push('Missing or invalid protocol (should start with http, https, data:, or blob:)');
  }
  
  // Check for malformed URLs
  try {
    new URL(url);
  } catch (e) {
    issues.push('Malformed URL - cannot be parsed');
  }
  
  // Check for spaces or invalid characters
  if (url.includes(' ') || /[^\x00-\x7F]/.test(url)) {
    issues.push('URL contains spaces or non-ASCII characters');
  }
  
  // Check for excessive query parameters (possible corruption)
  if ((url.match(/\?/g) || []).length > 1) {
    issues.push('Multiple question marks in URL - possible corruption');
  }
  
  return issues.length > 0 
    ? `Media URL issues: ${issues.join('; ')}` 
    : 'No apparent issues with URL format';
};
