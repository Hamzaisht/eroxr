
import { createUniqueFilePath, uploadFileToStorage } from '@/utils/media/mediaUtils';

// Fix the uploadFileToStorage call with proper parameters
export const uploadFile = async (userId: string, fileToUpload: File) => {
  try {
    const filePath = createUniqueFilePath(userId, fileToUpload);
    const result = await uploadFileToStorage('posts', filePath, fileToUpload);
    return result;
  } catch (error) {
    console.error('Error uploading file:', error);
    return { success: false, error: 'Failed to upload file' };
  }
};

export default uploadFile;
