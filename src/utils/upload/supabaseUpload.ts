
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

export interface UploadResult {
  success: boolean;
  url?: string;
  assetId?: string;
  error?: string;
}

export interface UploadOptions {
  accessLevel?: 'private' | 'public' | 'subscribers_only';
  category?: string;
  metadata?: Record<string, any>;
}

/**
 * Upload file to Supabase Storage and create media_assets record
 */
export const uploadMediaToSupabase = async (
  file: File,
  options: UploadOptions = {}
): Promise<UploadResult> => {
  console.log("🔥 Starting upload process for file:", {
    name: file.name,
    type: file.type,
    size: file.size,
    lastModified: file.lastModified,
    isValidFile: file instanceof File
  });

  try {
    // Validate file
    if (!file || !(file instanceof File)) {
      console.error("❌ Invalid file object");
      return { success: false, error: 'Invalid file object' };
    }

    if (file.size === 0) {
      console.error("❌ File is empty");
      return { success: false, error: 'File is empty' };
    }

    if (file.size > 100 * 1024 * 1024) {
      console.error("❌ File too large:", Math.round(file.size / 1024 / 1024), "MB");
      return { success: false, error: 'File size exceeds 100MB limit' };
    }

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error("❌ Authentication error:", authError);
      return { success: false, error: 'User not authenticated' };
    }

    console.log("✅ User authenticated:", user.id);

    // Generate unique file path
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'bin';
    const fileName = `${options.category || 'posts'}/${uuidv4()}.${fileExtension}`;
    
    console.log("📁 Generated file path:", fileName);

    // Test storage connection first
    console.log("🔗 Testing storage connection...");
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error("❌ Storage connection failed:", bucketsError);
      return { success: false, error: `Storage connection failed: ${bucketsError.message}` };
    }
    
    console.log("✅ Storage connected. Available buckets:", buckets?.map(b => b.name));
    
    // Check if media bucket exists
    const mediaBucket = buckets?.find(b => b.id === 'media');
    if (!mediaBucket) {
      console.error("❌ Media bucket not found");
      return { success: false, error: 'Media storage bucket does not exist. Please run window.setupStorage() first.' };
    }
    
    console.log("✅ Media bucket found:", mediaBucket.name);

    // Upload to Supabase Storage
    console.log("📤 Uploading to storage bucket 'media'...");
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('media')
      .upload(fileName, file, {
        cacheControl: '3600',
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      console.error("❌ Storage upload error:", uploadError);
      return { success: false, error: `Storage upload failed: ${uploadError.message}` };
    }

    console.log("✅ File uploaded to storage:", uploadData);

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(uploadData.path);

    console.log("🔗 Generated public URL:", publicUrl);

    // Verify the uploaded file exists
    console.log("🔍 Verifying upload...");
    const { data: fileInfo, error: infoError } = await supabase.storage
      .from('media')
      .list(options.category || 'posts', {
        search: uploadData.path.split('/').pop()
      });
      
    if (infoError) {
      console.warn("⚠️ Could not verify upload:", infoError);
    } else {
      console.log("✅ Upload verified:", fileInfo);
    }

    // Create media_assets record
    const mediaType = getMediaType(file.type);
    const assetData = {
      user_id: user.id,
      storage_path: uploadData.path,
      original_name: file.name,
      file_size: file.size,
      mime_type: file.type,
      media_type: mediaType,
      access_level: options.accessLevel || 'public',
      alt_text: options.metadata?.altText || null,
      metadata: {
        ...options.metadata,
        uploadedAt: new Date().toISOString(),
        category: options.category || 'general'
      }
    };

    console.log("💾 Creating media_assets record:", assetData);

    const { data: assetRecord, error: assetError } = await supabase
      .from('media_assets')
      .insert(assetData)
      .select('id')
      .single();

    if (assetError) {
      console.error("❌ Database insert error:", assetError);
      // Try to clean up uploaded file
      console.log("🧹 Cleaning up uploaded file...");
      await supabase.storage.from('media').remove([uploadData.path]);
      return { success: false, error: `Database error: ${assetError.message}` };
    }

    console.log("✅ Media asset created:", assetRecord);

    const result = {
      success: true,
      url: publicUrl,
      assetId: assetRecord.id
    };

    console.log("🎉 Upload completed successfully:", result);
    return result;

  } catch (error: any) {
    console.error("💥 Unexpected upload error:", error);
    return { 
      success: false, 
      error: error.message || 'Unexpected error during upload' 
    };
  }
};

/**
 * Determine media type from MIME type
 */
function getMediaType(mimeType: string): 'image' | 'video' | 'audio' | 'document' {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  return 'document';
}

/**
 * Upload multiple files
 */
export const uploadMultipleMedia = async (
  files: File[],
  options: UploadOptions = {}
): Promise<UploadResult[]> => {
  console.log("📚 Starting batch upload for", files.length, "files");
  
  const results: UploadResult[] = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    console.log(`📄 Processing file ${i + 1}/${files.length}:`, file.name);
    
    const result = await uploadMediaToSupabase(file, options);
    results.push(result);
    
    if (!result.success) {
      console.error(`❌ Failed to upload file ${i + 1}:`, result.error);
    }
  }
  
  console.log("📊 Batch upload complete. Results:", results);
  return results;
};
