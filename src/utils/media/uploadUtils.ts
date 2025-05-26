
import { supabase } from "@/integrations/supabase/client";
import { UploadResult, MediaAccessLevel } from "./types";

export const uploadMediaToSupabase = async (
  file: File,
  bucket: string,
  options?: {
    maxSizeMB?: number;
    folder?: string;
  }
): Promise<UploadResult> => {
  try {
    const { maxSizeMB = 10, folder = '' } = options || {};
    
    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      throw new Error(`File size exceeds ${maxSizeMB}MB limit`);
    }

    const fileName = `${folder ? folder + '/' : ''}${Date.now()}_${file.name}`;
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return {
      success: true,
      url: publicUrl
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
};
