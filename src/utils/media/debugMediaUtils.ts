
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
      
      // Check if this is a Supabase storage URL
      const isSupabaseStorage = parsedUrl.pathname.includes('/storage/v1/object/');
      if (isSupabaseStorage) {
        console.log('URL type: Supabase Storage');
        
        // Extract bucket and path information
        const pathParts = parsedUrl.pathname.split('/');
        const bucketIndex = pathParts.indexOf('public') + 1;
        if (bucketIndex > 0 && bucketIndex < pathParts.length) {
          const bucket = pathParts[bucketIndex];
          const objectPath = pathParts.slice(bucketIndex + 1).join('/');
          console.log('Storage bucket:', bucket);
          console.log('Object path:', objectPath);
        }
      }
    } catch (e) {
      console.log('URL is not parseable as a standard URL');
    }
    
    // Try to fetch content type and headers
    try {
      const contentInfo = await checkUrlContentType(url);
      console.log('Content accessible:', contentInfo.isValid);
      console.log('Content type:', contentInfo.contentType);
      console.log('Status code:', contentInfo.status);
      
      // Log detailed error information if not valid
      if (!contentInfo.isValid) {
        console.error('Media access error:', contentInfo.status);
        if (contentInfo.errorBody) {
          console.error('Error details:', contentInfo.errorBody);
        }
      }
      
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
    console.log('- Ensure storage bucket permissions are correctly set');
    console.log('- Verify that the file hasn\'t been deleted or moved');

  } catch (e) {
    console.error('Error during URL debugging:', e);
  } finally {
    console.groupEnd();
  }
};

/**
 * Get diagnostic information about media errors
 */
export const getMediaErrorInfo = (url: string, error?: any): string => {
  let errorInfo = `Media failed to load from: ${url}\n`;
  
  try {
    // Parse URL to get components
    const parsedUrl = new URL(url);
    errorInfo += `Host: ${parsedUrl.host}\n`;
    errorInfo += `Path: ${parsedUrl.pathname}\n`;
    
    // Add error details if provided
    if (error) {
      if (typeof error === 'string') {
        errorInfo += `Error: ${error}\n`;
      } else if (error instanceof Error) {
        errorInfo += `Error: ${error.message}\n`;
        if (error.stack) {
          errorInfo += `Stack: ${error.stack.split('\n')[0]}\n`;
        }
      } else if (typeof error === 'object') {
        errorInfo += `Error: ${JSON.stringify(error)}\n`;
      }
    }
    
    // Add timestamp
    errorInfo += `Time: ${new Date().toISOString()}\n`;
  } catch (e) {
    errorInfo += `Unable to parse URL: ${e}\n`;
  }
  
  return errorInfo;
};

