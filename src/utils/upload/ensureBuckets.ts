
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
    
    // Required buckets with their configurations
    const requiredBuckets = [
      {
        name: 'media',
        config: {
          public: true,
          allowedMimeTypes: ['image/*', 'video/*'],
          fileSizeLimit: 1024 * 1024 * 100 // 100MB
        }
      },
      {
        name: 'posts', 
        config: {
          public: true,
          allowedMimeTypes: ['image/*', 'video/*'],
          fileSizeLimit: 1024 * 1024 * 100 // 100MB
        }
      },
      {
        name: 'stories',
        config: {
          public: true,
          allowedMimeTypes: ['image/*', 'video/*'],
          fileSizeLimit: 1024 * 1024 * 100 // 100MB
        }
      }
    ];
    
    for (const bucket of requiredBuckets) {
      if (!bucketNames.includes(bucket.name)) {
        console.log(`Creating bucket: ${bucket.name}`);
        const { error: createError } = await supabase.storage.createBucket(bucket.name, bucket.config);
        
        if (createError) {
          console.error(`Error creating bucket ${bucket.name}:`, createError);
        } else {
          console.log(`Successfully created bucket: ${bucket.name}`);
        }
      } else {
        console.log(`Bucket ${bucket.name} already exists`);
      }
    }
  } catch (error) {
    console.error("Error ensuring storage buckets:", error);
  }
}
