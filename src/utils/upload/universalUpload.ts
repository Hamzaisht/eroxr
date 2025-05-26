
import { supabase } from '@/integrations/supabase/client';
import { createUniqueFilePath, validateFileForUpload, runFileDiagnostic } from './fileUtils';
import { uploadFileToStorage, storeMediaAsset, UploadOptions, UploadResult } from './storageService';

/**
 * Universal media upload function
 * Handles file upload to storage and metadata storage in database
 */
export const uploadMedia = async (
  file: File,
  options: UploadOptions = {}
): Promise<UploadResult> => {
  try {
    // Run diagnostic
    runFileDiagnostic(file);

    // Validate file
    const validation = validateFileForUpload(file);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Authentication required' };
    }

    // Generate unique file path
    const storagePath = createUniqueFilePath(file, user.id);
    const bucket = options.bucket || 'media';

    // Upload to storage
    const storageResult = await uploadFileToStorage(bucket, storagePath, file);
    if (!storageResult.success) {
      return storageResult;
    }

    // Store metadata in database
    const metadataResult = await storeMediaAsset(
      file,
      storagePath,
      storageResult.url!,
      options
    );

    if (!metadataResult.success) {
      // Cleanup storage if metadata storage fails
      await supabase.storage.from(bucket).remove([storagePath]);
      return metadataResult;
    }

    return {
      success: true,
      url: storageResult.url,
      assetId: metadataResult.assetId
    };
  } catch (error: any) {
    console.error('Universal upload error:', error);
    return { 
      success: false, 
      error: error.message || 'Upload failed' 
    };
  }
};

/**
 * Upload multiple files
 */
export const uploadMultipleMedia = async (
  files: File[],
  options: UploadOptions = {}
): Promise<UploadResult[]> => {
  const results: UploadResult[] = [];
  
  for (const file of files) {
    const result = await uploadMedia(file, options);
    results.push(result);
  }
  
  return results;
};

/**
 * Upload with progress tracking
 */
export const uploadWithProgress = async (
  file: File,
  options: UploadOptions = {},
  onProgress?: (progress: number) => void
): Promise<UploadResult> => {
  // Start progress
  onProgress?.(0);
  
  const progressInterval = setInterval(() => {
    // Simulate progress (in real implementation, this would be actual upload progress)
    const randomProgress = Math.random() * 20;
    onProgress?.(Math.min(90, randomProgress));
  }, 300);

  try {
    const result = await uploadMedia(file, options);
    
    clearInterval(progressInterval);
    onProgress?.(100);
    
    return result;
  } catch (error: any) {
    clearInterval(progressInterval);
    onProgress?.(0);
    throw error;
  }
};
