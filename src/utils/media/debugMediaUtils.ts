
import { checkUrlContentType, addCacheBuster } from './urlUtils';

/**
 * Utility for debugging media URLs and connections
 */
export const debugMediaUrl = async (url: string): Promise<void> => {
  if (!url) {
    console.error('debugMediaUrl: Empty URL provided');
    return;
  }
  
  console.group('Media URL Debug Information');
  console.log('URL:', url);

  try {
    // Check if URL has cache busting parameters
    const hasCacheBuster = url.includes('?t=') || url.includes('&t=');
    console.log('Has cache busting:', hasCacheBuster);
    
    // Log URL parts
    try {
      const parsedUrl = new URL(url);
      console.log('Protocol:', parsedUrl.protocol);
      console.log('Host:', parsedUrl.host);
      console.log('Path:', parsedUrl.pathname);
      console.log('Query:', parsedUrl.search);
    } catch (e) {
      console.log('URL is not parseable as a standard URL');
    }
    
    // Try to fetch content type and headers
    try {
      const contentInfo = await checkUrlContentType(url);
      console.log('Content accessible:', contentInfo.isValid);
      console.log('Content type:', contentInfo.contentType);
      console.log('Status code:', contentInfo.status);
      console.log('Headers:', contentInfo.headers);
    } catch (e) {
      console.error('Error checking content type:', e);
    }

    // Create and test a fresh cache-busted URL
    const freshUrl = addCacheBuster(url.split('?')[0]);
    console.log('Fresh URL for testing:', freshUrl);
    
    // Provide recommendations
    console.log('Recommendations:');
    if (!hasCacheBuster) {
      console.log('- Add cache busting parameters to prevent browser caching');
    }
    
    console.log('- Check browser console network tab for detailed request info');
    console.log('- Verify CORS settings if applicable');
    console.log('- Check if the content exists at the specified path');

  } catch (e) {
    console.error('Error during URL debugging:', e);
  } finally {
    console.groupEnd();
  }
};
