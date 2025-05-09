
/**
 * Run comprehensive diagnostics on a File object to verify its integrity
 * This helps identify corrupted or detached File objects before upload
 */
export const runFileDiagnostic = async (file: File | null): Promise<void> => {
  if (!file) {
    console.error("❌ FILE DIAGNOSTIC: No file provided");
    return;
  }
  
  try {
    // Basic file validation
    const diagnostic = {
      isFile: file instanceof File,
      isBlob: file instanceof Blob,
      type: file.type,
      name: file.name,
      size: file.size,
      lastModified: file.lastModified,
      hasArrayBuffer: 'arrayBuffer' in file,
      hasStream: 'stream' in file,
      hasText: 'text' in file,
    };
    
    // Add preview URL
    let previewUrl: string | null = null;
    try {
      previewUrl = URL.createObjectURL(file);
      diagnostic['previewUrl'] = previewUrl ? 'Created successfully' : 'Failed';
    } catch (err) {
      diagnostic['previewUrl'] = `Error: ${err.message}`;
    }
    
    // Attempt to read the first few bytes to verify content integrity
    try {
      const headBytes = await file.slice(0, 100).text();
      diagnostic['headBytesLength'] = headBytes.length;
      diagnostic['headBytesStart'] = headBytes.substring(0, 20);
    } catch (err) {
      diagnostic['headBytesError'] = err.message;
    }
    
    // Log the comprehensive diagnostic
    console.log("🧬 FILE DIAGNOSTIC:", diagnostic);
    
    // Clean up preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  } catch (err) {
    console.error("❌ FILE DIAGNOSTIC ERROR:", err);
  }
};

/**
 * Create a unique file path for storage
 */
export const createUniqueFilePath = (userId: string, file: File): string => {
  const timestamp = new Date().getTime();
  const randomString = Math.random().toString(36).substring(2, 10);
  const fileExt = file.name.split('.').pop() || 'file';
  
  return `${userId}/${timestamp}-${randomString}.${fileExt}`;
};

/**
 * Create a preview URL for a file
 * @param file File to create preview for
 * @returns Object URL for the file
 */
export const createFilePreview = (file: File): string => {
  try {
    return URL.createObjectURL(file);
  } catch (error) {
    console.error("Error creating preview URL:", error);
    return "";
  }
};

/**
 * Revoke a file preview URL
 * @param previewUrl URL to revoke
 */
export const revokeFilePreview = (previewUrl: string | null): void => {
  if (previewUrl && previewUrl.startsWith('blob:')) {
    try {
      URL.revokeObjectURL(previewUrl);
    } catch (error) {
      console.error("Error revoking preview URL:", error);
    }
  }
};
