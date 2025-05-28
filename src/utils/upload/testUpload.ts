
import { uploadMediaToSupabase } from './supabaseUpload';

/**
 * Test function to verify upload system is working
 * Call this from browser console: window.testUpload()
 */
export const testUpload = async () => {
  console.log("🧪 Starting upload test...");
  
  try {
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
    console.log("📁 Created test file:", testFile);
    
    // Test upload
    const result = await uploadMediaToSupabase(testFile, {
      category: 'test',
      metadata: { 
        test: true, 
        timestamp: new Date().toISOString() 
      }
    });
    
    console.log("📊 Test upload result:", result);
    
    if (result.success) {
      console.log("✅ UPLOAD TEST PASSED!");
      console.log("🔗 File URL:", result.url);
      console.log("🆔 Asset ID:", result.assetId);
      return result;
    } else {
      console.error("❌ UPLOAD TEST FAILED:", result.error);
      return result;
    }
    
  } catch (error) {
    console.error("💥 Test upload error:", error);
    return { success: false, error: (error as Error).message };
  }
};

// Make test function available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).testUpload = testUpload;
}
