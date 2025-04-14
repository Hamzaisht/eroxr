
/**
 * Utility function to help debug media URLs
 */
export const debugMediaUrl = (url: string): void => {
  console.group('Media URL Debug Info:');
  console.log('URL:', url);
  
  // Log URL parts
  try {
    const urlObject = new URL(url);
    console.log('Protocol:', urlObject.protocol);
    console.log('Host:', urlObject.host);
    console.log('Pathname:', urlObject.pathname);
    console.log('Search params:', Object.fromEntries(urlObject.searchParams));
    
    // Check for common issues
    if (urlObject.protocol === 'http:' && window.location.protocol === 'https:') {
      console.warn('Mixed content warning: Loading HTTP content on an HTTPS page');
    }
    
    // Try to determine media type from URL
    const extension = urlObject.pathname.split('.').pop()?.toLowerCase();
    if (extension) {
      console.log('File extension:', extension);
      
      const videoExtensions = ['mp4', 'webm', 'mov', 'avi'];
      const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
      
      if (videoExtensions.includes(extension)) {
        console.log('Media type (based on extension): Video');
      } else if (imageExtensions.includes(extension)) {
        console.log('Media type (based on extension): Image');
      }
    }
  } catch (error) {
    console.error('Failed to parse URL:', error);
  }
  
  // Attempt to fetch headers
  fetch(url, { method: 'HEAD', mode: 'no-cors' })
    .then(() => console.log('HEAD request succeeded (no response details in no-cors)'))
    .catch(error => console.error('HEAD request failed:', error));
  
  console.groupEnd();
};
