
import { uploadMediaToSupabase } from './supabaseUpload';
import { setupStorage } from './setupStorage';

/**
 * Comprehensive test function to verify entire upload system
 */
export const testUpload = async () => {
  console.log("🧪 Starting comprehensive upload test...");
  
  try {
    // First, ensure storage is properly set up
    console.log("🔧 Setting up storage...");
    const setupResult = await setupStorage();
    
    if (!setupResult.success) {
      console.error("❌ Storage setup failed:", setupResult.error);
      return { success: false, error: setupResult.error };
    }
    
    // Create a test image file
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(0, 0, 100, 100);
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px Arial';
      ctx.fillText('TEST', 30, 55);
    }
    
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => resolve(blob!), 'image/png');
    });
    
    const testFile = new File([blob], 'test-upload.png', { type: 'image/png' });
    console.log("📁 Created test file:", {
      name: testFile.name,
      type: testFile.type,
      size: testFile.size
    });
    
    // Test upload
    console.log("📤 Starting upload test...");
    const result = await uploadMediaToSupabase(testFile, {
      category: 'test',
      metadata: { 
        test: true, 
        timestamp: new Date().toISOString(),
        usage: 'test'
      }
    });
    
    console.log("📊 Upload test result:", result);
    
    if (result.success) {
      console.log("✅ UPLOAD TEST PASSED!");
      console.log("🔗 File URL:", result.url);
      console.log("🆔 Asset ID:", result.assetId);
      
      // Test if we can fetch the uploaded asset from database
      if (result.assetId) {
        const { supabase } = await import("@/integrations/supabase/client");
        const { data: assetData, error: fetchError } = await supabase
          .from('media_assets')
          .select('*')
          .eq('id', result.assetId)
          .single();
          
        if (fetchError) {
          console.error("❌ Error fetching uploaded asset:", fetchError);
        } else {
          console.log("✅ Asset verified in database:", assetData);
        }
      }
      
      return result;
    } else {
      console.error("❌ UPLOAD TEST FAILED:", result.error);
      return result;
    }
    
  } catch (error: any) {
    console.error("💥 Test upload error:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Simple storage connectivity test
 */
export const testStorageConnection = async () => {
  console.log("🔗 Testing storage connection...");
  
  try {
    const { supabase } = await import("@/integrations/supabase/client");
    
    // Test bucket listing
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error("❌ Storage connection failed:", bucketsError);
      return { success: false, error: bucketsError.message };
    }
    
    console.log("✅ Storage connection successful. Buckets:", buckets?.map(b => b.name));
    
    // Check if media bucket exists
    const mediaBucket = buckets?.find(b => b.id === 'media');
    if (mediaBucket) {
      console.log("✅ Media bucket found:", mediaBucket);
    } else {
      console.warn("⚠️ Media bucket not found");
    }
    
    return { success: true, buckets };
    
  } catch (error: any) {
    console.error("💥 Storage connection error:", error);
    return { success: false, error: error.message };
  }
};

// Make test functions available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).testUpload = testUpload;
  (window as any).testStorageConnection = testStorageConnection;
}
