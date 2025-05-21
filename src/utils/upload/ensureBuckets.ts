
import { supabase } from "@/integrations/supabase/client";

/**
 * Ensure all required storage buckets exist
 * This can be called during app initialization
 */
export const ensureStorageBuckets = async (): Promise<void> => {
  const requiredBuckets = ['media', 'avatars', 'posts'];
  
  for (const bucketName of requiredBuckets) {
    try {
      // Check if bucket exists
      const { data: existingBuckets } = await supabase.storage.listBuckets();
      const bucketExists = existingBuckets?.some(bucket => bucket.name === bucketName);
      
      if (!bucketExists) {
        console.log(`Creating missing bucket: ${bucketName}`);
        await supabase.storage.createBucket(bucketName, {
          public: true,
          fileSizeLimit: bucketName === 'avatars' ? 5242880 : 104857600 // 5MB for avatars, 100MB for others
        });
      }
    } catch (error) {
      console.error(`Error ensuring bucket ${bucketName} exists:`, error);
    }
  }
};
