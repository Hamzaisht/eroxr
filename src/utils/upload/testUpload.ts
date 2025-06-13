
import { supabase } from '@/integrations/supabase/client';

export const testUpload = async (file: File, bucket: string = 'test-uploads') => {
  try {
    console.log('🧪 Testing upload:', { fileName: file.name, size: file.size, bucket });
    
    const fileName = `test_${Date.now()}_${file.name}`;
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);
    
    if (error) {
      console.error('❌ Test upload failed:', error);
      return { success: false, error: error.message };
    }
    
    console.log('✅ Test upload successful:', data);
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);
    
    return { 
      success: true, 
      data,
      publicUrl,
      fileName 
    };
  } catch (error: any) {
    console.error('💥 Test upload exception:', error);
    return { success: false, error: error.message };
  }
};

export const cleanupTestUpload = async (fileName: string, bucket: string = 'test-uploads') => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName]);
    
    if (error) {
      console.error('❌ Cleanup failed:', error);
      return false;
    }
    
    console.log('🧹 Test file cleaned up:', fileName);
    return true;
  } catch (error) {
    console.error('💥 Cleanup exception:', error);
    return false;
  }
};
