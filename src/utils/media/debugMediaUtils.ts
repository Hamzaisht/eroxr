
import { 
  checkUrlContentType, 
  UrlContentInfo, 
  inferContentTypeFromUrl,
  getDisplayableMediaUrl
} from './urlUtils';

/**
 * Debug utility to check media URLs for issues
 */
export async function debugMediaUrl(url: string): Promise<{
  success: boolean;
  diagnostics: Record<string, any>;
}> {
  if (!url) {
    return {
      success: false,
      diagnostics: {
        error: 'Empty URL provided',
        url: null,
        timestamp: Date.now()
      }
    };
  }

  try {
    // Basic URL validation
    let isValid = true;
    let reason = '';
    
    try {
      new URL(url);
    } catch (e) {
      isValid = false;
      reason = 'Invalid URL format';
    }
    
    // Special URL handling
    if (url.startsWith('blob:') || url.startsWith('data:')) {
      return {
        success: true,
        diagnostics: {
          url_type: url.startsWith('blob:') ? 'blob' : 'data',
          url: url.substring(0, 50) + '...',
          isValid,
          message: 'Local URL, likely valid',
          timestamp: Date.now()
        }
      };
    }
    
    // Network check
    const networkCheck: UrlContentInfo = await checkUrlContentType(url);
    
    // Infer details from URL
    const inferredType = inferContentTypeFromUrl(url);
    
    return {
      success: networkCheck.isValid,
      diagnostics: {
        url: url,
        url_accessible: networkCheck.isValid,
        http_status: networkCheck.status,
        content_type: networkCheck.contentType,
        headers: networkCheck.headers,
        inferred_type: inferredType,
        timestamp: Date.now()
      }
    };
    
  } catch (error) {
    return {
      success: false,
      diagnostics: {
        error: error instanceof Error ? error.message : 'Unknown error',
        url,
        timestamp: Date.now()
      }
    };
  }
}

/**
 * Debug utility to test image loading
 */
export function debugImageLoading(url: string): Promise<{ success: boolean, message: string }> {
  return new Promise((resolve) => {
    if (!url) {
      resolve({ success: false, message: 'Empty URL provided' });
      return;
    }
    
    const img = new Image();
    
    const timeoutId = setTimeout(() => {
      resolve({ success: false, message: 'Image loading timed out' });
    }, 10000);
    
    img.onload = () => {
      clearTimeout(timeoutId);
      resolve({ 
        success: true, 
        message: `Image loaded successfully: ${img.width}x${img.height}`
      });
    };
    
    img.onerror = (error) => {
      clearTimeout(timeoutId);
      resolve({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Image loading failed'
      });
    };
    
    // Add cache-busting to the URL for accurate testing
    img.src = getDisplayableMediaUrl(url);
  });
}
