
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
      url: publicUrl
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
};
