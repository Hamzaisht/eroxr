
/**
 * Utility functions for debugging media URLs and troubleshooting loading issues
 */

import { inferContentTypeFromUrl, checkUrlContentType } from "./urlUtils";

/**
 * Debug a URL that's failing to load
 * This will log information about the URL to help diagnose issues
 */
export const debugMediaUrl = async (url: string | null): Promise<void> => {
  if (!url) {
    console.error("Cannot debug null URL");
    return;
  }
  
  console.group(`Debugging media URL: ${url}`);
  
  try {
    // Check URL format
    let urlObj: URL;
    try {
      urlObj = new URL(url);
      console.log("URL is valid and parses correctly");
      console.log("- Protocol:", urlObj.protocol);
      console.log("- Host:", urlObj.host);
      console.log("- Pathname:", urlObj.pathname);
      console.log("- Search params:", urlObj.search);
    } catch (e) {
      console.error("URL is not valid, cannot be parsed:", e);
      console.groupEnd();
      return;
    }
    
    // Infer content type
    const inferredType = inferContentTypeFromUrl(url);
    console.log("Inferred content type:", inferredType || "Unknown");
    
    // Try to fetch URL headers
    try {
      const contentInfo = await checkUrlContentType(url);
      console.log("URL accessibility check:", contentInfo.isValid ? "SUCCESS" : "FAILED");
      console.log("Status code:", contentInfo.status);
      console.log("Content type from headers:", contentInfo.contentType);
      console.log("All headers:", contentInfo.headers);
    } catch (e) {
      console.error("Error checking URL headers:", e);
    }
    
    // Check if URL has cache-busting parameters
    const hasCacheBusting = url.includes('t=') || url.includes('r=');
    console.log("Has cache-busting:", hasCacheBusting);
    
    // Check for CORS issues
    console.log("Potential CORS issue:", 
      url.includes('supabase') && !url.includes(window.location.hostname));
    
  } catch (error) {
    console.error("Error during URL debugging:", error);
  }
  
  console.groupEnd();
};

/**
 * Check if a media URL is from a storage bucket
 */
export const isStorageUrl = (url: string): boolean => {
  if (!url) return false;
  return url.includes('/storage/v1/object/') || url.includes('/storage/v1/bucket/');
};

/**
 * Extract bucket name from a storage URL if possible
 */
export const extractBucketFromUrl = (url: string): string | null => {
  if (!isStorageUrl(url)) return null;
  
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    
    // Look for 'bucket' in the path
    for (let i = 0; i < pathParts.length - 1; i++) {
      if (pathParts[i] === 'bucket') {
        return pathParts[i + 1] || null;
      }
    }
    
    return null;
  } catch (e) {
    console.error("Error extracting bucket from URL:", e);
    return null;
  }
};
