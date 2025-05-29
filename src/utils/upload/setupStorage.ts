
import { supabase } from "@/integrations/supabase/client";

/**
 * Setup storage bucket and policies
 * This should be run once to initialize the storage system
 */
export const setupStorage = async () => {
  console.log("🔧 Setting up storage infrastructure...");
  
  try {
    // Check if media bucket exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error("❌ Error checking buckets:", bucketsError);
      return { success: false, error: bucketsError.message };
    }
    
    const mediaBucketExists = buckets?.some(bucket => bucket.id === 'media');
    
    if (!mediaBucketExists) {
      console.log("📦 Creating media storage bucket...");
      
      // Create the bucket using SQL since we need to ensure it's properly configured
      const { error: createError } = await supabase.rpc('exec_sql', {
        sql: `
          INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
          VALUES ('media', 'media', true, false, 104857600, ARRAY['image/*', 'video/*', 'audio/*'])
          ON CONFLICT (id) DO NOTHING;
        `
      });
      
      if (createError) {
        console.error("❌ Error creating bucket:", createError);
        return { success: false, error: createError.message };
      }
      
      console.log("✅ Media bucket created successfully");
    } else {
      console.log("✅ Media bucket already exists");
    }
    
    return { success: true };
    
  } catch (error: any) {
    console.error("💥 Storage setup error:", error);
    return { success: false, error: error.message };
  }
};

// Make function available globally for testing
if (typeof window !== 'undefined') {
  (window as any).setupStorage = setupStorage;
}
