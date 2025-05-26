
import { supabase } from "@/integrations/supabase/client";

export async function ensureStorageBuckets() {
  try {
    console.log("ensureStorageBuckets - Starting bucket verification...");
    
    // List existing buckets
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error("ensureStorageBuckets - Error listing buckets:", listError);
      return;
    }
    
    const existingBuckets = buckets?.map(bucket => bucket.name) || [];
    console.log("ensureStorageBuckets - Existing buckets:", existingBuckets);
    
    // Required buckets with simplified configurations
    const requiredBuckets = [
      {
        id: 'media',
        name: 'media',
        public: true
      },
      {
        id: 'posts', 
        name: 'posts',
        public: true
      },
      {
        id: 'stories',
        name: 'stories',
        public: true
      },
      {
        id: 'avatars',
        name: 'avatars',
        public: true
      },
      {
        id: 'messages',
        name: 'messages',
        public: true
      }
    ];
    
    for (const bucket of requiredBuckets) {
      if (!existingBuckets.includes(bucket.name)) {
        console.log(`ensureStorageBuckets - Creating bucket: ${bucket.name}`);
        
        const { error: createError } = await supabase.storage.createBucket(bucket.id, {
          public: bucket.public,
          fileSizeLimit: bucket.name === 'avatars' ? 1024 * 1024 * 10 : 1024 * 1024 * 100, // 10MB for avatars, 100MB for others
          allowedMimeTypes: bucket.name === 'avatars' ? ['image/*'] : ['image/*', 'video/*', 'audio/*']
        });
        
        if (createError) {
          console.error(`ensureStorageBuckets - Error creating bucket ${bucket.name}:`, createError);
        } else {
          console.log(`ensureStorageBuckets - Successfully created bucket: ${bucket.name}`);
        }
      } else {
        console.log(`ensureStorageBuckets - Bucket ${bucket.name} already exists`);
      }
    }
    
    console.log("ensureStorageBuckets - Storage bucket setup complete");
  } catch (error) {
    console.error("ensureStorageBuckets - Unexpected error:", error);
  }
}
