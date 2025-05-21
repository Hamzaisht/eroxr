
import { createUniqueFilePath, uploadFileToStorage } from '@/utils/media/mediaUtils';
import { uploadMediaToSupabase } from '@/utils/media/uploadUtils';

// Fix the uploadFileToStorage call with proper parameters
export const uploadFile = async (userId: string, fileToUpload: File) => {
  try {
    const options = { folder: userId };
    const result = await uploadMediaToSupabase(fileToUpload, 'posts', options);
    return result;
  } catch (error) {
    console.error('Error uploading file:', error);
    return { success: false, error: 'Failed to upload file' };
  }
};

export default uploadFile;
