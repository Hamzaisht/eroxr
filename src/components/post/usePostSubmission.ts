
// Replace the snippet:
// Fix the uploadFileToStorage call
const filePath = createUniqueFilePath(session.user.id, file as File);
const result = await uploadFileToStorage('posts', filePath, file as File);

// With:
import { createUniqueFilePath, uploadFileToStorage } from '@/utils/media/mediaUtils';

// Usage example:
// const sessionUserId = '123'; // Replace with actual user ID
// const fileToUpload = selectedFile; // Replace with actual file
// const filePath = createUniqueFilePath(sessionUserId, fileToUpload);
// const result = await uploadFileToStorage('posts', filePath, fileToUpload);
