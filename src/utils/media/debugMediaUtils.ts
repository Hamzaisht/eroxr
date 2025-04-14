
/**
 * Utility functions for debugging media URLs and troubleshooting loading issues
 */

import { inferContentTypeFromUrl, checkUrlContentType } from "./urlUtils";
import { supabase } from "@/integrations/supabase/client";

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
      console.log("- Host:", urlObj.hostname);
      console.log("- Pathname:", urlObj.pathname);
      console.log("- Search params:", urlObj.search);
    } catch (e) {
      console.error("URL is not valid, cannot be parsed:", e);
      console.groupEnd();
      return;
    }
    
    // Check if URL has cache-busting parameters
    const hasCacheBusting = url.includes('t=') || url.includes('r=');
    console.log("Has cache-busting:", hasCacheBusting);
    
    // Check for special URL types
    if (url.startsWith('blob:')) {
      console.log("This is a blob URL, which may be temporary");
      console.log("Blob URLs are not accessible across browser sessions or contexts");
    }
    
    if (url.startsWith('data:')) {
      console.log("This is a data URL encoding the actual content");
      console.log("Data URLs can be very large and may cause performance issues");
    }
    
    // Infer content type
    const inferredType = inferContentTypeFromUrl(url);
    console.log("Inferred content type:", inferredType || "Unknown");
    
    // Try to fetch URL headers
    try {
      console.log("Attempting to check URL headers...");
      const contentInfo = await checkUrlContentType(url);
      console.log("URL accessibility check:", contentInfo.isValid ? "SUCCESS" : "FAILED");
      console.log("Status code:", contentInfo.status);
      console.log("Content type from headers:", contentInfo.contentType);
      console.log("All headers:", contentInfo.headers);
    } catch (e) {
      console.error("Error checking URL headers:", e);
    }
    
    // Check for CORS issues
    const potentialCorsIssue = (
      url.includes('supabase') && !url.includes(window.location.hostname)
    );
    console.log("Potential CORS issue:", potentialCorsIssue);
    
    if (potentialCorsIssue) {
      console.log("CORS troubleshooting tips:");
      console.log("1. Check if the Storage bucket is configured correctly");
      console.log("2. Ensure proper CORS policies are set in Supabase");
      console.log("3. Verify that the URL is using the correct domain");
    }

    // Try a test fetch with img element
    console.log("Testing image load via DOM...");
    const imgTest = new Promise<string>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve("Image loaded successfully via DOM test");
      img.onerror = (e) => reject(`Image failed to load via DOM: ${e}`);
      img.src = url;
    });
    
    imgTest.then(
      result => console.log(result),
      error => console.error(error)
    );
    
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
    
    // Try to find bucket name in the typical Supabase URL pattern
    if (url.includes('storage/v1/object/public/')) {
      const match = url.match(/storage\/v1\/object\/public\/([^/]+)\//);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return null;
  } catch (e) {
    console.error("Error extracting bucket from URL:", e);
    return null;
  }
};

/**
 * Check for common media loading issues and provide diagnostic information
 */
export const diagnosePlatformMediaIssues = async (): Promise<{
  issues: string[];
  recommendations: string[];
}> => {
  const issues: string[] = [];
  const recommendations: string[] = [];
  
  try {
    // 1. Check if we can access Supabase storage
    console.log("Testing Supabase storage access...");
    const buckets = ['media', 'posts', 'avatars', 'stories'];
    for (const bucket of buckets) {
      try {
        const { data, error } = await supabase.storage.getBucket(bucket);
        if (error) {
          issues.push(`Cannot access ${bucket} bucket: ${error.message}`);
          recommendations.push(`Create ${bucket} bucket in Supabase storage`);
        } else {
          console.log(`${bucket} bucket is accessible`);
        }
      } catch (e: any) {
        issues.push(`Error checking ${bucket} bucket: ${e.message}`);
      }
    }
    
    // 2. Check if domain is allowed in CORS
    const currentDomain = window.location.origin;
    console.log(`Checking CORS for current domain: ${currentDomain}`);
    recommendations.push(`Ensure ${currentDomain} is added to allowed origins in Supabase project CORS settings`);
    
    // 3. Browser security policies
    if (window.location.protocol === 'https:') {
      console.log("Site is running on HTTPS, which is good for media loading");
    } else {
      issues.push("Site is not running on HTTPS, which can cause mixed content issues");
      recommendations.push("Deploy the site with HTTPS enabled");
    }
    
  } catch (e: any) {
    issues.push(`General diagnostic error: ${e.message}`);
  }
  
  return {
    issues,
    recommendations
  };
};
