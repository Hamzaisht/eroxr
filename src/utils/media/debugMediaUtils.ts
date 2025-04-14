
import { supabase } from "@/integrations/supabase/client";

/**
 * Debug a media URL to help diagnose loading issues
 */
export const debugMediaUrl = async (url: string | null) => {
  if (!url) {
    console.error("Debug media: URL is null or undefined");
    return;
  }

  console.log("Debug media URL:", url);
  
  try {
    // Check if URL is accessible
    const response = await fetch(url, { method: 'HEAD' });
    console.log("URL status:", response.status);
    console.log("Content type:", response.headers.get('content-type'));
    
    // If it's a Supabase storage URL, check bucket and path
    if (url.includes('storage.googleapis') || url.includes('/storage/v1/')) {
      const urlParts = url.split('/');
      const bucketIndex = urlParts.findIndex(part => part === 'bucket');
      
      if (bucketIndex > -1) {
        const bucket = urlParts[bucketIndex + 1];
        const path = urlParts.slice(bucketIndex + 2).join('/').split('?')[0];
        
        console.log("Storage bucket:", bucket);
        console.log("Storage path:", path);
        
        // Check if object exists in storage
        const { data, error } = await supabase.storage
          .from(bucket)
          .download(path);
          
        if (error) {
          console.error("Storage error:", error);
        } else {
          console.log("Storage object exists, size:", data.size);
        }
      }
    }
  } catch (error) {
    console.error("Debug media error:", error);
  }
};
