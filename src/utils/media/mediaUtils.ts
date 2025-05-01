
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

// Create a unique file path for uploads
export const createUniqueFilePath = (userId: string, file: File): string => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  return `${userId}/${fileName}`;
};

// Upload file to storage
export const uploadFileToStorage = async (
  bucket: string,
  path: string,
  file: File
): Promise<UploadResult> => {
  try {
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return { 
      success: true, 
      url: data?.publicUrl
    };
  } catch (error: any) {
    console.error('Upload error:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to upload file' 
    };
  }
};

// Get file from storage
export const getFileFromStorage = async (
  bucket: string,
  path: string
): Promise<Blob | null> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(path);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Download error:', error);
    return null;
  }
};

// Delete file from storage
export const deleteFileFromStorage = async (
  bucket: string,
  path: string
): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Delete error:', error);
    return false;
  }
};
