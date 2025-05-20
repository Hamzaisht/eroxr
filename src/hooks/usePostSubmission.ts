
import { createUniqueFilePath, uploadFileToStorage } from '@/utils/media/mediaUtils';

// Fix the uploadFileToStorage call with proper parameters
export const uploadFile = async (userId: string, file: File) => {
  try {
    const filePath = createUniqueFilePath(userId, file);
    const result = await uploadFileToStorage('posts', filePath, file);
    return result;
  } catch (error) {
    console.error('Error uploading file:', error);
    return { success: false, error: 'Failed to upload file' };
  }
};

export default uploadFile;
