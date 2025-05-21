
import { createUniqueFilePath } from '@/utils/media/mediaUtils';
import { uploadMediaToSupabase } from '@/utils/media/uploadUtils';

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
