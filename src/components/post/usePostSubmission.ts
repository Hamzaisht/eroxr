
// Fix the uploadFileToStorage call
const filePath = createUniqueFilePath(session.user.id, file as File);
const result = await uploadFileToStorage('posts', filePath, file as File);
