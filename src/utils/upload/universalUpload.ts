
import { supabase } from "@/integrations/supabase/client";
import { MediaAccessLevel, UploadResult } from "../media/types";

export interface UploadOptions {
  accessLevel?: MediaAccessLevel;
  category?: string;
  metadata?: Record<string, any>;
}

export const uploadFile = async (
  file: File, 
  options: UploadOptions = {}
): Promise<UploadResult> => {
  try {
    const { accessLevel = MediaAccessLevel.PUBLIC, category = 'general' } = options;
    
    const fileName = `${category}/${Date.now()}_${file.name}`;
    const bucket = accessLevel === MediaAccessLevel.PRIVATE ? 'private-media' : 'media';
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return {
      success: true,
      url: publicUrl,
      assetId: data.path
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
};

export const uploadMedia = async (
  file: File,
  options: UploadOptions = {}
): Promise<UploadResult> => {
  return uploadFile(file, options);
};

export const uploadMultipleMedia = async (
  files: File[],
  options: UploadOptions = {}
): Promise<UploadResult[]> => {
  const results = await Promise.all(
    files.map(file => uploadFile(file, options))
  );
  return results;
};

export const uploadWithProgress = async (
  file: File,
  options: UploadOptions = {},
  onProgress?: (progress: number) => void
): Promise<UploadResult> => {
  // Simulate progress updates
  if (onProgress) {
    onProgress(25);
    setTimeout(() => onProgress(50), 100);
    setTimeout(() => onProgress(75), 200);
  }
  
  const result = await uploadFile(file, options);
  
  if (onProgress) {
    onProgress(100);
  }
  
  return result;
};
