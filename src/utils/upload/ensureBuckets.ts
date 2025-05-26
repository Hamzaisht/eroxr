
import { supabase } from "@/integrations/supabase/client";

export async function ensureStorageBuckets() {
  try {
    console.log("Checking storage buckets...");
    
    // List existing buckets
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error("Error listing buckets:", listError);
      return;
    }
    
    const existingBuckets = buckets?.map(bucket => bucket.name) || [];
    console.log("Existing buckets:", existingBuckets);
    
    // Required buckets with their configurations
    const requiredBuckets = [
      {
        id: 'media',
        name: 'media',
        public: true,
        allowedMimeTypes: ['image/*', 'video/*', 'audio/*'],
        fileSizeLimit: 1024 * 1024 * 500 // 500MB
      },
      {
        id: 'posts', 
        name: 'posts',
        public: true,
        allowedMimeTypes: ['image/*', 'video/*'],
        fileSizeLimit: 1024 * 1024 * 100 // 100MB
      },
      {
        id: 'stories',
        name: 'stories',
        public: true,
        allowedMimeTypes: ['image/*', 'video/*'],
        fileSizeLimit: 1024 * 1024 * 100 // 100MB
      }
    ];
    
    for (const bucket of requiredBuckets) {
      if (!existingBuckets.includes(bucket.name)) {
        console.log(`Creating bucket: ${bucket.name}`);
        
        const { error: createError } = await supabase.storage.createBucket(bucket.id, {
          public: bucket.public,
          allowedMimeTypes: bucket.allowedMimeTypes,
          fileSizeLimit: bucket.fileSizeLimit
        });
        
        if (createError) {
          console.error(`Error creating bucket ${bucket.name}:`, createError);
        } else {
          console.log(`Successfully created bucket: ${bucket.name}`);
        }
      } else {
        console.log(`Bucket ${bucket.name} already exists`);
      }
    }
    
    console.log("Storage bucket setup complete");
  } catch (error) {
    console.error("Error ensuring storage buckets:", error);
  }
}
