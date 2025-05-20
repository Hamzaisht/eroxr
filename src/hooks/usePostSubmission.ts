
import { createUniqueFilePath, uploadFileToStorage } from '@/utils/media/mediaUtils';

// Fix the uploadFileToStorage call
const uploadFile = async (userId: string, file: File) => {
  const filePath = createUniqueFilePath(userId, file);
  const result = await uploadFileToStorage('posts', filePath, file);
  return result;
};

export { uploadFile };
