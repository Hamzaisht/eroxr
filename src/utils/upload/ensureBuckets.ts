
import { supabase } from "@/integrations/supabase/client";

export async function ensureStorageBuckets() {
  try {
    // List existing buckets
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error("Error listing buckets:", error);
      return;
    }
    
    const bucketNames = buckets?.map(bucket => bucket.name) || [];
    console.log("Existing buckets:", bucketNames);
    
    // Required buckets
    const requiredBuckets = ['media', 'stories', 'posts'];
    
    for (const bucketName of requiredBuckets) {
      if (!bucketNames.includes(bucketName)) {
        console.log(`Creating bucket: ${bucketName}`);
        const { error: createError } = await supabase.storage.createBucket(bucketName, {
          public: true,
          allowedMimeTypes: ['image/*', 'video/*'],
          fileSizeLimit: 1024 * 1024 * 100 // 100MB
        });
        
        if (createError) {
          console.error(`Error creating bucket ${bucketName}:`, createError);
        }
      }
    }
  } catch (error) {
    console.error("Error ensuring storage buckets:", error);
  }
}
